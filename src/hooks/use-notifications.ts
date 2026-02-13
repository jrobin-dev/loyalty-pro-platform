"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface Notification {
    id: string
    userId: string
    title: string
    message: string
    type: "info" | "success" | "warning" | "error"
    read: boolean
    createdAt: string
    link?: string
}

export function useNotifications(manualUserId?: string, onNewNotification?: (n: Notification) => void) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    // Usamos una referencia para el callback para evitar re-suscripciones innecesarias
    const onNewNotifRef = useRef(onNewNotification)

    useEffect(() => {
        onNewNotifRef.current = onNewNotification
    }, [onNewNotification])

    const fetchNotifications = async () => {
        try {
            const url = manualUserId
                ? `/api/notifications?userId=${manualUserId}`
                : '/api/notifications'
            const res = await fetch(url)
            const data = await res.json()
            if (data.notifications) {
                setNotifications(data.notifications)
                setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
            }
        } catch (error) {
            console.error("Error loading notifications:", error)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, read: true } : n)
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error("Error marking as read:", error)
        }
    }

    const markAllAsRead = async () => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ readAll: true })
            })
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                setUnreadCount(0)
            }
        } catch (error) {
            console.error("Error marking all as read:", error)
        }
    }

    useEffect(() => {
        let activeUserId = manualUserId

        const setupRealtime = async () => {
            // Si no hay userId manual, intentamos obtener el de la sesión para el filtro
            if (!activeUserId) {
                const { data } = await supabase.auth.getUser()
                activeUserId = data.user?.id
            }

            console.log("📡 Iniciando suscripción Realtime para:", activeUserId || "TODOS (Cuidado)")

            const channel = supabase
                .channel(`notif-${activeUserId || 'global'}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'Notification'
                    },
                    (payload) => {
                        const newNotif = payload.new as Notification

                        // FILTRO CRÍTICO: Solo mostrar si es para este usuario
                        if (activeUserId && newNotif.userId !== activeUserId) {
                            return
                        }

                        console.log("🔔 ¡Notificación recibida en tiempo real!", newNotif)

                        setNotifications(prev => [newNotif, ...prev])
                        setUnreadCount(prev => prev + 1)

                        if (onNewNotifRef.current) onNewNotifRef.current(newNotif)

                        toast.info(newNotif.title, {
                            description: newNotif.message,
                            duration: 5000,
                        })
                    }
                )
                .subscribe((status) => {
                    console.log(`🔌 Estado de suscripción Realtime (${activeUserId}):`, status)
                })

            return channel
        }

        fetchNotifications()
        const channelPromise = setupRealtime()

        return () => {
            channelPromise.then(channel => {
                if (channel) {
                    console.log("🔌 Cerrando canal Realtime")
                    supabase.removeChannel(channel)
                }
            })
        }
    }, [manualUserId])

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications
    }
}
