"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteAccountModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
    const router = useRouter()
    const [confirmText, setConfirmText] = useState("")
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (confirmText !== "ELIMINAR") {
            toast.error('Debes escribir "ELIMINAR" para confirmar')
            return
        }

        try {
            setDeleting(true)

            const response = await fetch("/api/user/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmationText: confirmText }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Error al eliminar cuenta")
            }

            toast.success("Cuenta eliminada correctamente")

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push("/login")
            }, 1500)
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar cuenta")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-500/10 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <DialogTitle className="text-xl">Eliminar Cuenta</DialogTitle>
                    </div>
                    <DialogDescription className="text-white/60">
                        Esta acción es <strong className="text-red-500">permanente e irreversible</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-2">
                        <p className="text-sm text-white/80 font-medium">
                            Al eliminar tu cuenta, perderás:
                        </p>
                        <ul className="text-sm text-white/60 space-y-1 list-disc list-inside">
                            <li>Todos tus datos de negocio</li>
                            <li>Todos tus clientes y sus stamps</li>
                            <li>Todo el historial de transacciones</li>
                            <li>Configuración de branding y lealtad</li>
                            <li>Acceso a tu cuenta</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80">
                            Para confirmar, escribe <span className="font-mono font-bold text-red-500">ELIMINAR</span>
                        </Label>
                        <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="ELIMINAR"
                            className="bg-white/5 border-white/10 font-mono"
                            autoFocus
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false)
                            setConfirmText("")
                        }}
                        disabled={deleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={confirmText !== "ELIMINAR" || deleting}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            "Eliminar Permanentemente"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
