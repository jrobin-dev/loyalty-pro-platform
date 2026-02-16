
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

export const TIMEZONES = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/Lima", label: "Perú (America/Lima)" },
    { value: "America/Mexico_City", label: "México (America/Mexico_City)" },
    { value: "America/Bogota", label: "Colombia (America/Bogota)" },
    { value: "America/Santiago", label: "Chile (America/Santiago)" },
    { value: "America/Argentina/Buenos_Aires", label: "Argentina (America/Argentina/Buenos_Aires)" },
    { value: "America/La_Paz", label: "Bolivia (America/La_Paz)" },
    { value: "America/Sao_Paulo", label: "Brasil (America/Sao_Paulo)" },
    { value: "America/Caracas", label: "Venezuela (America/Caracas)" },
    { value: "America/Guayaquil", label: "Ecuador (America/Guayaquil)" },
    { value: "America/Montevideo", label: "Uruguay (America/Montevideo)" },
    { value: "America/Asuncion", label: "Paraguay (America/Asuncion)" },
    { value: "America/Costa_Rica", label: "Costa Rica (America/Costa_Rica)" },
    { value: "America/Panama", label: "Panamá (America/Panama)" },
    { value: "America/El_Salvador", label: "El Salvador (America/El_Salvador)" },
    { value: "America/Guatemala", label: "Guatemala (America/Guatemala)" },
    { value: "America/New_York", label: "USA - Eastern (America/New_York)" },
    { value: "America/Los_Angeles", label: "USA - Pacific (America/Los_Angeles)" },
    { value: "Europe/Madrid", label: "España (Europe/Madrid)" },
]
