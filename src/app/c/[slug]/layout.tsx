export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white flex justify-center">
            {/* Mobile Container Limit */}
            <div className="w-full max-w-md bg-[#0a0a0a] min-h-screen relative shadow-2xl shadow-white/5">
                {children}
            </div>
        </div>
    )
}
