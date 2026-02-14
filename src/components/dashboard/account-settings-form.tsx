"use client"

import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { AvatarUploader } from "./avatar-uploader"
import { DeleteAccountModal } from "./delete-account-modal"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export function AccountSettingsForm() {
    const { profile, loading, updateProfile, uploadAvatar, refetch } = useUserProfile()
    const [saving, setSaving] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Personal Info State
    const [name, setName] = useState(profile?.name || "")
    const [lastName, setLastName] = useState(profile?.lastName || "")
    const [phone, setPhone] = useState(profile?.phone || "")
    const [birthday, setBirthday] = useState(
        profile?.birthday ? format(new Date(profile.birthday), "yyyy-MM-dd") : ""
    )

    // Password State
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    // Sync form state with profile
    useEffect(() => {
        if (profile) {
            setName(profile.name || "")
            setLastName(profile.lastName || "")
            setPhone(profile.phone || "")
            if (profile.birthday) {
                const date = new Date(profile.birthday)
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, "0")
                const day = String(date.getDate()).padStart(2, "0")
                setBirthday(`${year}-${month}-${day}`)
            } else {
                setBirthday("")
            }
        }
    }, [profile])

    const handleSaveProfile = async () => {
        try {
            setSaving(true)

            // Convert birthday to Date with local timezone (Peru UTC-5)
            // Set time to noon to avoid timezone day shifts
            let birthdayDate = null
            if (birthday) {
                const [year, month, day] = birthday.split("-").map(Number)
                // Create date at noon local time to avoid day shifts
                birthdayDate = new Date(year, month - 1, day, 12, 0, 0)
            }

            const result = await updateProfile({
                name: name || null,
                lastName: lastName || null,
                phone: phone || null,
                birthday: birthdayDate,
            })

            if (result.success) {
                toast.success("Perfil actualizado correctamente")
            } else {
                toast.error(result.error || "Error al actualizar perfil")
            }
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar perfil")
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        if (newPassword.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres")
            return
        }

        try {
            setChangingPassword(true)
            const response = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Error al cambiar contraseña")
            }

            toast.success("Contraseña actualizada correctamente")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (error: any) {
            toast.error(error.message || "Error al cambiar contraseña")
        } finally {
            setChangingPassword(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Avatar Section */}
            <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Foto de Perfil</h3>
                <AvatarUploader
                    currentAvatarUrl={profile?.avatarUrl}
                    userName={profile?.name}
                    onUploadComplete={async (url) => {
                        await refetch()
                        toast.success("Avatar actualizado")
                    }}
                />
            </div>

            {/* Personal Information */}
            <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Nombre</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Apellido</Label>
                        <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Tu apellido"
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Email</Label>
                        <Input
                            value={profile?.email || ""}
                            disabled
                            className="bg-[#1c1c1c]/50 border-white/5 h-14 rounded-2xl text-zinc-500 font-bold px-5 cursor-not-allowed opacity-70"
                        />
                        <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest pl-1">
                            El email no se puede cambiar por seguridad
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Teléfono / WhatsApp</Label>
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
                                placeholder="999 999 999"
                                className="flex-1 bg-transparent border-none h-14 text-white font-bold px-5 focus:ring-0 focus-visible:ring-1 focus-visible:ring-white/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Fecha de Cumpleaños</Label>
                        <Input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-10">
                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-[#aeaeae] hover:bg-[#c5c5c5] text-black font-semibold text-[12px] px-8 h-10 rounded-full transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-6 w-6 text-white" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Seguridad</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Contraseña Actual</Label>
                        <div className="relative">
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                            >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Nueva Contraseña</Label>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Confirmar Nueva Contraseña</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-5 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700"
                        />
                    </div>

                    <button
                        onClick={handleChangePassword}
                        disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full h-14 rounded-2xl bg-white text-black font-bold transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                    >
                        {changingPassword ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Cambiando...
                            </>
                        ) : (
                            "Cambiar Contraseña"
                        )}
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <h3 className="text-xl font-bold text-red-500 tracking-tight">Zona de Advertencia</h3>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <h4 className="font-bold text-white mb-2">Eliminar Cuenta</h4>
                        <p className="text-sm text-zinc-500 mb-6">
                            Eliminar tu cuenta es <strong className="text-white">irreversible</strong>. Perderás todos tus datos, clientes, stamps y configuración.
                        </p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold h-12 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20"
                        >
                            Eliminar Cuenta
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal open={showDeleteModal} onOpenChange={setShowDeleteModal} />
        </div>
    )
}
