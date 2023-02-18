import { NamesMapThreeKeys, NamesMapFourKeys, NamesMapTwoKeys } from "./compute";

export class MultiKeyMap {
    private map: Record<string, any> = {};

    private getKey(key: string[]): string {
        return key.join('|');
    }

    set(key: string[], value: any): void {
        const strKey = this.getKey(key);
        this.map[strKey] = value;
    }

    get(key: string[]): any | undefined {
        const strKey = this.getKey(key);
        return this.map[strKey];
    }

    delete(key: string[]): boolean {
        const strKey = this.getKey(key);

        if (strKey in this.map) {
            delete this.map[strKey];
            return true;
        }

        return false;
    }

    has(key: string[]): boolean {
        const strKey = this.getKey(key);
        return strKey in this.map;
    }

    get size(): number {
        return Object.keys(this.map).length;
    }

    clear(): void {
        this.map = {};
    }

    sortValues(): void {
        for (const strKey in this.map) {
            let value = this.map[strKey];
            value.sort()
        }
    }

    forEach(callbackfn: (keys: string[], value: any, map: MultiKeyMap) => void): void {
        for (const strKey in this.map) {
            const value = this.map[strKey];
            const keys = strKey.split('|');
            callbackfn(keys, value, this);
        }
    }

    Get2Deep(): NamesMapTwoKeys {
        var out: NamesMapTwoKeys = {}
        this.forEach((keys, value) => {
            const [v, c] = keys
            if (!out[v]) {
                out[v] = {}
            }
            if (!out[v][c]) {
                out[v][c] = []
            }
            out[v][c].push(value)
        })
        return out
    }

    Get3Deep(): NamesMapThreeKeys {
        var out: NamesMapThreeKeys = {}
        this.forEach((keys, value) => {
            const [v, c, m] = keys
            if (!out[v]) {
                out[v] = {}
            }
            if (!out[v][c]) {
                out[v][c] = {}
            }
            if (!out[v][c][m]) {
                out[v][c][m] = []
            }
            out[v][c][m].push(value)
        })
        return out
    }

    Get4Deep(): NamesMapFourKeys {
        var out: NamesMapFourKeys = {}
        this.forEach((keys, value) => {
            const [v, c, m, l] = keys
            if (!out[v]) {
                out[v] = {}
            }
            if (!out[v][c]) {
                out[v][c] = {}
            }
            if (!out[v][c][m]) {
                out[v][c][m] = {}
            }
            if (!out[v][c][m][l]) {
                out[v][c][m][l] = []
            }
            out[v][c][m][l].push(value)
        })
        return out
    }
}