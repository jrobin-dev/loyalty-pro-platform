"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Camera, User, Gift } from "lucide-react"
import { CountryCodeSelect } from "@/components/ui/country-code-select"

interface ProfileEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    customer: any
    primaryColor: string
    onUpdate: (updatedData: any) => Promise<void>
}

export function ProfileEditDialog({ open, onOpenChange, customer, primaryColor, onUpdate }: ProfileEditDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        phone: "",
        countryCode: "+51",
        displayPhone: "",
        birthday: "",
        email: "",
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (customer) {
            const phone = customer.user?.phone || ""
            let countryCode = "+51"
            let displayPhone = phone

            if (phone.includes(" ")) {
                const parts = phone.split(" ")
                if (parts[0].startsWith("+")) {
                    countryCode = parts[0]
                    displayPhone = parts.slice(1).join(" ")
                }
            } else if (phone.startsWith("+51")) {
                // heuristic for legacy formats
                countryCode = "+51"
                displayPhone = phone.replace("+51", "")
            }

            setFormData({
                name: customer.name || customer.user?.name || "",
                lastName: customer.lastName || customer.user?.lastName || "",
                phone: phone,
                countryCode,
                displayPhone,
                birthday: (customer.birthday || customer.user?.birthday) ? new Date(customer.birthday || customer.user?.birthday).toISOString().split('T')[0] : "",
                email: customer.email || customer.user?.email || "",
            })
            setPreviewUrl(customer.avatarUrl || customer.user?.avatarUrl || null)
        }
    }, [customer, open])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const fullPhone = `${formData.countryCode} ${formData.displayPhone}`.trim()
            await onUpdate({
                ...formData,
                phone: fullPhone,
                avatarFile
            })
            onOpenChange(false)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border text-foreground sm:max-w-md p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold">Configuración</DialogTitle>
                    <p className="text-muted-foreground text-sm">Actualiza tu perfil, tus datos de contacto y tu foto.</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl border border-border">
                        <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary border border-border ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all shadow-sm">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-center scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                        <User size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-xs font-medium text-white">
                                Cambiar
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="font-bold h-8 text-xs border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Cambiar perfil
                            </Button>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                                Recomendado: imagen cuadrada, mín. 300x300.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-emerald-600 dark:text-emerald-400">Nombre</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-emerald-600 dark:text-emerald-400">Apellido</Label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                className=""
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-emerald-600 dark:text-emerald-400">WhatsApp</Label>
                        <div className="flex gap-2 bg-card border border-border rounded-xl focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all overflow-hidden">
                            <div className="shrink-0 w-[80px]">
                                <CountryCodeSelect
                                    value={formData.countryCode}
                                    onChange={(code) => handleChange('countryCode', code)}
                                    className="border-none bg-transparent hover:bg-accent h-full w-full justify-between"
                                />
                            </div>
                            <div className="w-[1px] bg-border my-2"></div>
                            <Input
                                value={formData.displayPhone}
                                onChange={(e) => handleChange('displayPhone', e.target.value)}
                                placeholder="900 000 000"
                                className="bg-transparent border-none focus-visible:ring-0 px-3 flex-1 h-12"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-emerald-600 dark:text-emerald-400">E-Mail</Label>
                            <Input
                                value={formData.email}
                                readOnly
                                className="opacity-50 cursor-not-allowed focus-visible:ring-0"
                            />
                        </div>
                        <div className="space-y-1.5 relative">
                            <Label className="text-xs text-emerald-600 dark:text-emerald-400">Cumpleaños</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={formData.birthday}
                                    onChange={(e) => handleChange('birthday', e.target.value)}
                                    className="pr-8"
                                />
                                <Gift size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 text-muted-foreground hover:text-foreground"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 font-bold text-primary-foreground"
                            style={{ backgroundColor: primaryColor }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Actualizar Perfil'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
