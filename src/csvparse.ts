import fs from 'fs';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { args } from './args';

export type Region = {
    voivodeship: string;
    county: string;
    municipality: string;
    type: string;
    typeId: number;
    name: string;
    date: string;
};

function toTitleCase(str: String) {
    return str.split(' ')
        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ')
        .split('-')
        .map(w => w[0].toUpperCase() + w.substring(1))
        .join('-')

}
export async function parseCsv() {
    const records: Region[] = [];
    const parser = fs
        .createReadStream(args.input)
        .pipe(parse({
            delimiter: ';',
            skip_empty_lines: true,
            record_delimiter: '\r\n',
            columns: () => {
                return ["voivodeship", "county", "municipality", "typeId", "name", "type", "date"]
            },
        }))
        .on('readable', function () {
            let record; while ((record = parser.read()) !== null) {
                // Work with each record
                record.name = toTitleCase(record.name)
                records.push(record);
            }
        });
    await finished(parser);
    return records;
};

export async function parseLocalityCsv() {
    const records: Region[] = [];
    const parser = fs
        .createReadStream(args.localities )
        .pipe(parse({
            relax_quotes: true,
            delimiter: ';',
            skip_empty_lines: true,
            record_delimiter: '\r\n',
            columns: () => {
                return ["voivodeship", "county", "municipality", "typeId", "localityTypeId", "isLocalName", "name", "localityId", "baseLocalityId", "date"]
            },
        }))
        .on('readable', function () {
            let record; while ((record = parser.read()) !== null) {
                // Work with each record
                record.name = toTitleCase(record.name)
                records.push(record);
            }
        });
    await finished(parser);
    return records;
};