export type EmptySet = Set<never>;

export function checkEmpty(set: Set<any> | null): set is EmptySet | null {
    return !set || set.size === 0;
}