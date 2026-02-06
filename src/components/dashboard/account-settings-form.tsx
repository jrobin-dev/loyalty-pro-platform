"use client"

import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { AvatarUploader } from "./avatar-uploader"
import { DeleteAccountModal } from "./delete-account-modal"
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
            <Card className="p-6 glass-card border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Foto de Perfil</h3>
                <AvatarUploader
                    currentAvatarUrl={profile?.avatarUrl}
                    userName={profile?.name}
                    onUploadComplete={async (url) => {
                        // Refresh profile to show new avatar immediately
                        await refetch()
                        toast.success("Avatar actualizado")
                    }}
                />
            </Card>

            {/* Personal Information */}
            <Card className="p-6 glass-card border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-white/80">Nombre</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80">Apellido</Label>
                        <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Tu apellido"
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80">Email</Label>
                        <Input
                            value={profile?.email || ""}
                            disabled
                            className="bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-white/40">
                            El email no se puede cambiar por seguridad
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80">Teléfono / WhatsApp</Label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+51 999 999 999"
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-white/80">Fecha de Cumpleaños</Label>
                        <Input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </Card>

            {/* Security Section */}
            <Card className="p-6 glass-card border-white/10">
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-white">Seguridad</h3>
                </div>

                <Separator className="mb-6 bg-white/10" />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-white/80">Contraseña Actual</Label>
                        <div className="relative">
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                            >
                                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80">Nueva Contraseña</Label>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                            >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80">Confirmar Nueva Contraseña</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <Button
                        onClick={handleChangePassword}
                        disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full md:w-auto"
                    >
                        {changingPassword ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cambiando...
                            </>
                        ) : (
                            "Cambiar Contraseña"
                        )}
                    </Button>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 glass-card border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-red-500">Zona de Advertencia</h3>
                </div>

                <Separator className="mb-6 bg-red-500/20" />

                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-white mb-2">Eliminar Cuenta</h4>
                        <p className="text-sm text-white/60 mb-4">
                            Eliminar tu cuenta es <strong>irreversible</strong>. Perderás todos tus datos, clientes, stamps y configuración.
                        </p>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Eliminar Cuenta
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Delete Account Modal */}
            <DeleteAccountModal open={showDeleteModal} onOpenChange={setShowDeleteModal} />
        </div>
    )
}
