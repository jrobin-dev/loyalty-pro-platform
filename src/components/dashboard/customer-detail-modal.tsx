"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Customer } from "@/hooks/use-customers"
import { Award, Calendar, Gift, Pencil, Save, X, Loader2, Coffee, Pizza, ShoppingBag, Scissors, Dumbbell, Star } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { toast } from "sonner"

interface CustomerDetailModalProps {
    customer: Customer | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate?: () => void
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CustomerDetailModal({ customer, open, onOpenChange, onUpdate }: CustomerDetailModalProps) {
    // Hooks
    const { settings } = useTenantSettings()

    // State
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editData, setEditData] = useState({
        email: "",
        phone: "",
        countryCode: "+51",
        lastName: "",
        birthday: ""
    })

    // Update state when customer changes
    useEffect(() => {
        if (customer) {
            let phone = customer.phone || ""
            let code = "+51"

            // Try to extract country code if phone starts with +
            // Simple heuristic: if phone starts with +, take first 2-4 chars as code
            // Actually, for now, let's just default to +51 if we can't easily tell, 
            // OR if the phone already includes the code, we try to split it.
            // Given the previous requirement "SIEMPRE donde se pondra NUMEROS como la IMAGEN 2", 
            // we should try to match against known codes if possible.

            // For this implementation, since we just started saving with space (e.g. "+51 987654321"), 
            // we can split by space.
            if (phone.includes(" ")) {
                const parts = phone.split(" ")
                if (parts[0].startsWith("+")) {
                    code = parts[0]
                    phone = parts.slice(1).join(" ")
                }
            } else if (phone.startsWith("+")) {
                // If it's like +51987654321, it's harder. Let's assume +51 for now if no space
                // or just leave it in the phone field? 
                // Better to leave it in phone if we can't parse it cleanly, user can fix it.
            }

            setEditData({
                email: customer.email || "",
                phone: phone,
                countryCode: code,
                lastName: customer.lastName || "",
                birthday: customer.birthday ? format(new Date(customer.birthday), 'yyyy-MM-dd') : ""
            })
            setIsEditing(false)
        }
    }, [customer, open])

    if (!customer) return null

    const stampsRequired = settings?.loyaltyProgram?.stampsRequired || 10
    const progressPercentage = (customer.stamps / stampsRequired) * 100
    const rewardsEarned = 0 // TODO: Calculate from redeemed stamps

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const fullPhone = `${editData.countryCode} ${editData.phone}`.trim()

