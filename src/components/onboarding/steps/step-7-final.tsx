"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function Step7Final() {
    const { data, prevStep } = useOnboardingStore()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async () => {
        if (!email || !password) {
            toast.error("Por favor completa tus credenciales")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    businessData: data
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Error al registrar')
            }

            toast.success("¡Cuenta creada con éxito!")
            // Clear store? 
            // useOnboardingStore.getState().reset() 
            // Better to wait for redirect
            router.push('/dashboard')

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Último paso!
                </h2>
                <p className="text-white/60 text-sm">
                    Crea tu cuenta para guardar tu negocio.
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Negocio:</span>
                    <span className="font-bold">{data.businessName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Plan:</span>
                    <span className="text-[#00FF94] font-bold">FREE</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">E-mail</Label>
                    <Input
                        placeholder="tu@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Contraseña</Label>
                    <Input
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="ghost" className="flex-1" onClick={prevStep} disabled={isLoading}>
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={handleRegister}
                    disabled={isLoading || !email || !password}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Crear Cuenta'}
                </Button>
            </div>
        </div>
    )
}
