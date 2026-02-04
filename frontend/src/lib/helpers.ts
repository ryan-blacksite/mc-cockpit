/**
 * Purpose: Shared utility functions for the cockpit frontend.
 * Owns: Pure helper functions with no side effects.
 * Notes: Keep this file lean. Only add functions used in 2+ places.
 */

/** Formats a number with commas (e.g., 1234 → "1,234"). */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}
