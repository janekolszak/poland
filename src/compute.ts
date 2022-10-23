import { Region } from "./csvparse"

export interface NamesMap {
    [postcode: string]: Array<string>
};

export interface Computed {
    voivodeships: string[]
    counties: NamesMap
    municipalities: NamesMap
}

export function compute(regions: Array<Region>): Computed {
    let out: Computed = {
        voivodeships: [],
        counties: {},
        municipalities: {},
    }

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
        })

    // Gminy
    out.voivodeships.forEach(voivodeship => {
        const countiesIdMap: Map<string, string> = new Map(
            regions
                .filter(r => vivIdMap.get(r.voivodeship) === voivodeship)
                .filter(r => r.type === "powiat" || r.type.indexOf("na prawach powiatu") >= 0)
                .map(r => [r.county, r.name])
        )
        regions
            .filter(r => vivIdMap.get(r.voivodeship) === voivodeship)
            .filter(r => r.municipality !== "")
            .filter(r => r.type !== "województwo")
            .filter(r => r.type !== "powiat")
            .filter(r => r.type.indexOf("na prawach powiatu") === -1)
            .forEach(r => {
                const v = countiesIdMap.get(r.county)
                let d = out.municipalities[v!]
                d = d ? d : []
                if (d.includes(r.name)) {
                    return
                }
                out.municipalities[v!] = [...d, r.name]
            })
    })

    return out
}