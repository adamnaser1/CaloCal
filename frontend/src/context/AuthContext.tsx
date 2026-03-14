import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import { getUserProfile, Profile } from '@/services/profileService'

interface AuthContextType {
    user: User | null
    profile: Profile | null
    session: Session | null
    loading: boolean
    refreshProfile: () => Promise<void>
    setProfile: (profile: Profile | null) => void
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
    signIn: (email: string, password: string) => Promise<{ error: any }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshProfile = async () => {
        try {
            // Add a 5s timeout to profile fetch to prevent hangs
            const profilePromise = getUserProfile()
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
            )

            const p = await Promise.race([profilePromise, timeoutPromise]) as Profile | null
            setProfile(p)
        } catch (err) {
            console.error('Error refreshing profile:', err)
            // Still allow the app to load even if profile fetch fails
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            try {
                // First read from local storage
                const { data: { session } } = await supabase.auth.getSession()

                if (session) {
                    // Force a network check to validate the token
                    const { data: { user }, error } = await supabase.auth.getUser()
                    if (error || !user) {
                        // Stale or invalid token, clear it
                        await supabase.auth.signOut()
                        setSession(null)
                        setUser(null)
                    } else {
                        setSession(session)
                        setUser(user)
                        await refreshProfile()
                    }
                } else {
                    setSession(null)
                    setUser(null)
                }
            } catch (err) {
                console.error('Auth initialization error:', err)
            } finally {
                setLoading(false)
            }
        }

        initAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setSession(null)
                setUser(null)
                setProfile(null)
            } else {
                setSession(session)
                setUser(session?.user ?? null)
                if (session?.user) {
                    await refreshProfile()
                } else {
                    setProfile(null)
                }
            }

            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
        })
        return { error }
    }

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { error }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setProfile(null)
        setUser(null)
        setSession(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            session,
            loading,
            refreshProfile,
            setProfile,
            signUp,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
