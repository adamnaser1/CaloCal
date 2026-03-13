import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/services/authService'
import { translations, Language, translate as t } from '@/i18n/translations'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string, params?: Record<string, any>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en')

    useEffect(() => {
        loadUserLanguage()
    }, [])

    const loadUserLanguage = async () => {
        try {
            const user = await getCurrentUser()

            const { data } = await supabase
                .from('profiles')
                .select('preferred_language')
                .eq('id', user.id)
                .single()

            if (data?.preferred_language) {
                setLanguageState(data.preferred_language as Language)
            }
        } catch (error) {
            console.error('Error loading language:', error)
        }
    }

    const setLanguage = async (lang: Language) => {
        try {
            const user = await getCurrentUser()

            await supabase
                .from('profiles')
                .update({ preferred_language: lang })
                .eq('id', user.id)

            setLanguageState(lang)
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
