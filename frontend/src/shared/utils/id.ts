/**
 * Generates a unique ID with high collision resistance.
 * Combines timestamp, random values, and a counter for uniqueness.
 */
let idCounter = 0;

export function generateUniqueId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  const counter = (++idCounter).toString(36);
  return `${prefix}-${timestamp}-${randomPart}-${counter}`;
}

/**
 * Creates a simple UUID v4-like string.
 * Note: This is not a true UUID but provides good uniqueness for frontend use.
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
