/**
 * Deterministic sampling: take every nth element to reach target size
 */
export function sampleData(data: unknown[], maxPoints: number): unknown[] {
  if (data.length <= maxPoints) return data;
  
  const step = data.length / maxPoints;
  const sampled: unknown[] = [];
  
  for (let i = 0; i < maxPoints; i++) {
    const index = Math.floor(i * step);
    sampled.push(data[index]);
  }
  
  return sampled;
}

/**
 * Sample rows deterministically
 */
export function sampleRows(rows: string[][], maxPoints: number): string[][] {
  return sampleData(rows, maxPoints) as string[][];
}
