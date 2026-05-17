let counter = 0;

export function generateId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function resetIdCounter(): void {
  counter = 0;
}
