import { useState, useEffect } from "react"
import { Wallet, QrCode, Coffee, Pizza, ShoppingBag, Dumbbell, Scissors, Star, Check, Lock } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface WalletCardProps {
    tenant: any
    customer: any
    stamps: number
    maxStamps: number
    primaryColor: string
    onAvatarClick?: () => void
}

const STAMP_ICONS: Record<string, any> = {
    coffee: Coffee,
    restaurant: Pizza,
    retail: ShoppingBag,
    beauty: Scissors,
    fitness: Dumbbell,
    other: Star,
}

function TypewriterText({ text, color }: { text: string, color: string }) {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, [text]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className="inline-flex items-center">
            {displayedText}
            <span className={`${showCursor ? "opacity-100" : "opacity-0"} ml-0.5`} style={{ color: color }}>|</span>
        </span>
    );
}

export const WalletCard = ({ tenant, customer, stamps, maxStamps, primaryColor, onAvatarClick }: WalletCardProps) => {
    // Determine Stamp Icon
    const stampType = tenant?.loyalty?.stampIcon || 'star'
    const customIconUrl = tenant?.loyalty?.customIconUrl
    const StampIcon = STAMP_ICONS[stampType] || Star

    console.log('WalletCard Render:', { stampType, customIconUrl, fullLoyalty: tenant?.loyalty })


    // Reward Image
    const rewardImage = tenant?.loyalty?.rewardImage || '/assets/images/clientes/stamps/premio.png'
    const pendingImage = '/assets/images/clientes/stamps/stamppending.png'

    const [showQr, setShowQr] = useState(false)

    const progress = Math.min((stamps / maxStamps) * 100, 100)

    return (
        <div className="relative w-full h-auto min-h-[240px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group transition-all duration-500 hover:scale-[1.02]"
            style={{
                background: `radial-gradient(circle at top right, ${primaryColor}40, transparent 60%), linear-gradient(to bottom right, #18181b, #000000)`
            }}
        >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Glow Effects - Adjusted for new gradient background */}
            <div
                className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-all duration-500"
                style={{ backgroundColor: primaryColor }}
            ></div>

            <div className="relative h-full p-6 flex flex-col justify-between z-10 gap-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-funnel-display)] tracking-tight flex items-center gap-1 group/header">
                            Hola:
                            <span className="font-[200] ml-1" style={{ color: primaryColor }}>
                                <TypewriterText text={customer.name || 'Cliente'} color={primaryColor} />
                            </span>
                            <div className="flex items-center ml-1">
                                <span className="w-2 h-2 rounded-full bg-[#19E28C] shadow-[0_0_8px_#19E28C]" />
                            </div>
                        </h2>
                        <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium mt-1">
                            Cliente Premium
                        </p>
                    </div>
                    <div
                        onClick={onAvatarClick}
                        className="bg-white/10 rounded-full backdrop-blur-md border border-white/5 w-10 h-10 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform hover:ring-2 hover:ring-white/20"
                    >
                        {customer?.avatarUrl ? (
                            <img src={customer.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-white">{customer.name?.[0] || 'C'}</span>
                        )}
                    </div>
                </div>

                {/* Content: Progress + Stamp Grid */}
                <div className="space-y-6">
                    {/* Progress Bar */}
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

                    {/* Stamp Grid */}
                    <div className="grid grid-cols-5 gap-3 w-full max-w-sm mx-auto">
                        {Array.from({ length: maxStamps }).map((_, index) => {
                            const isEarned = index < stamps
                            const isReward = index === maxStamps - 1

                            // Determine what to render
                            if (isReward && !isEarned) {
                                return (
                                    <div key={index} className="aspect-square rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group/stamp">
                                        <img src={rewardImage} alt="Reward" className="w-full h-full object-contain p-1 opacity-80 group-hover/stamp:opacity-100 transition-opacity" />
                                    </div>
                                )
                            }

                            if (isEarned) {
                                return (
                                    <div key={index} className="aspect-square rounded-full border flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300 relative overflow-hidden"
                                        style={{
                                            borderColor: primaryColor,
                                            backgroundColor: `${primaryColor}20`
                                        }}>
                                        {stampType === 'custom' && customIconUrl ? (
                                            <img
                                                src={customIconUrl}
                                                alt="Stamp"
                                                className="w-full h-full object-contain p-1.5"
                                                style={{ filter: `drop-shadow(0 0 4px ${primaryColor})` }}
                                            />
                                        ) : (
                                            <StampIcon size={20} style={{ color: primaryColor }} />
                                        )}
                                    </div>
                                )
                            }

                            // Lock Icon for pending stamps (Unearned)
                            return (
                                <div key={index} className="aspect-square rounded-full bg-white/5 border border-white/10 flex items-center justify-center group/lock overflow-hidden">
                                    <img
                                        src={pendingImage}
                                        alt="Pending"
                                        className="w-full h-full object-cover opacity-80 group-hover/lock:opacity-100 transition-opacity"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end mt-2">
                    <div className="max-w-[65%]">
                        <p className="text-[10px] text-white/60 leading-relaxed text-balance">
                            En tu próxima visita, muestra tu código QR o tu email para sumar una nueva stamp de fidelidad.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowQr(true)}
                        className="bg-white text-black p-2 rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
                    >
                        <QrCode size={20} />
                    </button>
                </div>

                {/* QR Code Overlay - Internal "Modal" */}
                {showQr && (
                    <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-8 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={() => setShowQr(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>

                        <div className="text-center space-y-2">
                            <h3 className="text-white font-bold text-xl font-[family-name:var(--font-funnel-display)]">
                                {tenant?.name}
                            </h3>
                            <p className="text-white/50 text-sm">Escanea para sumar puntos</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-2xl shadow-white/5 w-full aspect-square max-w-[200px]">
                            <QRCodeSVG
                                value={customer?.id || ""}
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-white/30 text-xs font-mono">{customer?.id}</p>
                        </div>
                    </div>
                )}
            </div >
        </div >
    )
}
