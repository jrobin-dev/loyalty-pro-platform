import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthErrorPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl font-bold text-destructive">Error de Autenticación</h1>
            <p className="text-muted-foreground">
                No se pudo verificar el enlace de acceso. Es posible que haya expirado o ya haya sido usado.
            </p>
            <Button asChild>
                <Link href="/login">Volver al Login</Link>
            </Button>
        </div>
    )
}
