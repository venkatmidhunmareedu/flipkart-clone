/** Normalize Express 5 route params (typed as string | string[]) to a single string. */
export function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}
