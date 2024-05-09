import fs from 'fs';
import { args } from "./args";
import { Computed } from "./compute";

function genJson(c: Computed) {
    fs.writeFileSync(args.output + "/json/voivodeships.json", JSON.stringify(c.voivodeships))
    fs.writeFileSync(args.output + "/json/counties.json", JSON.stringify(c.counties.Get1Deep()))
    fs.writeFileSync(args.output + "/json/municipalities.json", JSON.stringify(c.municipalities.Get2Deep()))
    fs.writeFileSync(args.output + "/json/localities.json", JSON.stringify(c.localities.Get3Deep()))
    fs.writeFileSync(args.output + "/json/districts.json", JSON.stringify(c.districts.Get4Deep()))
    fs.writeFileSync(args.output + "/json/streetsInLocalities.json", JSON.stringify(c.streetsLocalities.Get4Deep()))
    fs.writeFileSync(args.output + "/json/streetsInDistricts.json", JSON.stringify(c.streetsDistricts.Get5Deep()))

}

function genGo(c: Computed) {
    fs.copyFileSync(args.output + "/json/voivodeships.json", args.output + "/go/voivodeships.json")
    fs.copyFileSync(args.output + "/json/counties.json", args.output + "/go/counties.json")
    fs.copyFileSync(args.output + "/json/municipalities.json", args.output + "/go/municipalities.json")
    fs.copyFileSync(args.output + "/json/localities.json", args.output + "/go/localities.json")
    fs.copyFileSync(args.output + "/json/districts.json", args.output + "/go/districts.json")
    fs.copyFileSync(args.output + "/json/streetsInLocalities.json", args.output + "/go/streetsInLocalities.json")
    fs.copyFileSync(args.output + "/json/streetsInDistricts.json", args.output + "/go/streetsInDistricts.json")
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
    const counties = Object.entries(c.counties.Get1Deep()).map(data => `["${data[0]}", ${JSON.stringify(data[1])}]`).join(",")

    const data = `
export const voivodeships: Array<string> = ${voivodeships}
export const counties = new Map<string,Array<string>>([${counties}])
`
    fs.writeFileSync(args.output + "/typescript/data.ts", data)
}

export function generate(c: Computed) {
    genJson(c)
    genGo(c)
    genTypescript(c)
}
