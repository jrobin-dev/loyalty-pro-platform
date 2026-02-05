"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Palette, Shield } from "lucide-react"

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-sans">Configuración</h1>
                <p className="text-white/60">Administra los detalles de tu negocio y la apariencia de tu marca.</p>
            </div>

            <Tabs defaultValue="general" className="max-w-4xl">
                <TabsList className="bg-white/5 border border-white/10 mb-8">
                    <TabsTrigger value="general" className="data-[state=active]:bg-[#00FF94] data-[state=active]:text-black">
                        <Building2 size={16} className="mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="data-[state=active]:bg-[#00FF94] data-[state=active]:text-black">
                        <Palette size={16} className="mr-2" /> Marca
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-[#00FF94] data-[state=active]:text-black">
                        <Shield size={16} className="mr-2" /> Seguridad
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <div className="glass-card p-6 rounded-xl border border-white/10 bg-white/5">
                        <h3 className="text-lg font-bold mb-4">Perfil del Negocio</h3>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre del Negocio</Label>
                                <Input id="name" placeholder="Ej. Cafetería Central" className="bg-black/20 border-white/10" defaultValue="Mi Negocio Demo" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email de Contacto</Label>
                                <Input id="email" placeholder="contacto@ejemplo.com" className="bg-black/20 border-white/10" defaultValue="admin@loyaltypro.com" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button className="bg-[#00FF94] text-black hover:bg-[#00cc76] font-bold">Guardar Cambios</Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="branding">
                    <div className="glass-card p-6 rounded-xl border border-white/10 bg-white/5 text-center py-12 text-white/60">
                        <Palette size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Opciones de personalización de tarjeta y colores próximamente disponibles.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    )
}
