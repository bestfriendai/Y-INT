// utils/safeJson.ts
// Safe JSON parsing utilities to prevent crashes from malformed data

/**
 * Safely parse a JSON string with a fallback value
 * @param jsonString - The string to parse
 * @param fallback - Value to return if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T>(
  jsonString: string | null | undefined,
  fallback: T
): T {
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }

  try {
    const parsed = JSON.parse(jsonString);
    return parsed as T;
  } catch (error) {
    if (__DEV__) {
      console.warn('safeJsonParse failed:', error);
      console.warn('Input was:', jsonString.substring(0, 100));
    }
    return fallback;
  }
}

/**
 * Safely stringify an object to JSON
 * @param value - The value to stringify
 * @param fallback - Value to return if stringification fails
 * @returns JSON string or fallback
 */
export function safeJsonStringify(
  value: unknown,
  fallback: string = '{}'
): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    if (__DEV__) {
      console.warn('safeJsonStringify failed:', error);
    }
    return fallback;
  }
}

/**
 * Parse route parameters that may contain JSON strings
 * Handles both encoded and plain JSON
 * @param param - The route parameter value
 * @param fallback - Value to return if parsing fails
 * @returns Parsed value or fallback
 */
export function parseRouteParam<T>(
  param: string | string[] | undefined,
  fallback: T
): T {
  if (!param) return fallback;

  // Handle array params (take first)
  const value = Array.isArray(param) ? param[0] : param;

  if (!value) return fallback;

  // Try to decode if URL encoded
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // If decoding fails, use original
  }

  return safeJsonParse(decoded, fallback);
}

/**
 * Type guard to check if a value is a valid object
 */
export function isValidObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a non-empty array
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}
