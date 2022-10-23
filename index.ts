#!/usr/bin/env node
import { parseCsv } from "./src/csvparse"
import { compute } from "./src/compute"
import { generate } from "./src/generate"


(() => {
    parseCsv()
        .then(compute)
        .then(generate)
})();