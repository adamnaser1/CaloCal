import { supabase } from '@/lib/supabase'

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            }
        }
    })

    if (error) throw error
    return data
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) throw new Error("No authenticated user")
    return user
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}
