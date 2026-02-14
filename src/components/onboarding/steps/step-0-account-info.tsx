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
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    Crea tu Cuenta
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                    Usarás este email para acceder a tu dashboard.
                </p>
            </div>

            <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <Input
                            type="email"
                            placeholder="tu@email.com"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold pl-12 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-800 outline-none"
                            autoFocus
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-400">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Contraseña</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={data.password}
                            onChange={(e) => updateData({ password: e.target.value })}
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold pl-12 pr-12 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-800 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Confirmar Contraseña</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold pl-12 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-800 outline-none"
                        />
                    </div>
                    {errors.confirm && (
                        <p className="text-xs text-red-400">{errors.confirm}</p>
                    )}
                </div>
            </div>

            <button
                onClick={handleContinue}
                className="w-full h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4"
            >
                Continuar
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
            </p>
        </div>
    )
}
