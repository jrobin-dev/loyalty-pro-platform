"use client"

import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { formatInTimezone } from "@/lib/date-utils"

export function useTenantDate() {
    const { settings } = useTenantSettings()

    // Default to America/Lima if not set
    const timeZone = settings?.tenant.timezone || "America/Lima"

    const formatDate = (date: string | Date | null | undefined, formatStr: string = "d MMM, HH:mm") => {
        if (!date) return ""

        // Ensure we work with ISO string for consistency with existing utils
        let dateStr: string
        if (date instanceof Date) {
            dateStr = date.toISOString()
        } else {
            // Append Z if missing to ensure UTC interpretation, matching CustomerHistoryModal logic
            dateStr = date.endsWith('Z') ? date : `${date}Z`
        }

        return formatInTimezone(dateStr, formatStr, timeZone)
    }

    return {
        formatDate,
        timeZone
    }
}
