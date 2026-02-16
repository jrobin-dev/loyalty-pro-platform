
const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const { es } = require("date-fns/locale");

function formatInTimezone(dateStr, formatStr, timezone) {
    const d = new Date(dateStr); // Parse ISO UTC
    const zonedDate = toZonedTime(d, timezone);
    return format(zonedDate, formatStr, { locale: es });
}

// User scenario:
// Local: 15 Feb 11:32 PM (Peru)
// UTC: 16 Feb 04:32 AM
const utcDate = "2026-02-16T04:32:00Z";

console.log("UTC Date:", utcDate);
console.log("Target Timezone: America/Lima");

const formatted = formatInTimezone(utcDate, "d 'de' MMMM, yyyy 'a las' HH:mm", "America/Lima");
console.log("Formatted:", formatted);

const formattedUTC = formatInTimezone(utcDate, "d 'de' MMMM, yyyy 'a las' HH:mm", "UTC");
console.log("Formatted (UTC):", formattedUTC);
