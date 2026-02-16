"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"

interface TenantContextType {
    activeTenantId: string | null
    setActiveTenantId: (id: string) => void
    isLoading: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const { profile, loading: profileLoading } = useUserProfile()
    const [activeTenantId, setActiveTenantIdState] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!profileLoading && profile?.tenants) {
            const tenants = profile.tenants
            if (tenants.length === 0) {
                setIsLoading(false)
                return
            }

            // 1. Try to load from localStorage
            const savedId = localStorage.getItem("activeTenantId")
            const exists = tenants.find(t => t.id === savedId)

            if (savedId && exists) {
                setActiveTenantIdState(savedId)
            } else {
                // 2. Default to the first one
                const defaultId = tenants[0].id
                setActiveTenantIdState(defaultId)
                localStorage.setItem("activeTenantId", defaultId)
            }
            setIsLoading(false)
        }
    }, [profile, profileLoading])

    const setActiveTenantId = (id: string) => {
        setActiveTenantIdState(id)
        localStorage.setItem("activeTenantId", id)
    }

    return (
        <TenantContext.Provider value={{ activeTenantId, setActiveTenantId, isLoading: isLoading || profileLoading }}>
            {children}
        </TenantContext.Provider>
    )
}

export function useTenant() {
    const context = useContext(TenantContext)
    if (context === undefined) {
        throw new Error("useTenant must be used within a TenantProvider")
    }
    return context
}
