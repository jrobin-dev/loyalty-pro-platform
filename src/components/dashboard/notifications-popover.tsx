"use client"

import { useState } from "react"
import { Bell, Check, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications, Notification } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"

export function NotificationsPopover() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    // Use the hook to get notifications
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        loading
    } = useNotifications()

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await markAsRead(notification.id)
        }

        if (notification.link) {
            setOpen(false)
            router.push(notification.link)
        }
    }

    // Helper to format date in Peru time relative roughly
    // Using date-fns with locale is good, but we want to ensure we respect the timezone if possible.
    // However, formatDistanceToNow works on the Date object which is browser local. 
    // If the server sends UTC, browser converts to local. User is likely in Peru, so it works.
    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es })
        } catch (e) {
            return "hace un momento"
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[96vw] sm:w-80 p-0 bg-[#0F0F10] border-zinc-800 shadow-2xl rounded-2xl overflow-hidden ml-2 sm:ml-0 sm:mr-4" align="end" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/50 backdrop-blur-sm">
                    <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                        Notificaciones
                        {unreadCount > 0 && (
                            <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 px-2 rounded-full"
                            onClick={() => markAllAsRead()}
                        >
                            Marcar todo leído
                        </Button>
                    )}
                </div>

                <div className="h-[350px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-zinc-500 space-y-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                            <p className="text-xs">Cargando...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-60 text-zinc-500 px-6 text-center">
                            <Bell className="h-8 w-8 mb-3 opacity-20" />
                            <p className="text-sm font-medium text-zinc-400">Sin notificaciones</p>
                            <p className="text-xs mt-1">Te avisaremos cuando haya actividad importante.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group relative",
                                        !notification.read && "bg-emerald-500/5 hover:bg-emerald-500/10"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn(
                                            "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                                            !notification.read ? "bg-emerald-500" : "bg-transparent"
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-xs font-medium leading-none", !notification.read ? "text-emerald-400" : "text-zinc-400")}>
                                                {notification.title || "No Title"}
                                            </p>
                                            <p className="text-xs text-zinc-500 line-clamp-2 group-hover:text-zinc-400 transition-colors">
                                                {notification.message || "No Message"}
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Clock className="w-3 h-3 text-zinc-600" />
                                                <span className="text-[10px] text-zinc-600 capitalize">
                                                    {formatDate(notification.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
