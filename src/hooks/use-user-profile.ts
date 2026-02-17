"use client"

import { useUserProfileContext, UserProfile } from "@/contexts/user-profile-context"

export type { UserProfile }

export function useUserProfile() {
    const {
        profile,
        loading,
        error,
        refreshProfile,
        updateProfile,
        uploadAvatar
    } = useUserProfileContext()

    return {
        profile,
        loading,
        error,
        fetchProfile: refreshProfile,
        updateProfile,
        uploadAvatar,
        // Compatibility Aliases
        refetch: refreshProfile
    }
}

