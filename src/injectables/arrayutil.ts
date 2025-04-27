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
