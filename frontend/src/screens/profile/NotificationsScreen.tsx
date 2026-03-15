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
                title: t('notificationsSaved'),
                description: t('notificationsSaved'),
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
        { key: 'meal_reminders', label: t('mealReminders'), icon: '🍽️' },
        { key: 'goal_updates', label: t('goalUpdates'), icon: '🎯' },
        { key: 'weekly_summary', label: t('weeklySummary'), icon: '📊' },
        { key: 'push_enabled', label: t('pushNotifications'), icon: '🔔' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold font-display">{t('profile.notifications')}</h1>
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

                            <button
                                onClick={() => updatePreference(type.key, !preferences[type.key as keyof typeof preferences])}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:ring-offset-2 ${preferences[type.key as keyof typeof preferences] ? 'bg-[#F5C518]' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences[type.key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
