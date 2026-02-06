"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const supabase = createClient()
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/dashboard/reset-password`,
            })

            if (resetError) {
                setError(resetError.message)
            } else {
                setSuccess(true)
            }
        } catch (err: any) {
            setError(err.message || "Error al solicitar recuperación")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                        LoyaltyPro
                    </h1>
                    <p className="text-white/60 text-lg">Recuperar Contraseña</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/10">
                    {!success ? (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <p className="text-sm text-white/60 text-center mb-4">
                                Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                            </p>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-white/80">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <Input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
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
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar Instrucciones"
                                )}
                            </Button>

                            {/* Back to Login */}
                            <div className="text-center pt-2">
                                <Link
                                    href="/login"
                                    className="text-sm text-white/40 hover:text-white flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                <CheckCircle2 className="text-emerald-500 h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">¡Correo Enviado!</h3>
                                <p className="text-sm text-white/60">
                                    Hemos enviado las instrucciones a <br />
                                    <span className="text-white font-medium">{email}</span>
                                </p>
                            </div>
                            <p className="text-xs text-white/40 italic">
                                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                            </p>
                            <Link href="/login" className="block w-full">
                                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                                    Volver al Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
