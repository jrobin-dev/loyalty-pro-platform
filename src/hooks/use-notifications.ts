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

    // Helper to normalize Supabase Realtime payload (which might be lowercase/snake_case)
    const mapNotificationFromPayload = (payload: any): Notification => {
        let createdAt = payload.createdAt || payload.createdat || payload.created_at || new Date().toISOString()

        // Fix: Realtime payload often comes without 'Z' (UTC), causing browser to interpret as local time.
        // If it's 5 hours ahead (Peru/EST vs UTC), this fixes "In 5 hours" issue.
        if (typeof createdAt === 'string' && !createdAt.endsWith('Z') && !createdAt.includes('+')) {
            createdAt += 'Z'
        }

        return {
            id: payload.id,
            userId: payload.userId || payload.userid || payload.user_id,
            title: payload.title,
            message: payload.message,
            type: payload.type || 'info',
            read: payload.read ?? false,
            createdAt: createdAt,
            link: payload.link
        }
    }

    useEffect(() => {
        let mounted = true
        let channel: ReturnType<typeof supabase.channel> | null = null

        const initialize = async () => {
            try {
                let activeUserId = manualUserId

                // 1. Resolve User ID
                if (!activeUserId) {
                    const { data } = await supabase.auth.getUser()
                    activeUserId = data.user?.id
                }

                if (!mounted) return

                if (!activeUserId) {
                    console.warn("🚫 No active user ID found. Notifications disabled.")
                    setLoading(false)
                    return
                }

                console.log("🔔 Initializing notifications for:", activeUserId)

                // 2. Fetch Initial Data
                try {
                    setLoading(true)
                    const url = activeUserId
                        ? `/api/notifications?userId=${activeUserId}`
                        : '/api/notifications'

                    const res = await fetch(url)
                    const data = await res.json()

                    if (mounted && data.notifications) {
                        setNotifications(data.notifications)
                        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
                    }
                } catch (error) {
                    console.error("❌ Error loading notifications:", error)
                } finally {
                    if (mounted) setLoading(false)
                }

                // 3. Setup Realtime Subscription
                if (!mounted) return

                channel = supabase
                    .channel(`notif-${activeUserId}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'Notification',
                        },
                        (payload) => {
                            // Verify payload is for this user (Client-side filtering security)
                            const newNotif = mapNotificationFromPayload(payload.new)
                            console.log("🔔 Realtime Event Received:", newNotif.userId === activeUserId ? "ACCEPTED" : "IGNORED", newNotif)

                            if (newNotif.userId !== activeUserId) return

                            setNotifications(prev => [newNotif, ...prev])
                            setUnreadCount(prev => prev + 1)

                            if (onNewNotifRef.current) {
                                onNewNotifRef.current(newNotif)
                            }


                            // Visual Feedback for debug - REMOVED per user request (overlaps with action toast)
                            // toast.success("Notificación recibida", {
                            //     description: newNotif.title,
                            //     className: "bg-emerald-500 text-white border-0"
                            // })
                        }
                    )
                    .subscribe((status) => {
                        console.log(`📡 Subscription Status (${activeUserId}):`, status)
                        if (status === 'SUBSCRIBED') {
                            // Optional: toast.success("Conectado a notificaciones")
                        }
                        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                            console.error("Realtime Connection Failed:", status)
                        }
                    })

            } catch (err) {
                console.error("Initialization error:", err)
            }
        }

        initialize()

        return () => {
            mounted = false
            if (channel) {
                console.log("🔌 Cleaning up notification channel")
                supabase.removeChannel(channel)
            }
        }
    }, [manualUserId, supabase])

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications
    }
}
