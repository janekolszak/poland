import { args } from "./args"
import { Computed } from "./compute"
import fs from 'fs';

function genJson(c: Computed) {
    fs.writeFileSync(args.output + "/json/voivodeships.json", JSON.stringify(c.voivodeships))
    fs.writeFileSync(args.output + "/json/communities.json", JSON.stringify(c.communities))
    fs.writeFileSync(args.output + "/json/counties.json", JSON.stringify(c.counties))
}

export function generate(c: Computed) {
    genJson(c)
}
