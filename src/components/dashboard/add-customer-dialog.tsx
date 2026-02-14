"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

import { CountryCodeSelect } from "@/components/ui/country-code-select"

interface AddCustomerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AddCustomerDialog({ open, onOpenChange, onSuccess }: AddCustomerDialogProps) {
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState("+51")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()

            // Get authenticated user
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                throw new Error('No hay sesión activa')
            }

            // Get user's tenant
            const { data: tenantData, error: tenantError } = await supabase
                .from('Tenant')
                .select('id')
                .eq('ownerId', session.user.id)
                .single()

            if (tenantError || !tenantData) {
                throw new Error('No se encontró el negocio asociado')
            }

            // Call API to create customer
            const fullPhone = `${countryCode} ${formData.phone}`.trim()

            const response = await fetch('/api/customers/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    phone: fullPhone,
                    tenantId: tenantData.id,
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Error al crear cliente')
            }

            toast.success("Cliente agregado exitosamente", {
                description: `${formData.name} ha sido registrado en el sistema.`
            })

            // Reset form
            setFormData({ name: "", email: "", phone: "" })
            onOpenChange(false)
            if (onSuccess) {
                onSuccess()
            }
        } catch (error: any) {
            console.error("Error adding customer:", error)
            toast.error("Error al agregar cliente", {
                description: error.message || "Intenta nuevamente."
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] bg-[#0a0a0a] border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl text-foreground">
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-3xl font-medium tracking-tighter text-white">Nuevo Cliente</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-sm font-medium">
                        Registra un nuevo cliente en tu programa de lealtad.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-tight text-zinc-500">Nombre completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Juan Pérez"
                                required
                                className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 focus:border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-tight text-zinc-500">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="juan@example.com"
                                required
                                className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 focus:border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-black uppercase tracking-tight text-zinc-500">Teléfono</Label>
                            <div className="flex gap-0 bg-[#1c1c1c] border border-white/5 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-white/10 transition-all">
                                <CountryCodeSelect
                                    value={countryCode}
                                    onChange={setCountryCode}
                                    className="h-14 bg-transparent border-none rounded-none font-bold w-[100px] hover:bg-white/5 focus:ring-0"
                                />
                                <div className="w-[1px] h-8 bg-white/10 self-center" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="900 000 000"
                                    className="flex-1 bg-transparent border-none h-14 text-white font-bold px-5 focus:ring-0 focus-visible:ring-1 focus-visible:ring-white/10"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 pt-6">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 text-zinc-500 hover:text-white font-medium transition-colors text-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] h-14 rounded-2xl bg-white text-black font-bold transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Cliente"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
