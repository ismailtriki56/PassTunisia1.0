/**
 * Date formatting utilities explicitly locked to "en-US" locale.
 * Never relies on browser or OS default locale.
 */

export function formatEnglishDate(
  dateInput: string | Date,
  options?: {
    formatStyle?: 'short' | 'medium' | 'long' | 'full';
    includeWeekday?: boolean;
  }
): string {
  if (!dateInput) return '';

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);

    const style = options?.formatStyle || 'medium';

    if (style === 'short') {
      // e.g. "Oct 1, 2026"
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }

    if (style === 'long' || style === 'full') {
      // e.g. "Thursday, October 1, 2026" or "October 1, 2026"
      return new Intl.DateTimeFormat('en-US', {
        weekday: options?.includeWeekday ? 'long' : undefined,
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }

    // Default medium: e.g. "October 1, 2026"
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return String(dateInput);
  }
}

export function formatEnglishDateRange(startDateStr: string, endDateStr: string): string {
  if (!startDateStr || !endDateStr) return '';
  const s = formatEnglishDate(startDateStr, { formatStyle: 'short' });
  const e = formatEnglishDate(endDateStr, { formatStyle: 'short' });
  return `${s} – ${e}`;
}
