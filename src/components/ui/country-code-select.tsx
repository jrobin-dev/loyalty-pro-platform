"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Popular countries first, then alphabetical
const countries = [
    { value: "pe", label: "Perú", code: "+51", flag: "🇵🇪" },
    { value: "mx", label: "México", code: "+52", flag: "🇲🇽" },
    { value: "co", label: "Colombia", code: "+57", flag: "🇨🇴" },
    { value: "cl", label: "Chile", code: "+56", flag: "🇨🇱" },
    { value: "ar", label: "Argentina", code: "+54", flag: "🇦🇷" },
    { value: "es", label: "España", code: "+34", flag: "🇪🇸" },
    { value: "us", label: "Estados Unidos", code: "+1", flag: "🇺🇸" },
    { value: "br", label: "Brasil", code: "+55", flag: "🇧🇷" },
    { value: "ec", label: "Ecuador", code: "+593", flag: "🇪🇨" },
    { value: "ve", label: "Venezuela", code: "+58", flag: "🇻🇪" },
    { value: "bo", label: "Bolivia", code: "+591", flag: "🇧🇴" },
    { value: "py", label: "Paraguay", code: "+595", flag: "🇵🇾" },
    { value: "uy", label: "Uruguay", code: "+598", flag: "🇺🇾" },
    { value: "cr", label: "Costa Rica", code: "+506", flag: "🇨🇷" },
    { value: "pa", label: "Panamá", code: "+507", flag: "🇵🇦" },
    { value: "do", label: "República Dominicana", code: "+1", flag: "🇩🇴" },
    { value: "gt", label: "Guatemala", code: "+502", flag: "🇬🇹" },
    { value: "sv", label: "El Salvador", code: "+503", flag: "🇸🇻" },
    { value: "hn", label: "Honduras", code: "+504", flag: "🇭🇳" },
    { value: "ni", label: "Nicaragua", code: "+505", flag: "🇳🇮" },
]

interface CountryCodeSelectProps {
    value?: string
    onChange: (value: string) => void
    className?: string
}

export function CountryCodeSelect({ value = "+51", onChange, className }: CountryCodeSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")

    // Find selected country by code match
    const selectedCountry = countries.find((country) => country.code === value) || countries[0]

    // Filter countries based on search
    const filteredCountries = countries.filter((country) =>
        country.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        country.code.includes(searchValue)
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[110px] justify-between px-3 bg-card border-input h-10", className)}
                >
                    <span className="flex items-center gap-2 truncate">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-foreground text-xs">{selectedCountry.code}</span>
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0 bg-popover border-border shadow-2xl z-50">
                <div className="flex items-center border-b px-3 border-border">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                        placeholder="Buscar país..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                    {filteredCountries.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">No se encontró el país.</div>
                    ) : (
                        filteredCountries.map((country) => (
                            <div
                                key={country.value}
                                onClick={() => {
                                    onChange(country.code)
                                    setOpen(false)
                                    setSearchValue("")
                                }}
                                className={cn(
                                    "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer text-foreground",
                                    value === country.code && "bg-accent/50"
                                )}
                            >
                                <span className="text-lg">{country.flag}</span>
                                <span className="flex-1 truncate">{country.label}</span>
                                <span className="text-muted-foreground ml-auto text-xs font-mono">{country.code}</span>
                                {value === country.code && (
                                    <Check className="ml-auto h-4 w-4 text-emerald-500" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
