import { Geist, Geist_Mono, Funnel_Display } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
    variable: "--font-funnel-display",
    subsets: ["latin"],
});

export default function CardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} ${funnelDisplay.variable} antialiased min-h-[100dvh] bg-black text-white selection:bg-emerald-500/30`}>
            {children}
        </div>
    );
}
