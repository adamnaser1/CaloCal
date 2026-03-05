import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Bell } from "lucide-react";
import { getNotificationSettings, saveNotificationSettings, NotificationSettings } from "@/services/notificationsService";
import { useToast } from "@/hooks/use-toast";

const NotificationsScreen = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Initial state with matching keys to our service
    const [settings, setSettings] = useState<NotificationSettings>({
        breakfastReminder: { enabled: true, time: '07:30' },
        lunchReminder: { enabled: true, time: '12:30' },
        dinnerReminder: { enabled: false, time: '19:30' },
        weeklyReports: true,
        nutritionTips: false,
        hydrationReminders: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await getNotificationSettings();
                setSettings(data);
            } catch (error) {
                console.error(error);
                toast({ variant: "destructive", title: "Error", description: "Failed to load settings." });
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [toast]);

    const handleToggle = (key: keyof NotificationSettings) => {
        // Toggle boolean values directly
        if (typeof settings[key] === 'boolean') {
            const newSettings = { ...settings, [key]: !settings[key] };
            setSettings(newSettings);
            debouncedSave(newSettings);
        } else {
            // For objects like reminders, toggle 'enabled' property
            // Type assertion needed as TS doesn't infer well
            const currentVal = settings[key] as { enabled: boolean, time: string };
            const newSettings = {
                ...settings,
                [key]: { ...currentVal, enabled: !currentVal.enabled }
            };
            setSettings(newSettings);
            debouncedSave(newSettings);
        }
    };

    const handleTimeChange = (key: keyof NotificationSettings, newTime: string) => {
        const currentVal = settings[key] as { enabled: boolean, time: string };
        const newSettings = {
            ...settings,
            [key]: { ...currentVal, time: newTime }
        };
        setSettings(newSettings);
        debouncedSave(newSettings);
    };

    // Simple debounce implementation
    const debouncedSave = (newSettings: NotificationSettings) => {
        // Clear any existing timer if we stored it in valid ref, 
        // but for simple React functional component standard debouncing relies on useEffect or libraries.
        // Here we'll just fire-and-forget but in real app use lodash.debounce or useDebounce hook.
        // For MVP, calling save immediately is acceptable or simple timeout.

        // Let's rely on optimistic UI updates + async save in background
        saveNotificationSettings(newSettings)
            .then(() => {
                toast({
                    title: "Settings saved",
                    duration: 2000,
                });
            })
            .catch(err => {
                console.error("Save failed", err);
                toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: "Could not update settings.",
                    duration: 5000
                });
            });
    };

    const ReminderItem = ({ label, settingKey }: { label: string, settingKey: keyof NotificationSettings }) => {
        const item = settings[settingKey] as { enabled: boolean, time: string };
        return (
            <div className="flex items-center justify-between py-4">
                <div>
                    <div className="font-medium text-foreground">{label}</div>
                    {item.enabled && (
                        <input
                            type="time"
                            className="mt-1 bg-transparent text-2xl font-bold text-primary outline-none"
                            value={item.time}
                            onChange={(e) => handleTimeChange(settingKey, e.target.value)}
                        />
                    )}
                </div>
                <button
                    onClick={() => handleToggle(settingKey)}
                    className={`relative h-8 w-14 rounded-full transition-colors ${item.enabled ? 'bg-[#F5C518]' : 'bg-gray-200'}`}
                >
                    <div className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-6' : ''}`} />
                </button>
            </div>
        );
    };

    const ToggleItem = ({ label, settingKey }: { label: string, settingKey: keyof NotificationSettings }) => {
        const isEnabled = settings[settingKey] as boolean;
        return (
            <div className="flex items-center justify-between py-4">
                <span className="font-medium text-foreground">{label}</span>
                <button
                    onClick={() => handleToggle(settingKey)}
                    className={`relative h-8 w-14 rounded-full transition-colors ${isEnabled ? 'bg-[#F5C518]' : 'bg-gray-200'}`}
                >
                    <div className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : ''}`} />
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-10">
            <header className="sticky top-0 z-10 flex items-center gap-4 bg-background/80 px-5 py-4 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <h1 className="font-display text-lg font-bold text-foreground">Notifications</h1>
            </header>

            <div className="px-5 pt-4">
                <div className="rounded-2xl bg-card px-4 shadow-sm divide-y divide-gray-100">
                    <h2 className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Reminders</h2>
                    <ReminderItem label="Breakfast" settingKey="breakfastReminder" />
                    <ReminderItem label="Lunch" settingKey="lunchReminder" />
                    <ReminderItem label="Dinner" settingKey="dinnerReminder" />
                </div>

                <div className="mt-6 rounded-2xl bg-card px-4 shadow-sm divide-y divide-gray-100">
                    <h2 className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">General</h2>
                    <ToggleItem label="Weekly reports" settingKey="weeklyReports" />
                    <ToggleItem label="Nutrition tips" settingKey="nutritionTips" />
                    <ToggleItem label="Hydration reminders" settingKey="hydrationReminders" />
                </div>
            </div>
        </div>
    );
};

export default NotificationsScreen;
