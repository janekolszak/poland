#!/usr/bin/env node
import { parseCsv, parseLocalityCsv, parseLocalityTypeCsv, parseStreetsCsv } from "./src/csvparse"
import { compute } from "./src/compute"
import { generate } from "./src/generate"


(() => {
    Promise.all([parseCsv(), parseLocalityCsv(), parseLocalityTypeCsv(), parseStreetsCsv()])
        .then(r => compute(r[0], r[1], r[2], r[3]))
        .then(generate)
})();