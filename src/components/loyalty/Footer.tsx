"use client";
import Link from "next/link";
import { Zap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-[#0B0F0E] pt-20 pb-10 border-t border-gray-200 dark:border-[#1F2A26] transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Zap className="h-6 w-6 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                LoyaltyPro
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-[#8FAFA2] leading-relaxed">
                            La plataforma de fidelización más avanzada para negocios que buscan crecer y retener a sus clientes con tecnología de vanguardia.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white dark:bg-[#151D1C] border border-gray-200 dark:border-[#1F2A26] flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Plataforma</h4>
                        <ul className="space-y-4 text-gray-500 dark:text-[#8FAFA2]">
                            <li><Link href="#features" className="hover:text-emerald-500 transition-colors">Características</Link></li>
                            <li><Link href="#pricing" className="hover:text-emerald-500 transition-colors">Planes y Precios</Link></li>
                            <li><Link href="/onboarding" className="hover:text-emerald-500 transition-colors">Comenzar Gratis</Link></li>
                            <li><Link href="/login" className="hover:text-emerald-500 transition-colors">Acceso Clientes</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Empresa</h4>
                        <ul className="space-y-4 text-gray-500 dark:text-[#8FAFA2]">
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Términos de Servicio</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Contacto</h4>
                        <ul className="space-y-4 text-gray-500 dark:text-[#8FAFA2]">
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-emerald-500" />
                                <span>hola@loyaltypro.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-emerald-500" />
                                <span>+51 987 654 321</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin size={18} className="text-emerald-500" />
                                <span>Lima, Perú</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-[#1F2A26] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-[#8FAFA2]">
                    <p>© {currentYear} LoyaltyPro. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-emerald-500 transition-colors">Soporte</Link>
                        <Link href="#" className="hover:text-emerald-500 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
