import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { translate as t, Language } from '@/i18n/translations'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => Promise<void>
    t: (key: string, params?: Record<string, any>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { user, profile, refreshProfile } = useAuth()
    const [language, setLanguageState] = useState<Language>('en')

    // Update local state when profile loads/changes
    useEffect(() => {
        if (profile?.preferred_language) {
            setLanguageState(profile.preferred_language as Language)
        }
    }, [profile])

    const setLanguage = async (lang: Language) => {
        try {
            if (!user) return

            const { error } = await supabase
                .from('profiles')
                .update({ preferred_language: lang })
                .eq('id', user.id)

            if (error) throw error

            setLanguageState(lang)
            await refreshProfile() // Sync global auth profile
        } catch (error) {
            console.error('Error saving language:', error)
        }
    }

    const translate = (key: string, params?: Record<string, any>) => {
        return t(key, language, params)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider')
    }
    return context
}
