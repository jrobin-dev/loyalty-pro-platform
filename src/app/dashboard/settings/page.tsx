"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { BusinessSettingsForm } from "@/components/dashboard/business-settings-form"
import { LoyaltyCardEditor } from "@/components/dashboard/loyalty-card-editor"
import { AccountSettingsForm } from "@/components/dashboard/account-settings-form"
import { Loader2, Building2, Award, User } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

export default function SettingsPage() {
    const { settings, loading, updateTenant, updateBranding, updateLoyaltyProgram } = useTenantSettings()

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
            </DashboardLayout>
        )
    }

    if (!settings) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-muted-foreground">No se pudo cargar la configuración del negocio</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Configuración</h1>
                    <p className="text-muted-foreground">Administra tu negocio y tarjeta de lealtad</p>
                </div>

                <Tabs defaultValue="business" className="w-full">
                    <TabsList className="bg-card/50 border border-white/10">
                        <TabsTrigger value="business" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                            <Building2 className="h-4 w-4 mr-2" />
                            Negocio
                        </TabsTrigger>
                        <TabsTrigger value="loyalty" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                            <Award className="h-4 w-4 mr-2" />
                            Tarjeta de Lealtad
                        </TabsTrigger>
                        <TabsTrigger value="account" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                            <User className="h-4 w-4 mr-2" />
                            Cuenta
                        </TabsTrigger>
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

                    <TabsContent value="account" className="mt-6">
                        <AccountSettingsForm />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
