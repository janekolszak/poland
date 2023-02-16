import { args } from "./args"
import { Computed } from "./compute"
import fs from 'fs';

function genJson(c: Computed) {
    fs.writeFileSync(args.output + "/json/voivodeships.json", JSON.stringify(c.voivodeships))
    fs.writeFileSync(args.output + "/json/counties.json", JSON.stringify(c.counties))
    fs.writeFileSync(args.output + "/json/municipalities.json", JSON.stringify(c.municipalities))
    fs.writeFileSync(args.output + "/json/localities.json", JSON.stringify(c.localities.Get3Deep()))
    fs.writeFileSync(args.output + "/json/districts.json", JSON.stringify(c.districts.Get4Deep()))

}

function genGo(c: Computed) {
    const voivodeships = c.voivodeships.map(v => `"${v}"`).join(",")
    const counties = JSON.stringify(c.counties).replace(/[\[]+/g, "{").replace(/[\]']+/g, "}")
    const municipalities = JSON.stringify(c.municipalities).replace(/[\[]+/g, "{").replace(/[\]']+/g, "}")

    const data = `package poland

var (
    Voivodeships = []string{${voivodeships}}
    Counties = map[string][]string${counties}
    Municipalities = map[string][]string${municipalities}
)`
    fs.writeFileSync(args.output + "/go/data.go", data)
}

function genTypescript(c: Computed) {
    const voivodeships = JSON.stringify(c.voivodeships)
    const counties = Object.entries(c.counties).map(data => `["${data[0]}", ${JSON.stringify(data[1])}]`).join(",")
    const municipalities = Object.entries(c.municipalities).map(data => `["${data[0]}", ${JSON.stringify(data[1])}]`).join(",")

    const data = `
export const voivodeships: Array<string> = ${voivodeships}
export const counties = new Map<string,Array<string>>([${counties}])
export const municipalities = new Map<string,Array<string>>([${municipalities}])
`
    fs.writeFileSync(args.output + "/typescript/data.ts", data)
}

export function generate(c: Computed) {
    genJson(c)
    genGo(c)
    genTypescript(c)
}
