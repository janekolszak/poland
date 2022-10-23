#!/usr/bin/env node
import { parseCsv } from "./src/csvparse"
import { compute } from "./src/compute"


(() => {
    parseCsv()
        .then(compute)
})();