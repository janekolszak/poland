import { Region } from "./csvparse"

export interface NamesMap {
    [postcode: string]: Array<string>
};

export interface Computed {
    voivodeships: string[]
    communities: NamesMap
    counties: NamesMap
}

export function compute(regions: Array<Region>): Computed {
    let out: Computed = {
        voivodeships: [],
        communities: {},
        counties: {}
    }

    // Województwa
    out.voivodeships = regions.filter(r => r.type === "województwo").map(r => r.name)

    // Powiaty
    const vivIdMap: Map<string, string> = new Map(regions.filter(r => r.type === "województwo").map(r => [r.vivodeship, r.name]))
    regions.filter(r => r.county === "" && r.type !== "województwo")
        .forEach(r => {
            const v = vivIdMap.get(r.vivodeship)
            let d = out.communities[v!]
            d = d ? d : []
            out.communities[v!] = [...d, r.name]
        })

    // Gminy
    out.voivodeships.forEach(vivodeship => {
        const communitiesIdMap: Map<string, string> = new Map(
            regions
                .filter(r => vivIdMap.get(r.vivodeship) === vivodeship)
                .filter(r => r.type === "powiat" || r.type.indexOf("na prawach powiatu") >= 0)
                .map(r => [r.community, r.name])
        )
        regions
            .filter(r => vivIdMap.get(r.vivodeship) === vivodeship)
            .filter(r => r.county !== "")
            .filter(r => r.type !== "województwo")
            .filter(r => r.type !== "powiat")
            .filter(r => r.type.indexOf("na prawach powiatu") === -1)
            .forEach(r => {
                const v = communitiesIdMap.get(r.community)
                let d = out.counties[v!]
                d = d ? d : []
                if (d.includes(r.name)) {
                    return
                }
                out.counties[v!] = [...d, r.name]
            })
    })

    return out
}