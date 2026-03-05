import { supabase } from '@/lib/supabase'

export interface NotificationSettings {
    breakfastReminder: { enabled: boolean; time: string }
    lunchReminder: { enabled: boolean; time: string }
    dinnerReminder: { enabled: boolean; time: string }
    weeklyReports: boolean
    nutritionTips: boolean
    hydrationReminders: boolean
}

const DEFAULT_SETTINGS: NotificationSettings = {
    breakfastReminder: { enabled: true, time: '07:30' },
    lunchReminder: { enabled: true, time: '12:30' },
    dinnerReminder: { enabled: false, time: '19:30' },
    weeklyReports: true,
    nutritionTips: false,
    hydrationReminders: true
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return DEFAULT_SETTINGS

    const { data, error } = await supabase
        .from('profiles')
        .select('notifications_settings')
        .eq('id', user.id)
        .single()

    if (error || !data?.notifications_settings) {
        return DEFAULT_SETTINGS
    }

    // Merge with default to ensure all keys exist if schema evolves
    return { ...DEFAULT_SETTINGS, ...data.notifications_settings }
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
        .from('profiles')
        .update({ notifications_settings: settings })
        .eq('id', user.id)

    if (error) throw error
}
