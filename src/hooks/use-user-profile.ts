"use client"

import { useState, useEffect } from "react"
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
    tenants?: {
        id: string
        name: string
        slug: string
        status: string
    }[]
}

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const supabase = createClient()

            const { data: { session } } = await supabase.auth.getSession()
            console.log("[useUserProfile] Session:", session?.user?.email) // Debug

            if (!session) {
                console.log("[useUserProfile] No session found") // Debug
                throw new Error("No active session")
            }

            console.log("[useUserProfile] Fetching profile API...") // Debug
            const response = await fetch("/api/user/profile")
            if (!response.ok) {
                console.error("[useUserProfile] API Error:", response.status) // Debug
                throw new Error("Failed to fetch profile")
            }

            const data = await response.json()
            console.log("[useUserProfile] Profile Data Received:", data.user) // Debug
            setProfile(data.user)
        } catch (err: any) {
            console.error("[useUserProfile] Error:", err) // Debug
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (updates: Partial<UserProfile>) => {
        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            })

            if (!response.ok) {
                throw new Error("Failed to update profile")
            }

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

            if (!response.ok) {
                throw new Error("Failed to upload avatar")
            }

            const data = await response.json()
            setProfile(prev => prev ? { ...prev, avatarUrl: data.avatarUrl } : null)
            return { success: true, avatarUrl: data.avatarUrl }
        } catch (err: any) {
            return { success: false, error: err.message }
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return {
        profile,
        loading,
        error,
        updateProfile,
        uploadAvatar,
        refetch: fetchProfile,
    }
}
