"use client"

import { useTenant } from "@/contexts/tenant-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Store, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TenantSelectorProps {
    isCollapsed?: boolean
}

export function TenantSelector({ isCollapsed }: TenantSelectorProps) {
    const { profile } = useUserProfile()
    const { activeTenantId, setActiveTenantId } = useTenant()

    if (!profile?.tenants || profile.tenants.length === 0) return null

    const tenants = profile.tenants
    const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0]

    return (
        <div className={cn("w-full transition-all duration-300")}>
            <Select value={activeTenantId || ""} onValueChange={setActiveTenantId}>
                <SelectTrigger className={cn(
                    "w-full bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 transition-all duration-200 h-12",
                    isCollapsed ? "px-2" : "px-3"
                )}>
                    <div className="flex items-center gap-3 overflow-hidden text-left">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Store className="w-4 h-4 text-emerald-500" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 pr-2">
                                <span className="text-xs font-black uppercase tracking-tight text-zinc-500 leading-none mb-1">
                                    Negocio Activo
                                </span>
                                <span className="text-sm font-bold text-white truncate leading-none">
                                    {activeTenant.name}
                                </span>
                            </div>
                        )}
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    {tenants.map((tenant) => (
                        <SelectItem
                            key={tenant.id}
                            value={tenant.id}
                            className="focus:bg-emerald-500/20 focus:text-emerald-400 cursor-pointer py-3"
                        >
                            <div className="flex flex-col">
                                <span className="font-bold">{tenant.name}</span>
                                <span className="text-xs text-zinc-500">/{tenant.slug}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
