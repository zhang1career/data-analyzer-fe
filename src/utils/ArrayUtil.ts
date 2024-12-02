export function implode(arr: string[], symbol: string = ','): string {
    if (!arr) {
        return '';
    }
    return arr.join(symbol);
}

export function explode(str: string, symbol: string = ','): string[] {
    if (!str) {
        return [];
    }
    return str.split(symbol);
}