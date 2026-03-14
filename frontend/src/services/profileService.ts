import { supabase } from '@/lib/supabase'

export interface Profile {
    id: string
    full_name: string
    age: number
    sex: string
    height_cm: number
    current_weight_kg: number
    target_weight_kg: number
    daily_calorie_goal: number
    goal_type: string
    activity_level?: string
    onboarding_completed: boolean
    preferred_language?: string
    profile_photo_url?: string
    notification_preferences?: any
    updated_at: string
}

export async function getUserProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) return null
    return data
}

export async function updateUserProfile(
    updates: Partial<{
        full_name: string
        age: number
        sex: string
        height_cm: number
        current_weight_kg: number
        target_weight_kg: number
        daily_calorie_goal: number
        goal_type: string
        activity_level: string
        onboarding_completed: boolean
    }>
) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('profiles')
        .upsert(
            { id: user.id, ...updates, updated_at: new Date().toISOString() },
            { onConflict: 'id' }
        )

    if (error) throw error
}
