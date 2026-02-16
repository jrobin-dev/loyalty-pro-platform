
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Language, TranslationDictionary } from "@/i18n/types"
import { es } from "@/i18n/es"
import { en } from "@/i18n/en"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const dictionaries: Record<Language, TranslationDictionary> = { es, en }

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('es') // Default ES to correspond with existing UI
    const [mounted, setMounted] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('language') as Language
        if (saved && (saved === 'es' || saved === 'en')) {
            setLanguage(saved)
        }
        setMounted(true)
    }, [])

    // Persist to localStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('language', language)
        }
    }, [language, mounted])

    // Translation helper
    // Supported format: t('sidebar.dashboard')
    const t = (key: string): string => {
        const keys = key.split('.')
        let current: any = dictionaries[language]

        for (const k of keys) {
            if (current[k] === undefined) {
                console.warn(`Translation key missing: ${key} in ${language}`)
                return key // Fallback to key
            }
            current = current[k]
        }

        return current as string
    }

    // Prevent hydration mismatch by rendering children only after mount (or handle carefully)
    // Actually, for minimal flicker, we render immediately but might have a split second of default lang.
    // 'es' is default, and site is currently in 'es', so no flicker expected for default users.

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
