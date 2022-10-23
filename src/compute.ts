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
    const communitiesIdMap: Map<string, string> = new Map(regions.filter(r => r.type === "powiat").map(r => [r.community, r.name]))
    regions.filter(r => r.county !== "" && r.type !== "województwo" && r.type !== "powiat")
        .forEach(r => {
            const v = communitiesIdMap.get(r.vivodeship)
            let d = out.counties[v!]
            d = d ? d : []
            out.counties[v!] = [...d, `${r.name} (${r.type})`  ]
        })

    console.log(out)
    return out
}