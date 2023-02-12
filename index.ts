#!/usr/bin/env node
import { parseCsv, parseLocalityCsv } from "./src/csvparse"
import { compute } from "./src/compute"
import { generate } from "./src/generate"


(() => {
    // parseLocalityCsv().then(r => {
    //     console.log("IIII", r)

    // })
    Promise.all([parseCsv(), parseLocalityCsv()])
        .then(r => compute(r[0], r[1]))
        .then(generate)
})();