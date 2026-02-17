"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"

interface ActiveTenant {
    id: string
    name: string
    slug: string
    status: string
    enforcedStatus?: string // New field to track plan limit status
}

interface TenantContextType {
    activeTenantId: string | null
    activeTenant: ActiveTenant | null
    setActiveTenantId: (id: string) => void
    isLoading: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const { profile, loading: profileLoading } = useUserProfile()
    const [activeTenantId, setActiveTenantIdState] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Calculate plan limit
    const planLimit = useMemo(() => {
        const plan = (profile?.plan || 'FREE').toUpperCase()
        if (plan === 'AGENCY') return 10
        if (plan === 'PRO') return 3
        if (plan === 'STARTER') return 1
        return 1
    }, [profile?.plan])

    // Process tenants with limit enforcement
    const processedTenants = useMemo(() => {
        if (!profile?.tenants) return []

        return profile.tenants.map((tenant, index) => {
            // A tenant is suspended IF:
            // 1. Its database status is SUSPENDED
            // 2. Its index exceeds the allowed limit for the current plan
            const isExceedingLimit = index >= planLimit
            const enforcedStatus = tenant.status === 'SUSPENDED' || isExceedingLimit
                ? 'SUSPENDED'
                : 'ACTIVE'

            return {
                ...tenant,
                enforcedStatus
            }
        })
    }, [profile?.tenants, planLimit])

    const activeTenant = useMemo(() => {
        if (!processedTenants.length) return null
        return processedTenants.find(t => t.id === activeTenantId) || processedTenants[0]
    }, [processedTenants, activeTenantId])

    useEffect(() => {
        if (!profileLoading && profile?.tenants) {
            const tenants = profile.tenants
            if (tenants.length === 0) {
                setIsLoading(false)
                return
            }

            const savedId = localStorage.getItem("activeTenantId")
            const exists = tenants.find(t => t.id === savedId)

            if (savedId && exists) {
                setActiveTenantIdState(savedId)
            } else {
                const defaultTenant = tenants[0]
                setActiveTenantIdState(defaultTenant.id)
                localStorage.setItem("activeTenantId", defaultTenant.id)
            }
            setIsLoading(false)
        }
    }, [profile, profileLoading])

    const setActiveTenantId = (id: string) => {
        if (profile?.tenants) {
            const exists = profile.tenants.some(t => t.id === id)
            if (exists) {
                setActiveTenantIdState(id)
                localStorage.setItem("activeTenantId", id)
            }
        }
    }

    return (
        <TenantContext.Provider value={{
            activeTenantId,
            activeTenant: activeTenant as ActiveTenant,
            setActiveTenantId,
            isLoading: isLoading || profileLoading
        }}>
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

