export function Implode(arr: string[], symbol: string = ','): string {
    if (!arr) {
        return '';
    }
    return arr.join(symbol);
}