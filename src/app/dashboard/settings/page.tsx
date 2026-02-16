"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { BusinessSettingsForm } from "@/components/dashboard/business-settings-form"
import { LoyaltyCardEditor } from "@/components/dashboard/loyalty-card-editor"
import { AccountSettingsForm } from "@/components/dashboard/account-settings-form"
import { Loader2, Building2, Award, User } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"

export default function SettingsPage() {
    const { profile } = useUserProfile()
    const { settings, loading, updateTenant, updateBranding, updateLoyaltyProgram } = useTenantSettings()

    // Primary tenant is the first one created (index 0)
    const isPrimaryTenant = profile?.tenants && profile.tenants.length > 0
        ? profile.tenants[0].id === settings?.tenant.id
        : true

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
        )
    }

    if (!settings) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">No se pudo cargar la configuración del negocio</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-muted-foreground/40 font-sans uppercase tracking-wider text-sm">Preferencias de Negocio y Cuenta</h2>
            </div>

            <Tabs defaultValue="business" className="w-full">
                <TabsList className="bg-secondary/50 border border-border w-full flex-wrap h-auto justify-start p-1 bg-zinc-900/50">
                    <TabsTrigger value="business" className="flex-1 min-w-[100px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
                        <Building2 className="h-4 w-4 mr-2" />
                        Negocio
                    </TabsTrigger>
                    <TabsTrigger value="loyalty" className="flex-1 min-w-[140px] data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">
                        <Award className="h-4 w-4 mr-2" />
                        Tarjeta de Lealtad
                    </TabsTrigger>
                    {isPrimaryTenant && (
                        <TabsTrigger value="account" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400">
                            <User className="h-4 w-4 mr-2" />
                            Cuenta
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="business" className="mt-6">
                    <BusinessSettingsForm
                        settings={settings}
                        onSaveTenant={updateTenant}
                        onSaveBranding={updateBranding}
                    />
                </TabsContent>

                <TabsContent value="loyalty" className="mt-6">
                    <LoyaltyCardEditor
                        settings={settings}
                        onSave={updateLoyaltyProgram}
                    />
                </TabsContent>

                {isPrimaryTenant && (
                    <TabsContent value="account" className="mt-6">
                        <AccountSettingsForm />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
