import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Camera, ChevronRight, Globe, Bell, User, Award, LogOut,
    Download, Moon, Sun, Shield, HelpCircle, Info
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, signOut } from '@/services/authService'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'

export default function ProfileScreen() {
    const navigate = useNavigate()
    const { language, setLanguage, t } = useLanguage()
    const { toast } = useToast()

    const [profile, setProfile] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        loadProfile()
        loadDarkMode()
    }, [])

    const loadProfile = async () => {
        try {
            const user = await getCurrentUser()

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Profile fetch error:', error)
                return
            }

            setProfile(data)
        } catch (error) {
            console.error('Error loading profile:', error)
        }
    }

    const loadDarkMode = () => {
        const saved = localStorage.getItem('darkMode')
        if (saved) {
            setDarkMode(saved === 'true')
        }
    }

    const uploadProfilePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return

            const file = event.target.files[0]
            const user = await getCurrentUser()

            setUploading(true)

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/avatar.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(fileName, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(fileName)

            await supabase
                .from('profiles')
                .update({ profile_photo_url: publicUrl })
                .eq('id', user.id)

            setProfile({ ...profile, profile_photo_url: publicUrl })

            toast({
                title: 'Success',
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

    const toggleDarkMode = () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        localStorage.setItem('darkMode', newMode.toString())

        // Apply dark mode to document
        if (newMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        toast({
            title: newMode ? 'Dark mode enabled' : 'Light mode enabled',
            description: 'Your preference has been saved',
        })
    }

    const exportData = async () => {
        try {
            const user = await getCurrentUser()

            // Fetch all user data
            const { data: meals } = await supabase
                .from('meal_logs')
                .select('*, meal_items(*)')
                .eq('user_id', user.id)

            const { data: weights } = await supabase
                .from('weight_logs')
                .select('*')
                .eq('user_id', user.id)

            const exportData = {
                profile: profile,
                meals: meals,
                weights: weights,
                exportedAt: new Date().toISOString()
            }

            // Create download
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            })

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `calocal-data-${new Date().toISOString().split('T')[0]}.json`
            link.click()

            toast({
                title: 'Data exported',
                description: 'Your data has been downloaded',
            })

        } catch (error) {
            console.error('Error exporting data:', error)
            toast({
                title: 'Error',
                description: 'Could not export data',
                variant: 'destructive'
            })
        }
    }

    const handleLogout = async () => {
        await signOut()
        navigate('/login', { replace: true })
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-950 dark:text-white">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-4">
                <h1 className="text-2xl font-bold">Profile</h1>
            </header>

            {/* Profile Photo */}
            <div className="bg-white dark:bg-gray-900 p-6 mb-6 flex flex-col items-center shadow-sm">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        {profile?.profile_photo_url ? (
                            <img
                                src={profile.profile_photo_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center 
                            text-4xl font-bold text-gray-400 dark:text-gray-500">
                                {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>

                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#F5C518] 
                          rounded-full flex items-center justify-center 
                          cursor-pointer hover:bg-yellow-500 transition-colors shadow-sm">
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

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.full_name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.email}</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* Account Section */}
                <div className="bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Account</h3>
                    </div>

                    <button
                        onClick={() => navigate('/profile/info')}
                        className="w-full px-6 py-4 flex items-center justify-between 
                     border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">Personal Information</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    </button>

                    <button
                        onClick={() => navigate('/profile/goals')}
                        className="w-full px-6 py-4 flex items-center justify-between 
                     hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">My Goals</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    </button>
                </div>

                {/* Preferences Section */}
                <div className="bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Preferences</h3>
                    </div>

                    <button
                        onClick={() => navigate('/profile/notifications')}
                        className="w-full px-6 py-4 flex items-center justify-between 
                     border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">Notifications</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    </button>

                    {/* Language */}
                    <div className="px-6 py-4 border-b dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">Language</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {(['en', 'fr', 'ar'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`py-2 px-2 rounded-xl border-2 font-medium text-sm
                             transition-all ${language === lang
                                            ? 'border-[#F5C518] bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-yellow-100'
                                            : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {lang === 'en' && 'English'}
                                    {lang === 'fr' && 'Français'}
                                    {lang === 'ar' && 'العربية'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dark Mode */}
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {darkMode ? (
                                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                            <span className="font-medium">Dark Mode</span>
                        </div>

                        <label className="relative inline-block w-12 h-6 flex-shrink-0">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={toggleDarkMode}
                                className="sr-only peer"
                            />
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full 
                            peer-checked:bg-[#F5C518] transition-colors
                            cursor-pointer border border-transparent">
                                <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white 
                              rounded-full transition-transform shadow-sm
                              peer-checked:translate-x-6" />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Data & Privacy Section */}
                <div className="bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Data & Privacy</h3>
                    </div>

                    <button
                        onClick={exportData}
                        className="w-full px-6 py-4 flex items-center justify-between 
                     border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">Export My Data</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    </button>

                    <button
                        onClick={() => navigate('/privacy')}
                        className="w-full px-6 py-4 flex items-center justify-between 
                     hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">Privacy Policy</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    </button>
                </div>

                {/* Support Section */}
                <div className="bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Support</h3>
                    </div>

                    <button
                        onClick={() => navigate('/help')}
                        className="w-full px-6 py-4 flex items-center justify-between 
                     border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">Help Center</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    </button>

                    <button
                        onClick={() => navigate('/about')}
                        className="w-full px-6 py-4 flex items-center justify-between 
                     hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium">About Calo Cal</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    </button>
                </div>

                {/* Logout */}
                <div className="bg-white dark:bg-gray-900 shadow-sm">
                    <button
                        onClick={handleLogout}
                        className="w-full px-6 py-5 flex items-center gap-3 
                     text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-bold"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Version Info */}
            <div className="text-center py-10 text-sm text-gray-500 dark:text-gray-600">
                <p>Calo Cal v1.0.0</p>
                <p className="text-xs mt-1">Made with ❤️ in Tunisia</p>
            </div>
        </div>
    )
}
