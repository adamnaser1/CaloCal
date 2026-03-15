import { useNavigate, useLocation } from "react-router-dom";
import { Home, Camera, ClipboardList, BarChart2, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const { t } = useLanguage();

    // Define tabs
    const tabs = [
        { id: "home", label: t('nav.home'), icon: Home, path: "/" },
        { id: "diary", label: t('nav.diary'), icon: ClipboardList, path: "/diary" },
        { id: "capture", label: "", icon: Camera, path: "/capture", isSpecial: true },
        { id: "progress", label: t('nav.progress'), icon: BarChart2, path: "/progress" },
        { id: "profile", label: t('nav.profile'), icon: User, path: "/profile" },
    ];

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-end justify-around bg-white pb-4 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] px-2">
            {tabs.map((tab) => {
                const active = isActive(tab.path);

                if (tab.isSpecial) {
                    return (
                        <div key={tab.id} className="relative -top-6">
                            <button
                                onClick={() => navigate(tab.path)}
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518] text-[#1A1A1A] shadow-[0_4px_16px_rgba(245,197,24,0.5)] transition-transform active:scale-95"
                            >
                                <tab.icon size={28} strokeWidth={2.5} />
                            </button>
                        </div>
                    );
                }

                return (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className="flex flex-1 flex-col items-center justify-center gap-1"
                    >
                        <tab.icon
                            size={24}
                            className={active ? "text-[#F5C518]" : "text-gray-400"}
                            strokeWidth={active ? 2.5 : 2}
                        />
                        <span
                            className={`text-[10px] font-bold ${active ? "text-[#F5C518]" : "text-gray-400"
                                }`}
                        >
                            {tab.label}
                        </span>
                        {/* Active Indicator Dot */}
                        {active && (
                            <div className="absolute bottom-2 h-1 w-1 rounded-full bg-[#F5C518]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
