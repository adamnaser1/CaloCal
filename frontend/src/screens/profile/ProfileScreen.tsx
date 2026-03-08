import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Settings, Bell, Moon, Database, LogOut, Info, Scale, Flame, Target } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { motion } from "framer-motion";
import { getUserProfile, Profile } from "@/services/profileService";
import { getStreak } from "@/services/progressService";
import { useToast } from "@/hooks/use-toast";

const ProfileScreen = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [userProfile, streakCount] = await Promise.all([
                    getUserProfile(),
                    getStreak()
                ]);
                setProfile(userProfile);
                setStreak(streakCount);

                // Check local dark mode preference if persisted (optional check)
                if (document.documentElement.classList.contains('dark')) {
                    setDarkMode(true);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleLogout = async () => {
        if (window.confirm("Log out of Calo Cal?\nYou'll need to sign in again.")) {
            try {
                await signOut();
                navigate('/login');
            } catch (error) {
                console.error("Logout failed", error);
                toast({ variant: "destructive", title: "Logout failed", description: "Please try again." });
            }
        }
    };

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const SettingsItem = ({ icon: Icon, label, path, isToggle, value, onClick }: any) => (
        <div
            onClick={path ? () => navigate(path) : onClick}
            className="flex cursor-pointer items-center justify-between py-4 active:opacity-70"
        >
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                    <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{label}</span>
            </div>
            {isToggle ? (
                <div className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#F5C518]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : ''}`} />
                </div>
            ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                    {value && <span className="text-sm">{value}</span>}
                    <ChevronRight className="h-5 w-5" />
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-28">
            <header className="px-5 pt-8 pb-6">
                <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
            </header>

            <div className="px-5 pb-8">
                {/* User Card */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5C518] text-2xl font-bold text-black border-2 border-white shadow-sm overflow-hidden">
                        {loading ? <SkeletonLoader variant="circle" className="h-full w-full" /> : getInitials(profile?.full_name)}
                    </div>
                    <div>
                        {loading ? (
                            <div className="space-y-2">
                                <SkeletonLoader variant="text" className="h-6 w-32" />
                                <SkeletonLoader variant="text" className="h-4 w-48" />
                            </div>
                        ) : (
                            <>
                                <h2 className="font-display text-xl font-bold text-foreground">
                                    {profile?.full_name || 'User'}
                                </h2>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-3 gap-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-4 text-center"
                    >
                        <Scale className="mb-2 h-5 w-5 text-blue-500" />
                        <span className="text-xs text-muted-foreground">Weight</span>
                        <span className="font-display font-bold text-foreground">{profile?.current_weight_kg || '—'} kg</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-4 text-center"
                    >
                        <Target className="mb-2 h-5 w-5 text-green-500" />
                        <span className="text-xs text-muted-foreground">Goal</span>
                        <span className="font-display font-bold text-foreground">{profile?.target_weight_kg || '—'} kg</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-4 text-center"
                    >
                        <Flame className="mb-2 h-5 w-5 text-orange-500" />
                        <span className="text-xs text-muted-foreground">Streak</span>
                        <span className="font-display font-bold text-foreground">{streak} days</span>
                    </motion.div>
                </div>

                {/* Settings Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="mb-4 font-display text-lg font-bold text-foreground">Settings</h3>
                    <div className="divide-y divide-gray-100 rounded-2xl bg-card px-4 shadow-sm">
                        <SettingsItem icon={Settings} label="Personal information" path="/profile/info" />
                        <SettingsItem icon={Target} label="My goals" path="/profile/goals" />
                        <SettingsItem icon={Bell} label="Notifications" path="/profile/notifications" />
                        <SettingsItem
                            icon={Moon}
                            label="Dark mode"
                            isToggle
                            value={darkMode}
                            onClick={toggleDarkMode}
                        />
                        <SettingsItem icon={Database} label="Export my data" path="/profile/export" />
                        <SettingsItem icon={Info} label="Help & FAQ" path="/profile/help" />
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={handleLogout}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-4 text-red-600 font-bold hover:bg-red-100 active:scale-[0.98]"
                >
                    <LogOut className="h-5 w-5" />
                    Log out
                </motion.button>
            </div>

            <BottomNav />
        </div>
    );
};

export default ProfileScreen;
