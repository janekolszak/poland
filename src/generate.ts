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

export function generate(c: Computed) {
    genJson(c)
    genGo(c)
}
