"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function Step0AccountInfo() {
    const { data, updateData, nextStep } = useOnboardingStore()
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({ email: "", password: "", confirm: "" })

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleContinue = () => {
        // Reset errors
        setErrors({ email: "", password: "", confirm: "" })

        // Validate email
        if (!data.email) {
            setErrors(prev => ({ ...prev, email: "El email es requerido" }))
            return
        }
        if (!validateEmail(data.email)) {
            setErrors(prev => ({ ...prev, email: "Email inválido" }))
            return
        }

        // Validate password
        if (!data.password) {
            setErrors(prev => ({ ...prev, password: "La contraseña es requerida" }))
            return
        }
        if (data.password.length < 6) {
            setErrors(prev => ({ ...prev, password: "Mínimo 6 caracteres" }))
            return
        }

        // Validate confirm password
        if (data.password !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirm: "Las contraseñas no coinciden" }))
            return
        }

        nextStep()
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Crea tu Cuenta
                </h2>
                <p className="text-white/60 text-sm">
                    Usarás este email para acceder a tu dashboard.
                </p>
            </div>

            <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                            type="email"
                            placeholder="tu@email.com"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            className="pl-10"
                            autoFocus
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-400">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Contraseña</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={data.password}
                            onChange={(e) => updateData({ password: e.target.value })}
                            className="pl-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-400">{errors.password}</p>
                    )}
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
                        />
                    </div>
                    {errors.confirm && (
                        <p className="text-xs text-red-400">{errors.confirm}</p>
                    )}
                </div>
            </div>

            <Button
                className="w-full text-lg font-bold"
                size="lg"
                onClick={handleContinue}
            >
                Continuar
            </Button>

            <p className="text-xs text-white/40 text-center">
                Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
            </p>
        </div>
    )
}