            const response = await fetch(`/api/customers/${customer.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: editData.email,
                    phone: fullPhone,
                    lastName: editData.lastName,
                    birthday: editData.birthday || null
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al actualizar')
            }

            toast.success("Cliente actualizado correctamente")
            setIsEditing(false)
            if (onUpdate) onUpdate()

            // Optimization: Update local customer object to reflect changes immediately in UI
            customer.email = editData.email
            customer.phone = fullPhone
            customer.lastName = editData.lastName
            customer.birthday = editData.birthday ? new Date(editData.birthday) : undefined

        } catch (error: any) {
            toast.error("Error al actualizar", { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[640px] bg-[#0a0a0a] border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl text-foreground">
                <DialogHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                    <DialogTitle className="text-3xl font-medium tracking-tighter flex items-center gap-5">
                        <Avatar className="h-16 w-16 border-2 border-zinc-800 shadow-xl">
                            <AvatarImage src={customer.avatarUrl} className="object-cover" />
                            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-lg font-black uppercase">
                                {customer.name.charAt(0)}
                                {customer.lastName?.charAt(0) || ''}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="block text-white leading-tight">{customer.name} {customer.lastName}</span>
                            <span className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">Detalle del cliente</span>
                        </div>
                    </DialogTitle>

                    {!isEditing ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                                disabled={isLoading}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSave}
                                disabled={isLoading}
                                className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                Guardar
                            </Button>
                        </div>
                    )}
                </DialogHeader>

                <div className="px-8 pb-10 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-zinc-900/40 p-6 rounded-[1.8rem] border border-white/5">
                        {isEditing ? (
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="space-y-2">
                                    <p className="text-zinc-500 font-black uppercase tracking-tight text-[10px]">Nombre</p>
                                    <Input
                                        value={customer.name}
                                        disabled
                                        className="bg-[#1c1c1c]/50 border-white/5 h-12 rounded-xl text-zinc-600 font-bold px-4 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-zinc-500 font-black uppercase tracking-tight text-[10px]">Apellido</p>
                                    <Input
                                        value={editData.lastName}
                                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                                        className="bg-[#1c1c1c] border-white/5 h-12 rounded-xl text-white font-bold px-4 focus-visible:ring-1 focus-visible:ring-white/10 transition-all"
                                        placeholder="Apellido"
                                    />
                                </div>
                            </div>
                        ) : (
                            <h3 className="text-xl font-bold text-white mb-5 tracking-tight">
                                {customer.name} {customer.lastName}
                            </h3>
                        )}

                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div className="space-y-2">
                                <p className="text-zinc-500 font-black uppercase tracking-tight text-[10px]">Email</p>
                                {isEditing ? (
                                    <Input
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="bg-[#1c1c1c] border-white/5 h-12 rounded-xl text-white font-bold px-4 focus-visible:ring-1 focus-visible:ring-white/10"
                                    />
                                ) : (
                                    <p className="text-white h-8 flex items-center font-bold tracking-tight">{customer.email || 'No registrado'}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-zinc-500 font-black uppercase tracking-tight text-[10px]">WhatsApp</p>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <div className="shrink-0">
                                            <CountryCodeSelect
                                                value={editData.countryCode}
                                                onChange={(code) => setEditData({ ...editData, countryCode: code })}
                                            />
                                        </div>
                                        <Input
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                            className="bg-[#1c1c1c] border-white/5 h-12 rounded-xl text-white font-bold px-4 flex-1 focus-visible:ring-1 focus-visible:ring-white/10"
                                            placeholder="900 000 000"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-white h-8 flex items-center font-bold tracking-tight">{customer.phone || 'No registrado'}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-zinc-500 font-black uppercase tracking-tight text-[10px]">Cumpleaños</p>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={editData.birthday}
                                        onChange={(e) => setEditData({ ...editData, birthday: e.target.value })}
                                        className="bg-[#1c1c1c] border-white/5 h-12 rounded-xl text-white font-bold px-4 w-full focus-visible:ring-1 focus-visible:ring-white/10"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                ) : (
                                    <p className="text-white h-8 flex items-center font-bold tracking-tight">
                                        {customer.birthday
                                            ? format(new Date(customer.birthday), "d 'de' MMMM", { locale: es })
                                            : 'No registrado'}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-zinc-500 font-black uppercase tracking-tight text-[10px]">Última visita</p>
                                <p className="text-white flex items-center gap-2 h-8 font-bold tracking-tight">
                                    <Calendar className="h-4 w-4 text-zinc-500" />
                                    {customer.last_visit
                                        ? format(new Date(customer.last_visit), "d 'de' MMMM, yyyy", { locale: es })
                                        : 'Nunca'
                                    }
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-zinc-500 font-black uppercase tracking-tight text-[10px]">Total visitas</p>
                                <p className="text-white h-8 flex items-center font-bold tracking-tight">{customer.visits} visitas</p>
                            </div>
                        </div>
                    </div>

                    {/* Loyalty Progress */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-foreground">Progreso de Lealtad</h4>
                            <span className="text-sm text-emerald-600 dark:text-emerald-400">{customer.stamps}/{stampsRequired} sellos</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-secondary/50 dark:bg-white/10 rounded-full h-2 overflow-hidden mb-4 border border-border/10">
                            <div
                                className="h-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${progressPercentage}%`, backgroundColor: settings?.branding?.primaryColor || "#00FF94" }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_white] opacity-50 dark:opacity-100"></div>
                            </div>
                        </div>

                        {/* Stamps Grid - Updated to Flex Wrap Centered */}
                        <div className="flex flex-wrap justify-center gap-2 w-full">
                            {Array.from({ length: stampsRequired }).map((_, index) => {
                                const isEarned = index < customer.stamps
                                const isReward = index === stampsRequired - 1

                                // Reward Image (using same default as WalletCard for consistency)
                                const rewardImage = settings?.loyaltyProgram?.rewardImage || '/assets/images/clientes/stamps/premio.png'
                                const pendingImage = '/assets/images/clientes/stamps/stamppending.png'

                                // Determine Stamp Icon type
                                const stampType = settings?.loyaltyProgram?.stampIcon || 'star'
                                const customIconUrl = settings?.loyaltyProgram?.customIconUrl
                                const STAMP_ICONS: Record<string, any> = {
                                    coffee: Coffee,
                                    restaurant: Pizza,
                                    retail: ShoppingBag,
                                    beauty: Scissors,
                                    fitness: Dumbbell,
                                    other: Star,
                                }
                                const StampIcon = STAMP_ICONS[stampType] || Star
                                // Primary color from settings or default
                                const primaryColor = settings?.branding?.primaryColor || "#00FF94"

                                if (isReward && !isEarned) {
                                    return (
                                        <div key={index} className="aspect-square rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group/stamp h-16 w-16">
                                            <img src={rewardImage} alt="Reward" className="w-full h-full object-contain p-1 opacity-80 group-hover/stamp:opacity-100 transition-opacity" />
                                        </div>
                                    )
                                }

                                if (isEarned) {
                                    return (
                                        <div key={index} className="aspect-square rounded-full border flex items-center justify-center shadow-lg dark:shadow-[0_0_10px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300 h-16 w-16 overflow-hidden"
                                            style={{
                                                borderColor: primaryColor,
                                                backgroundColor: `${primaryColor}15`
                                            }}>
                                            {stampType === 'custom' && customIconUrl ? (
                                                <img
                                                    src={customIconUrl}
                                                    alt="Stamp"
                                                    className="w-full h-full object-contain p-2"
                                                    style={{ filter: `drop-shadow(0 0 4px ${primaryColor})` }}
                                                />
                                            ) : (
                                                <StampIcon size={28} style={{ color: primaryColor }} />
                                            )}
                                        </div>
                                    )
                                }

                                return (
                                    <div key={index} className="aspect-square rounded-full bg-secondary/80 dark:bg-black/40 border border-border/10 dark:border-white/5 flex items-center justify-center h-16 w-16 overflow-hidden">
                                        <img src={pendingImage} alt="Pending" className="w-2/3 h-2/3 object-contain opacity-60 dark:opacity-80" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/40 rounded-[1.5rem] p-5 border border-white/5">
                            <div className="flex items-center gap-3 mb-2">
                                <Award className="h-5 w-5 text-yellow-500" />
                                <p className="text-xs font-black uppercase tracking-tight text-zinc-500">Premios Canjeados</p>
                            </div>
                            <p className="text-3xl font-black text-white tracking-tighter">{rewardsEarned}</p>
                        </div>
                        <div className="bg-zinc-900/40 rounded-[1.5rem] p-5 border border-white/5">
                            <div className="flex items-center gap-3 mb-2">
                                <Gift className="h-5 w-5 text-emerald-500" />
                                <p className="text-xs font-black uppercase tracking-tight text-zinc-500">Estado</p>
                            </div>
                            <p className="text-3xl font-black text-emerald-500 tracking-tighter">
                                {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
