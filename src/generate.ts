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
    fs.copyFileSync(args.output + "/json/voivodeships.json", args.output + "/go/voivodeships.json")
    fs.copyFileSync(args.output + "/json/counties.json", args.output + "/go/counties.json")
    fs.copyFileSync(args.output + "/json/municipalities.json", args.output + "/go/municipalities.json")
    fs.copyFileSync(args.output + "/json/localities.json", args.output + "/go/localities.json")
    fs.copyFileSync(args.output + "/json/districts.json", args.output + "/go/districts.json")
    const data = `package poland
import (
    "embed"
)
    
//go:embed *.json
var FS embed.FS
`
    fs.writeFileSync(args.output + "/go/root.go", data)
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
