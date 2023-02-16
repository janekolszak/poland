#!/usr/bin/env node
import { parseCsv, parseLocalityCsv, parseLocalityTypeCsv } from "./src/csvparse"
import { compute } from "./src/compute"
import { generate } from "./src/generate"


(() => {
    Promise.all([parseCsv(), parseLocalityCsv(), parseLocalityTypeCsv()])
        .then(r => compute(r[0], r[1], r[2]))
        .then(generate)
})();