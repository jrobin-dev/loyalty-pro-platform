"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres")
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()
            const { error: resetError } = await supabase.auth.updateUser({
                password: password
            })

            if (resetError) {
                setError(resetError.message)
            } else {
                setSuccess(true)
                toast.success("Contraseña actualizada correctamente")
                setTimeout(() => {
                    router.push("/dashboard")
                }, 2000)
            }
        } catch (err: any) {
            setError(err.message || "Error al actualizar contraseña")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Restablecer Contraseña</h1>
                <p className="text-white/60">Ingresa tu nueva contraseña para acceder a tu cuenta.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/10">
                {!success ? (
                    <form onSubmit={handleReset} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-white/80">Nueva Contraseña</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-white/80">Confirmar Contraseña</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repite tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full text-lg font-bold"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                "Actualizar Contraseña"
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                            <CheckCircle2 className="text-emerald-500 h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">¡Éxito!</h3>
                        <p className="text-sm text-white/60">
                            Tu contraseña ha sido actualizada. <br />
                            Redirigiéndote al dashboard...
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
