
export default function WhatIs() {
    return (
        <section className="py-24 px-6 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300" id="how-it-works">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    La fidelización que impulsa tus ingresos
                </h2>
                <p className="text-gray-600 dark:text-[#8FAFA2] mb-8 text-lg">
                    Convierte cada compra en una oportunidad para que tus clientes regresen.
                    Nuestro sistema transforma consumos en puntos que pueden canjearse por
                    premios definidos por tu negocio, creando un hábito de recompra constante.
                </p>
                <div className="flex justify-center gap-4 md:gap-12 flex-wrap">
                    {[
                        "Más visitas",
                        "Más ventas",
                        "Más lealtad"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-[#19E28C]/5 px-6 py-3 rounded-full border border-[#19E28C]/20 hover:bg-[#19E28C]/10 transition-colors">
                            <div className="w-5 h-5 rounded-full bg-[#19E28C] flex items-center justify-center text-black">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-[#19E28C] font-bold text-lg">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
