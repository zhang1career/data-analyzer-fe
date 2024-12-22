export function checkEmpty(arr: any[] | null): arr is [] | null{
    return !arr || arr.length === 0;
}

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