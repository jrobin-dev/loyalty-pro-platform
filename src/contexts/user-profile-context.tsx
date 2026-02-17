"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export interface UserProfile {
    id: string
    email: string
    name: string | null
    lastName: string | null
    phone: string | null
    birthday: Date | null
    avatarUrl: string | null
    role: "SUPER_ADMIN" | "BUSINESS_OWNER" | "END_USER"
    plan: string
    tenants?: {
        id: string
        name: string
        slug: string
        status: string
    }[]
}

interface UserProfileContextType {
    profile: UserProfile | null
    loading: boolean
    error: string | null
    refreshProfile: () => Promise<void>
    updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
    uploadAvatar: (file: File) => Promise<{ success: boolean; avatarUrl?: string; error?: string }>
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const fetchProfile = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem("user_profile_cache")
                }
                setProfile(null)
                setLoading(false)
                return
            }

            const response = await fetch(`/api/user/profile?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            })

            if (!response.ok) throw new Error("Failed to fetch profile")

            const data = await response.json()
            setProfile(data.user)
            if (typeof window !== 'undefined') {
                localStorage.setItem("user_profile_cache", JSON.stringify(data.user))
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    // Initial load from cache and API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem("user_profile_cache")
            if (cached) {
                setProfile(JSON.parse(cached))
                setLoading(false)
            }
        }
        fetchProfile()
    }, [fetchProfile])

    // Real-time subscription
    useEffect(() => {
        let channel: any = null

        const initRealtime = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const userId = session?.user?.id

            if (!userId) return

            console.log("[UserProfileProvider] Subscribing to User updates:", userId)

            channel = supabase
                .channel(`profile-updates-global-${userId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'User',
                        filter: `id=eq.${userId}`,
                    },
                    () => {
                        console.log("[UserProfileProvider] Real-time update detected")
                        fetchProfile()
                    }
                )
                .subscribe()
        }

        initRealtime()

        return () => {
            if (channel) {
                console.log("[UserProfileProvider] Cleaning up Realtime channel")
                supabase.removeChannel(channel)
            }
        }
    }, [supabase, fetchProfile])

    const updateProfile = async (updates: Partial<UserProfile>) => {
        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            })

            if (!response.ok) throw new Error("Failed to update profile")

            const data = await response.json()
            setProfile(data.user)
            return { success: true }
        } catch (err: any) {
            return { success: false, error: err.message }
        }
    }

    const uploadAvatar = async (file: File) => {
        try {
            const formData = new FormData()
            formData.append("avatar", file)

            const response = await fetch("/api/user/avatar", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to upload avatar")

            const data = await response.json()
            setProfile(prev => prev ? { ...prev, avatarUrl: data.avatarUrl } : null)
            return { success: true, avatarUrl: data.avatarUrl }
        } catch (err: any) {
            return { success: false, error: err.message }
        }
    }

    return (
        <UserProfileContext.Provider value={{
            profile,
            loading,
            error,
            refreshProfile: fetchProfile,
            updateProfile,
            uploadAvatar
        }}>
            {children}
        </UserProfileContext.Provider>
    )
}

export function useUserProfileContext() {
    const context = useContext(UserProfileContext)
    if (context === undefined) {
        throw new Error("useUserProfileContext must be used within a UserProfileProvider")
    }
    return context
}
