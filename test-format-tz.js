
const { formatInTimeZone } = require("date-fns-tz");
const { es } = require("date-fns/locale");

const utcDate = "2026-02-16T04:40:00Z"; // The date from the user screenshot (approx)
const timezone = "America/Lima";

console.log("Input UTC:", utcDate);
console.log("Timezone:", timezone);

try {
    const formatted = formatInTimeZone(utcDate, timezone, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    console.log("Result using formatInTimeZone:", formatted);
} catch (e) {
    console.error("Error using formatInTimeZone:", e.message);
}
