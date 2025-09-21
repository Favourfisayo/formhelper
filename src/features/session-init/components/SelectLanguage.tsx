"use client"

import { Globe } from "lucide-react"

const languages = [
    { code: "en", name: "English" },
    { code: "yo", name: "Yoruba" },
    { code: "ha", name: "Hausa" },
    { code: "ig", name: "Igbo" },
]

export default function SelectLanguage() {
    return (
        <div className="select-group">
            <label htmlFor="language-select" className="select-label flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" aria-hidden="true" />
                Select Language
            </label>
            <select 
                id="language-select"
                name="lang"
                className="select-input focus-ring"
                defaultValue="en"
                aria-label="Select form processing language"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.code})
                    </option>
                ))}
            </select>
        </div>
    )
}