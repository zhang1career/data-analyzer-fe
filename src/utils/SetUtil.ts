export type EmptySet = Set<never>;

export function checkEmpty(set: Set<any> | undefined | null): set is null | undefined | EmptySet {
    return !set || set.size === 0;
}