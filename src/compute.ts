import { Locality, LocalityType, Region, Street } from "./csvparse"
import { MultiKeyMap } from "./map"

export interface NamesMap {
    [postcode: string]: Array<string>
};

export interface NamesMapTwoKeys {
    [postcode: string]: NamesMap
};

export interface NamesMapThreeKeys {
    [postcode: string]: NamesMapTwoKeys
};

export interface NamesMapFourKeys {
    [postcode: string]: NamesMapThreeKeys
};

export interface NamesMapFiveKeys {
    [postcode: string]: NamesMapFourKeys
};

export interface Computed {
    voivodeships: string[]
    counties: MultiKeyMap
    municipalities: MultiKeyMap
    localities: MultiKeyMap
    districts: MultiKeyMap
    streetsLocalities: MultiKeyMap
    streetsDistricts: MultiKeyMap
}


const getFullName = (f: string, s: string): string => {
    if (!s || s === "") {
        return f
    }
    return f + " " + s
}
// RODZ_GMI
// 1 - gmina miejska,
// 2 - gmina wiejska,
// 3 - gmina miejsko-wiejska,
// 4 - miasto w gminie miejsko-wiejskiej,
// 5 - obszar wiejski w gminie miejsko-wiejskiej,
// 8 - dzielnica w m.st. Warszawa,
// 9 - delegatury miast: Kraków, Łódź, Poznań i Wrocław

