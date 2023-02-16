import fs from 'fs';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { args } from './args';

export type Region = {
    voivodeship: string;
    county: string;
    municipality: string;
    type: string;
    typeId: string;
    name: string;
    date: string;
    localityId: string;
    baseLocalityId: string;
};

export type Locality = {
    voivodeship: string
    county: string;
    municipality: string;
    municipalityTypeId: string;
    localityTypeId: string;
    isLocalName: string;
    name: string;
    localityId: string;
    baseLocalityId: string;
    date: string;
};

export type LocalityType = {
    id: string;
    name: string;
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
    const records: Locality[] = [];
    const parser = fs
        .createReadStream(args.localities)
        .pipe(parse({
            relax_quotes: true,
            delimiter: ';',
            skip_empty_lines: true,
            record_delimiter: '\r\n',
            columns: () => {
                return ["voivodeship", "county", "municipality", "municipalityTypeId", "localityTypeId", "isLocalName", "name", "localityId", "baseLocalityId", "date"]
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

export async function parseLocalityTypeCsv() {
    const records: LocalityType[] = [];
    const parser = fs
        .createReadStream(args.types)
        .pipe(parse({
            relax_quotes: true,
            delimiter: ';',
            skip_empty_lines: true,
            record_delimiter: '\r\n',
            columns: () => {
                return ["id", "name", "date"]
            },
        }))
        .on('readable', function () {
            let record; while ((record = parser.read()) !== null) {
                // Work with each record
                // record.name = toTitleCase(record.name)
                records.push(record);
            }
        });
    await finished(parser);
    return records;
};