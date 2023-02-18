import { LocalityType, Region, Locality } from "./csvparse"
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

export interface Computed {
    voivodeships: string[]
    counties: NamesMap
    municipalities: MultiKeyMap
    localities: MultiKeyMap
    districts: MultiKeyMap
}

export function compute(regions: Array<Region>, localities: Array<Locality>, localityTypes: Array<LocalityType>): Computed {
    let out: Computed = {
        voivodeships: [],
        counties: {},
        municipalities: new MultiKeyMap(),
        localities: new MultiKeyMap(),
        districts: new MultiKeyMap()
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
            let d = out.counties[v!]
            d = d ? d : []
            out.counties[v!] = [...d, r.name]

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
    const allLocalitiesIdMap = new Map(localities.map(r => [r.localityId, r.name]))

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
            const l = allLocalitiesIdMap.get(r.baseLocalityId)

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
    // console.log(out.districts)


    out.municipalities.sortValues()
    out.localities.sortValues()
    out.districts.sortValues()

    return out
}