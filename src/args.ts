import { parse } from 'ts-command-line-args';

export interface Args {
    input: string;
    localities: string;
    streets: string;
    types: string;
    output: string;
    help?: boolean;
}

export const args = parse<Args>(
    {
        input: { type: String, alias: 'i', description: 'Input TERC CSV as downloaded from https://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne.aspx' },
        localities: { type: String, alias: 'l', description: 'Input SIMC CSV as downloaded from https://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne.aspx' },
        streets: { type: String, alias: 's', description: 'Input ULIC CSV as downloaded from https://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne.aspx' },
        types: { type: String, alias: 't', description: 'Input WMRODZ CSV as downloaded from https://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne.aspx' },
        output: { type: String, alias: 'o', description: 'Output file path' },
        help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
    },
    {
        helpArg: 'help',
        headerContentSections: [{ header: 'Administartive division of Poland', content: 'Download the latest data from https://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne.aspx and convert it into JSON' }],
    },
);
