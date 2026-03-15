import { useState } from "react";
import { Search, Calendar as CalendarIcon, Filter, X, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DiaryFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterMode: 'all' | 'high-calorie';
    setFilterMode: (mode: 'all' | 'high-calorie') => void;
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    calorieThreshold: number;
}

const DiaryFilters = ({
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    selectedDate,
    setSelectedDate,
    calorieThreshold
}: DiaryFiltersProps) => {
    const { t, language } = useLanguage();
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const hasActiveFilters = searchQuery !== "" || filterMode !== 'all' || selectedDate !== undefined;

    const clearFilters = () => {
        setSearchQuery("");
        setFilterMode('all');
        setSelectedDate(undefined);
    };

    return (
        <div className="px-5 py-3 space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* Search Toggle */}
                <Button
                    variant={isSearchVisible || searchQuery ? "default" : "secondary"}
                    size="sm"
                    className={cn(
                        "rounded-full h-9 gap-2 shrink-0 transition-all duration-300",
                        (isSearchVisible || searchQuery) && "bg-[#F5C518] text-foreground hover:bg-[#F5C518]/90"
                    )}
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                >
                    <Search className="h-4 w-4" />
                    {!isSearchVisible && searchQuery && <span className="max-w-[80px] truncate">{searchQuery}</span>}
                </Button>

                {/* Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={selectedDate ? "default" : "secondary"}
                            size="sm"
                            className={cn(
                                "rounded-full h-9 gap-2 shrink-0",
                                selectedDate && "bg-[#F5C518] text-foreground hover:bg-[#F5C518]/90"
                            )}
                        >
                            <CalendarIcon className="h-4 w-4" />
                            {selectedDate ? format(selectedDate, "MMM d") : t('diaryFilters.selectDate')}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* High Calorie Filter */}
                <Button
                    variant={filterMode === 'high-calorie' ? "default" : "secondary"}
                    size="sm"
                    className={cn(
                        "rounded-full h-9 gap-2 shrink-0",
                        filterMode === 'high-calorie' && "bg-orange-500 text-white hover:bg-orange-600 border-none"
                    )}
                    onClick={() => setFilterMode(filterMode === 'high-calorie' ? 'all' : 'high-calorie')}
                >
                    <Flame className={cn("h-4 w-4", filterMode === 'high-calorie' && "fill-current")} />
                    {t('diaryFilters.highCalorieThreshold', { kcal: calorieThreshold })}
                </Button>

                {/* Clear All */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="rounded-full h-9 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4 mr-1" />
                                {t('diaryFilters.clearFilters')}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Search Input Field */}
            <AnimatePresence>
                {isSearchVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="relative">
                            <Input
                                placeholder={t('diaryFilters.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="rounded-xl bg-secondary/50 border-white/10 pr-10 focus-visible:ring-[#F5C518]"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DiaryFilters;
