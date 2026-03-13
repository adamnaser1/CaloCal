import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/services/authService'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'

export default function NotificationsScreen() {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { toast } = useToast()

    const [preferences, setPreferences] = useState({
        meal_reminders: true,
        goal_updates: true,
        weekly_summary: true,
        push_enabled: false,
    })

    useEffect(() => {
        loadPreferences()
    }, [])

    const loadPreferences = async () => {
        try {
            const user = await getCurrentUser()

            const { data } = await supabase
                .from('profiles')
                .select('notification_preferences')
                .eq('id', user.id)
                .single()

            if (data?.notification_preferences) {
                setPreferences(data.notification_preferences)
            }
        } catch (error) {
            console.error('Error loading preferences:', error)
        }
    }

    const updatePreference = async (key: string, value: boolean) => {
        try {
            const user = await getCurrentUser()
            const newPreferences = { ...preferences, [key]: value }

            await supabase
                .from('profiles')
                .update({ notification_preferences: newPreferences })
                .eq('id', user.id)

            setPreferences(newPreferences)

            toast({
                title: t('common.save') !== 'common.save' ? t('common.save') : 'Saved',
                description: 'Preferences updated',
            })

        } catch (error) {
            console.error('Error updating preferences:', error)
            toast({
                title: 'Error',
                description: 'Could not save preferences',
                variant: 'destructive'
            })
        }
    }

    const notificationTypes = [
        { key: 'meal_reminders', label: t('profile.mealReminders') !== 'profile.mealReminders' ? t('profile.mealReminders') : 'Meal reminders', icon: '🍽️' },
        { key: 'goal_updates', label: t('profile.goalUpdates') !== 'profile.goalUpdates' ? t('profile.goalUpdates') : 'Goal updates', icon: '🎯' },
        { key: 'weekly_summary', label: t('profile.weeklySummary') !== 'profile.weeklySummary' ? t('profile.weeklySummary') : 'Weekly summary', icon: '📊' },
        { key: 'push_enabled', label: t('profile.pushNotifications') !== 'profile.pushNotifications' ? t('profile.pushNotifications') : 'Push notifications', icon: '🔔' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold font-display">{t('profile.notifications') !== 'profile.notifications' ? t('profile.notifications') : 'Notifications'}</h1>
            </header>

            <div className="p-6">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    {notificationTypes.map((type, index) => (
                        <div
                            key={type.key}
                            className={`p-5 flex items-center justify-between ${index !== notificationTypes.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{type.icon}</span>
                                <span className="font-medium text-gray-900">{type.label}</span>
                            </div>

                            <label className="relative inline-block w-12 h-6 flex-shrink-0">
                                <input
                                    type="checkbox"
                                    checked={preferences[type.key as keyof typeof preferences]}
                                    onChange={(e) => updatePreference(type.key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-200 rounded-full 
                              peer-checked:bg-[#F5C518] transition-colors
                              cursor-pointer border border-transparent shadow-inner">
                                    <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white 
                                rounded-full transition-transform shadow-sm
                                peer-checked:translate-x-6" />
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
