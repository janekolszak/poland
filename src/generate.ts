import { args } from "./args"
import { Computed } from "./compute"
import fs from 'fs';

function genJson(c: Computed) {
    fs.writeFileSync(args.output + "/json/voivodeships.json", JSON.stringify(c.voivodeships))
    fs.writeFileSync(args.output + "/json/communities.json", JSON.stringify(c.communities))
    fs.writeFileSync(args.output + "/json/counties.json", JSON.stringify(c.counties))
}

function genGo(c: Computed) {
    const voivodeships = c.voivodeships.map(v => `"${v}"`).join(",")
    const communities = JSON.stringify(c.communities).replace(/[\[]+/g, "{").replace(/[\]']+/g, "}")
    const counties = JSON.stringify(c.counties).replace(/[\[]+/g, "{").replace(/[\]']+/g, "}")

    const data = `package regions

var (
    Voivodeships = []string{${voivodeships}}
    Communities = map[string][]string${communities}
    Counties = map[string][]string${counties}
)`
    fs.writeFileSync(args.output + "/go/data.go", data)
}

function genTypescript(c: Computed) {
    const voivodeships = JSON.stringify(c.voivodeships)
    const communities = Object.entries(c.communities).map(data => `["${data[0]}", ${JSON.stringify(data[1])}]`).join(",")
    const counties = Object.entries(c.counties).map(data => `["${data[0]}", ${JSON.stringify(data[1])}]`).join(",")

    const data = `
export const voivodeships: Array<string> = ${voivodeships}
export const communities = new Map<string,Array<string>>([${communities}])
export const counties = new Map<string,Array<string>>([${counties}])
`
    fs.writeFileSync(args.output + "/typescript/data.ts", data)
}

export function generate(c: Computed) {
    genJson(c)
    genGo(c)
    genTypescript(c)
}
