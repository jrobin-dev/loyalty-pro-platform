"use client"

import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Camera,
    Loader2,
    Save,
    X,
    User,
    Calendar,
    Gift,
    Smartphone
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface ProfileEditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    primaryColor: string
    onSuccess?: () => void
    customerId?: string // New prop to target a specific customer
}

export function ProfileEditModal({ open, onOpenChange, primaryColor, onSuccess, customerId }: ProfileEditModalProps) {
    const { profile: sessionProfile, updateProfile: updateSessionProfile, uploadAvatar: uploadSessionAvatar } = useUserProfile()

    // We'll use local state that initializes from either sessionProfile (if no customerId)
    // or we might need to fetch the specific customer data if customerId is provided.
    // However, since we are in ClientCardPage, the customer data is already available.
    // To keep it simple and robust, let's allow passing initialData if needed or just use current session if no customerId.

    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [birthday, setBirthday] = useState("")
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [email, setEmail] = useState("")

    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Effect to initialize data
    useEffect(() => {
        if (open) {
            if (!customerId && sessionProfile) {
                // Editing own profile
                setName(sessionProfile.name || "")
                setLastName(sessionProfile.lastName || "")
                setPhone(sessionProfile.phone || "+51 ")
                setAvatarUrl(sessionProfile.avatarUrl)
                setEmail(sessionProfile.email || "")
                if (sessionProfile.birthday) {
                    setBirthday(new Date(sessionProfile.birthday).toISOString().split('T')[0])
                } else {
                    setBirthday("")
                }
            } else if (customerId) {
                // Logic for when customerId is provided will be handled by fetching or props
                // For now, fetchData in page.tsx already provides the customer object.
                // We'll trust the parent handles the initial state if possible, 
                // but let's re-fetch to be sure we have the latest and correct User data.
                fetchTargetProfile()
            }
        }
    }, [open, customerId, sessionProfile])

    const fetchTargetProfile = async () => {
        if (!customerId) return
        try {
            const response = await fetch(`/api/customers/${customerId}`)
            if (response.ok) {
                const data = await response.json()
                const user = data.user || data // depending on API response structure
                setName(user.name || "")
                setLastName(user.lastName || "")
                setPhone(user.phone || "+51 ")
                setAvatarUrl(user.avatarUrl)
                setEmail(user.email || "")
                if (user.birthday) {
                    setBirthday(new Date(user.birthday).toISOString().split('T')[0])
                } else {
                    setBirthday("")
                }
            }
        } catch (error) {
            console.error("Error fetching target profile:", error)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const data = {
                name: name.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                birthday: birthday ? new Date(birthday) : null
            }

            let result;
            if (customerId) {
                // Targeted Update
                const response = await fetch(`/api/customers/${customerId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                const resData = await response.json()
                result = { success: response.ok, error: resData.error, user: resData.user }
            } else {
                // Own Profile Update
                result = await updateSessionProfile(data)
            }

            if (result.success) {
                toast.success("Perfil actualizado con éxito")
                onOpenChange(false)
                if (onSuccess) onSuccess()
            } else {
                toast.error(result.error || "Error al actualizar perfil")
            }
        } catch (error: any) {
            toast.error(error.message || "Error al guardar cambios")
        } finally {
            setIsSaving(false)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error("La imagen debe ser menor a 2MB")
            return
        }

        try {
            setIsUploading(true)
            let result;
            if (customerId) {
                // Targeted Upload
                const formData = new FormData()
                formData.append('avatar', file)
                const response = await fetch(`/api/customers/${customerId}/avatar`, {
                    method: 'POST',
                    body: formData,
                })
                const resData = await response.json()
                result = { success: response.ok, error: resData.error, avatarUrl: resData.avatarUrl }
            } else {
                // Own Avatar Upload
                result = await uploadSessionAvatar(file)
            }

            if (result.success) {
                toast.success("Foto de perfil actualizada")
                if (result.avatarUrl) setAvatarUrl(result.avatarUrl)
                if (onSuccess) onSuccess()
            } else {
                toast.error(result.error || "Error al subir imagen")
            }
        } catch (error: any) {
            toast.error("Error al subir imagen")
        } finally {
            setIsUploading(false)
        }
    }

    const initials = (name?.trim().charAt(0) || "") + (lastName?.trim().charAt(0) || "") || "U"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] bg-[#0a0a0a] border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-3xl font-medium tracking-tighter text-white">
                        Configuración
                    </DialogTitle>
                    <p className="text-zinc-500 text-sm font-medium">
                        Actualiza tu perfil, tus datos de contacto y tu foto.
                    </p>
                </DialogHeader>

                <div className="px-8 pb-10 space-y-6">
                    {/* New Avatar Section (Boxed) */}
                    <div className="bg-zinc-900/40 p-6 rounded-[1.8rem] border border-white/5 flex items-center gap-6">
                        <div
                            className="relative group cursor-pointer active:scale-95 transition-transform"
                            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                        >
                            <Avatar className="h-20 w-20 border-2 border-zinc-800 shadow-xl group-hover:border-white/20 transition-colors">
                                <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                                <AvatarFallback className="bg-zinc-800 text-2xl font-black text-white uppercase">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white/50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                className="bg-[#aeaeae] hover:bg-[#c5c5c5] text-black px-4 py-2 rounded-xl text-[12px] font-semibold transition-all transform active:scale-95 shadow-lg"
                            >
                                Cambiar perfil
                            </button>
                            <p className="text-[10px] text-zinc-500 font-medium leading-tight">
                                Recomendado: imagen cuadrada,<br />min. 300x300.
                            </p>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-tight" style={{ color: primaryColor }}>Nombre</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 focus:border-white/10"
                                    placeholder="Fernanda"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-tight" style={{ color: primaryColor }}>Apellido</Label>
                                <Input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 focus:border-white/10"
                                    placeholder="Grandez"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-tight" style={{ color: primaryColor }}>WhatsApp</Label>
                            <div className="flex gap-0 bg-[#1c1c1c] border border-white/5 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-white/10 transition-all">
                                <CountryCodeSelect
                                    value={phone.split(' ')[0].startsWith('+') ? phone.split(' ')[0] : "+51"}
                                    onChange={(code) => {
                                        const number = phone.split(' ').slice(1).join(' ') || phone.replace(/^\+\d+\s*/, '')
                                        setPhone(`${code} ${number}`)
                                    }}
                                    className="h-14 bg-transparent border-none rounded-none font-bold w-[100px] hover:bg-white/5 focus:ring-0"
                                />
                                <div className="w-[1px] h-8 bg-white/10 self-center" />
                                <Input
                                    value={phone.split(' ').slice(1).join(' ') || phone.replace(/^\+\d+\s*/, '')}
                                    onChange={(e) => {
                                        const code = phone.split(' ')[0].startsWith('+') ? phone.split(' ')[0] : "+51"
                                        setPhone(`${code} ${e.target.value}`)
                                    }}
                                    className="flex-1 bg-transparent border-none h-14 text-white font-bold px-5 focus:ring-0 focus-visible:ring-1 focus-visible:ring-white/10"
                                    placeholder="987 987 987"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-tight" style={{ color: primaryColor }}>E-Mail</Label>
                                <Input
                                    value={email || ""}
                                    disabled
                                    className="bg-[#1c1c1c]/50 border-white/5 h-14 rounded-2xl text-zinc-600 font-bold px-5 cursor-not-allowed italic"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-tight" style={{ color: primaryColor }}>Cumpleaños</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                        className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all pr-14 appearance-none focus:border-white/10"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <Gift className="w-4 h-4" style={{ color: primaryColor }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-6">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="flex-1 text-zinc-500 hover:text-white font-medium transition-colors text-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-[2] h-14 rounded-2xl font-medium text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Actualizar Perfil"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
