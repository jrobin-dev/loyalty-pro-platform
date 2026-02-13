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
            <DialogContent className="sm:max-w-[425px] bg-popover border-border/40 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-display">Nuevo Cliente</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Registra un nuevo cliente en tu programa de lealtad.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Juan Pérez"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="juan@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <div className="flex gap-2">
                                <CountryCodeSelect
                                    value={countryCode}
                                    onChange={setCountryCode}
                                />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="900 000 000"
                                    className="flex-1"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-500 text-white dark:text-black hover:bg-emerald-400 border-0 shadow-lg shadow-emerald-500/20 font-bold cursor-pointer transition-all hover:scale-[1.02]"
                        >
                            {loading ? "Guardando..." : "Guardar Cliente"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
