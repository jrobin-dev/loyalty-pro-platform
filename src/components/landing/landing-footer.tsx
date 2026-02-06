"use client"

import Link from "next/link"
import { Zap, Twitter, Linkedin, Instagram, Youtube, Mail } from "lucide-react"

const footerLinks = {
    product: {
        title: "Producto",
        links: [
            { label: "Características", href: "#features" },
            { label: "Precios", href: "#pricing" },
            { label: "Integraciones", href: "#integrations" },
            { label: "Roadmap", href: "#roadmap" },
        ],
    },
    company: {
        title: "Empresa",
        links: [
            { label: "Sobre Nosotros", href: "#about" },
            { label: "Blog", href: "#blog" },
            { label: "Carreras", href: "#careers" },
            { label: "Prensa", href: "#press" },
        ],
    },
    resources: {
        title: "Recursos",
        links: [
            { label: "Documentación", href: "#docs" },
            { label: "Guías", href: "#guides" },
            { label: "API", href: "#api" },
            { label: "Estado del Servicio", href: "#status" },
        ],
    },
    legal: {
        title: "Legal",
        links: [
            { label: "Términos", href: "#terms" },
            { label: "Privacidad", href: "#privacy" },
            { label: "Cookies", href: "#cookies" },
            { label: "GDPR", href: "#gdpr" },
        ],
    },
}

const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
]

export function LandingFooter() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                LoyaltyPro
                            </span>
                        </Link>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            La plataforma de lealtad más simple y poderosa para hacer crecer tu negocio.
                            Empieza gratis hoy.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} LoyaltyPro. Todos los derechos reservados.
                    </p>

                    <div className="flex items-center gap-6">
                        <a
                            href="mailto:hola@loyaltypro.com"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            hola@loyaltypro.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