export function compute(regions: Array<Region>, localities: Array<Locality>, localityTypes: Array<LocalityType>, streets: Array<Street>): Computed {
    let out: Computed = {
        voivodeships: [],
        counties: new MultiKeyMap(),
        municipalities: new MultiKeyMap(),
        localities: new MultiKeyMap(),
        districts: new MultiKeyMap(),
        streetsLocalities: new MultiKeyMap(),
        streetsDistricts: new MultiKeyMap()
    }

    const locTypeIdMap: Map<string, string> = new Map(localityTypes.map(r => [r.name, r.id]))

    const countyIdMap = new MultiKeyMap();
    const municipalityIdMap = new MultiKeyMap();

    // Województwa
    out.voivodeships = regions.filter(r => r.type === "województwo").map(r => r.name)

    // Powiaty
    const vivIdMap: Map<string, string> = new Map(regions.filter(r => r.type === "województwo").map(r => [r.voivodeship, r.name]))
    regions.filter(r => r.municipality === "" && r.type !== "województwo")
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            let d = out.counties.get([v!])
            d = d ? d : []
            out.counties.set([v!], [...d, r.name])

            countyIdMap.set([r.voivodeship, r.county], r.name)
        })

    // Gminy
    regions
        .filter(r => r.voivodeship !== "")
        .filter(r => r.county !== "")
        .filter(r => r.municipality !== "")
        .filter(r => r.type.startsWith("gmina"))
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])

            let d = out.municipalities.get([v, c]) as Array<string>
            d = d ? d : []
            if (!d.includes(r.name)) {
                out.municipalities.set([v, c], [...d, r.name])
            }

            municipalityIdMap.set([r.voivodeship, r.county, r.municipality], r.name)
        })

    // Miejscowosci
    let localityTypeIds = [
        locTypeIdMap.get("wieś"),
        locTypeIdMap.get("kolonia"),
        locTypeIdMap.get("osada"),
        locTypeIdMap.get("osada leśna"),
        locTypeIdMap.get("miasto")
    ]

    localities
        .filter(r => localityTypeIds.includes(r.localityTypeId))
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])
            const m = municipalityIdMap.get([r.voivodeship, r.county, r.municipality])

            if (!v || !c || !m) {
                console.error("Missing voivodeship, county or municipality for locality: " + r.name + " (" + r.voivodeship + ", " + r.county + ", " + r.municipality + ")")
                return
            }

            let d = out.localities.get([v, c, m]) as Array<string>
            d = d ? d : []
            if (!d.includes(r.name)) {
                out.localities.set([v, c, m], [...d, r.name])
                out.districts.set([v, c, m, r.name], [])
            }
        })

    // Dzielnice
    const allLocalitiesIdMap = new Map(localities.map(r => [r.localityId, r]))

    let districtIds = [
        locTypeIdMap.get("dzielnica"),
        locTypeIdMap.get("delegatura"),
        locTypeIdMap.get("część miasta"),
    ]

    // let a = new Map(localities.map(r => [r.localityTypeId, true]))
    // console.log(a)

    localities
        .filter(r => districtIds.includes(r.localityTypeId))
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])
            const m = municipalityIdMap.get([r.voivodeship, r.county, r.municipality])
            const l = allLocalitiesIdMap.get(r.baseLocalityId)?.name

            if (!v || !c || !m || !l) {
                // console.error("Missing voivodeship, county, municipality or base locality for district: " + r.name + " (" + v + ", " + c + ", " + m + ", " + l + ")")
                // console.error(r.voivodeship, r.county, r.municipality)
                return
            }

            let d = out.districts.get([v, c, m, l]) as Array<string>
            d = d ? d : []
            if (r.baseLocalityId === r.localityId) {
                out.districts.set([v, c, m, l], [...d])
            } else if (!d.includes(r.name)) {
                out.districts.set([v, c, m, l], [...d, r.name])
            }
        })

    // Dzielnice Warszawy
    regions
        .filter(r => r.typeId === "8")
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])
            const m = "Warszawa"
            const l = "Warszawa"

            if (!v || !c || !m || !l) {
                console.error("4 Missing voivodeship, county, municipality or base locality for district: " + r.name + " (" + v + ", " + c + ", " + m + ", " + l + ")")
                console.error(r.voivodeship, r.county, r.municipality)
                return
            }

            let d = out.districts.get([v, c, m, l]) as Array<string>
            d = d ? d : []
            out.districts.set([v, c, m, l], [...d, r.name])
        })


    // 9 - delegatury miast: Kraków, Łódź, Poznań i Wrocław
    regions
        .filter(r => r.typeId === "9")
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])
            const m = r.name.substring(0, r.name.indexOf('-'))
            const l = r.name.substring(0, r.name.indexOf('-'))
            const name = r.name.substring(r.name.indexOf('-') + 1)

            if (!v || !c || !m || !l) {
                console.error("4 Missing voivodeship, county, municipality or base locality for district: " + r.name + " (" + v + ", " + c + ", " + m + ", " + l + ")")
                console.error(r.voivodeship, r.county, r.municipality)
                return
            }

            let d = out.districts.get([v, c, m, l]) as Array<string>
            d = d ? d : []
            out.districts.set([v, c, m, l], [...d, name])
        })

    // Ulice w miejscowosciach
    let districtMunicipalityIds = ["8", "9"]
    streets
        .filter(r => !districtMunicipalityIds.includes(r.municipalityTypeId))
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])
            const m = municipalityIdMap.get([r.voivodeship, r.county, r.municipality])
            const l = allLocalitiesIdMap.get(r.localityId)

            if (!v || !c || !m || !l) {
                console.error("4 Missing voivodeship, county, municipality or base locality for district: " + r.name + " (" + v + ", " + c + ", " + m + ", " + l + ")")
                console.error(r.voivodeship, r.county, r.municipality)
                return
            }

            const fullName = getFullName(r.name, r.restName)

            if (districtIds.includes(l.localityTypeId)) {
                const d = out.districts.get([v, c, m, l.name])
                if (!d) {
                    console.error("Missing district: " + r.name)
                    return
                }

                let s = out.streetsDistricts.get([v, c, m, l.name, d])
                s = s ? s : []
                if (!s.includes(fullName)) {
                    out.streetsDistricts.set([v, c, m, l.name, d], [...s, fullName])
                }
            } else {
                let s = out.streetsLocalities.get([v, c, m, l.name])
                s = s ? s : []
                if (!s.includes(fullName)) {
                    out.streetsLocalities.set([v, c, m, l.name], [...s, fullName])
                }
            }
        })

    // Ulice w dzielnicach Warszawy
    streets
        .filter(r => r.municipalityTypeId === "8")
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])
            const m = "Warszawa"
            const l = "Warszawa"
            const d = allLocalitiesIdMap.get(r.localityId)?.name


            if (!v || !c || !m || !l || !d) {
                console.error("4 Missing voivodeship, county, municipality or base locality for district: " + r.name + " (" + v + ", " + c + ", " + m + ", " + l + ")")
                console.error(r.voivodeship, r.county, r.municipality)
                return
            }

            let s = out.streetsDistricts.get([v, c, m, l, d])
            s = s ? s : []
            const fullName = getFullName(r.name, r.restName)

            if (!s.includes(fullName)) {
                out.streetsDistricts.set([v, c, m, l, d], [...s, fullName])
            }
        })

    // Ulice w delegaturach miast
    streets
        .filter(r => r.municipalityTypeId === "9")
        .forEach(r => {
            const v = vivIdMap.get(r.voivodeship)
            const c = countyIdMap.get([r.voivodeship, r.county])

            const name = allLocalitiesIdMap.get(r.localityId)?.name
            const d = name?.substring(name.indexOf('-') + 1)
            const m = name?.substring(0, name?.indexOf('-'))
            const l = name?.substring(0, name?.indexOf('-'))

            if (!v || !c || !m || !l || !d) {
                console.error("4 Missing voivodeship, county, municipality or base locality for district: " + r.name + " (" + v + ", " + c + ", " + m + ", " + l + ")")
                console.error(r.voivodeship, r.county, r.municipality)
                return
            }

            let s = out.streetsDistricts.get([v, c, m, l, d])
            s = s ? s : []
            const fullName = getFullName(r.name, r.restName)
            if (!s.includes(fullName)) {
                out.streetsDistricts.set([v, c, m, l, d], [...s, fullName])
            }
        })

    // Sort all lists
    out.municipalities.sortValues()
    out.counties.sortValues()
    out.localities.sortValues()
    out.districts.sortValues()
    out.streetsLocalities.sortValues()
    out.streetsDistricts.sortValues()

    return out
}