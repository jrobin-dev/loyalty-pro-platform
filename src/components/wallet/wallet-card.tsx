import { Wallet, QrCode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface WalletCardProps {
    tenant: any
    customer: any
    stamps: number
    maxStamps: number
    primaryColor: string
}

export const WalletCard = ({ tenant, customer, stamps, maxStamps, primaryColor }: WalletCardProps) => {
    const progress = Math.min((stamps / maxStamps) * 100, 100)

    return (
        <div className="relative w-full aspect-[1.586] bg-gradient-to-br from-zinc-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group transition-all duration-500 hover:scale-[1.02]">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Glow Effects */}
            <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-500"
                style={{ backgroundColor: primaryColor }}
            ></div>

            <div className="relative h-full p-6 flex flex-col justify-between z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-funnel-display)] tracking-tight">
                            {tenant?.name || "Loyalty Card"}
                        </h2>
                        <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium mt-1">
                            {stamps >= maxStamps ? 'GOLD MEMBER' : 'MEMBER'}
                        </p>
                    </div>
                    <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/5">
                        <Wallet className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Stamp Progress */}
                    <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                            <span>Nivel Actual</span>
                            <span className="font-bold" style={{ color: primaryColor }}>{stamps} / {maxStamps} Stamps</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out relative"
                                style={{ width: `${progress}%`, backgroundColor: primaryColor }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_white]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                            {customer?.name?.substring(0, 2).toUpperCase() || 'US'}
                        </div>
                        <div className="text-xs">
                            <p className="text-white font-medium">{customer?.name || 'Usuario'}</p>
                            <p className="text-white/40 font-mono tracking-wider">ID: {customer?.id?.substring(0, 4)}</p>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="bg-white text-black p-2 rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/10">
                                <QrCode size={20} />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-black border-white/10 sm:max-w-xs flex flex-col items-center justify-center p-8 gap-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-white font-bold text-xl font-[family-name:var(--font-funnel-display)]">{tenant?.name}</h3>
                                <p className="text-white/50 text-sm">Escanea para sumar puntos</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl shadow-2xl shadow-white/5 w-full aspect-square">
                                <QRCodeSVG
                                    value={customer?.id || ""}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-white/30 text-xs font-mono">{customer?.id}</p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
