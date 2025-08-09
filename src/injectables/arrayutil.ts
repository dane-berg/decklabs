/**
 * Divides arr into arrays of length <= size, and calls func on each.
 */
export function forEachBatch<T>(
  arr: T[],
  size: number,
  func: (batch: T[], index: number) => void
): void {
  for (let i = 0; i < Math.ceil(arr.length / size); i++) {
    func(arr.slice(size * i, Math.min(size * (i + 1), arr.length)), i);
  }
}

/**
 * @returns the last element in the array that meets the predicate, or undefined if no elements meet the predicate
 */
export function findLast<T>(
  arr: T[],
  predicate: (value: T, index: number, obj: T[]) => unknown
): T | undefined {
  let index = arr.length - 1;
  while (index >= 0 && !predicate(arr[index], index, arr)) {
    index--;
  }
  return arr[index];
}

/**
 * @returns if both arrays have the same contents in the same order
 */
export function arrayEquals<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((e: T, i: number) => e === b[i]);
}
