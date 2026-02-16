
import { formatInTimeZone } from "date-fns-tz"
import { es } from "date-fns/locale"

/**
 * Formats a date string or Date object to the specified timezone
 * @param date - The date to format (ISO string or Date object)
 * @param formatStr - The format string (e.g. "d 'de' MMMM, yyyy")
 * @param timezone - The IANA timezone string (e.g. "America/Lima")
 * @returns The formatted date string
 */
export function formatInTimezone(date: string | Date | number, formatStr: string, timezone: string = 'UTC'): string {
    return formatInTimeZone(date, timezone, formatStr, { locale: es })
}
