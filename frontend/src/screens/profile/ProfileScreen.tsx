import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ChevronRight, Globe, Bell, User, Award, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, signOut } from '@/services/authService'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import BottomNav from "@/components/BottomNav"

export default function ProfileScreen() {
    const navigate = useNavigate()
    const { language, setLanguage, t } = useLanguage()
    const { toast } = useToast()

    const [profile, setProfile] = useState<any>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const user = await getCurrentUser()

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setProfile(data)
        } catch (error) {
            console.error('Error loading profile:', error)
        }
    }

    const uploadProfilePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return

            const file = event.target.files[0]
            const user = await getCurrentUser()

            setUploading(true)

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/avatar.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(fileName, file, { upsert: true })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(fileName)

            // Update profile
            await supabase
                .from('profiles')
                .update({ profile_photo_url: publicUrl })
                .eq('id', user.id)

            setProfile({ ...profile, profile_photo_url: publicUrl })

            toast({
                title: t('common.success'),
                description: 'Profile photo updated!',
            })

        } catch (error) {
            console.error('Error uploading photo:', error)
            toast({
                title: 'Error',
                description: 'Could not upload photo',
                variant: 'destructive'
            })
        } finally {
            setUploading(false)
        }
    }

    const handleLogout = async () => {
        if (window.confirm("Log out of Calo Cal?\nYou'll need to sign in again.")) {
            await signOut()
            navigate('/login', { replace: true })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4">
                <h1 className="text-2xl font-bold font-display">{t('profile.profile')}</h1>
            </header>

            {/* Profile Photo */}
            <div className="bg-white p-6 mb-6 flex flex-col items-center shadow-sm">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#F5C518] overflow-hidden border-4 border-white shadow-md">
                        {profile?.profile_photo_url ? (
                            <img
                                src={profile.profile_photo_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center 
                            text-4xl font-bold font-display text-white">
                                {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>

                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-black 
                          rounded-full flex items-center justify-center 
                          cursor-pointer hover:bg-gray-800 transition-colors shadow-sm">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={uploadProfilePhoto}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>

                <h2 className="text-xl font-bold font-display text-gray-900">{profile?.full_name}</h2>
                <p className="text-sm text-gray-600">{profile?.email}</p>
            </div>

            {/* Settings */}
            <div className="bg-white shadow-sm overflow-hidden mb-8">
                {/* Personal Info */}
                <button
                    onClick={() => navigate('/profile/info')}
                    className="w-full px-6 py-4 flex items-center justify-between 
                   border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                            <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium">{t('profile.personalInfo')}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* My Goals */}
                <button
                    onClick={() => navigate('/profile/goals')}
                    className="w-full px-6 py-4 flex items-center justify-between 
                   border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                            <Award className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium">{t('profile.myGoals')}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Notifications */}
                <button
                    onClick={() => navigate('/profile/notifications')}
                    className="w-full px-6 py-4 flex items-center justify-between 
                   border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium">{t('profile.notifications')}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Language */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                            <Globe className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium">{t('profile.language')}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {(['en', 'fr', 'ar'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`py-2 px-2 rounded-xl border-2 font-medium text-sm
                           transition-all ${language === lang
                                        ? 'border-[#F5C518] bg-yellow-50 text-gray-900 border-opacity-100'
                                        : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {t(`languages.${lang}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full px-6 py-5 flex items-center justify-center gap-3 
                   text-red-600 hover:bg-red-50 transition-colors font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('profile.logout')}</span>
                </button>
            </div>

            <BottomNav />
        </div>
    )
}
