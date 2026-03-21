import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMealLog } from "@/context/MealLogContext";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/profileService";
import CalorieRing from "@/components/CalorieRing";
import MacroPill from "@/components/MacroPill";
import MealCard from "@/components/MealCard";
import { User, RefreshCw, MessageCircle } from "lucide-react";
import { SkeletonLoader as Skeleton } from "@/components/SkeletonLoader"; // Using alias to match prev code usage or just replace
import BottomNav from "@/components/BottomNav";
import HomeBanners from "@/components/HomeBanners";
import { motion, AnimatePresence } from "framer-motion";
import { formatCalories } from "@/lib/utils";
import { useEncouragement } from "@/utils/encouragement";
import { getStreak } from "@/services/progressService";
import { useLanguage } from "@/contexts/LanguageContext";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    meals,
    totalCalories,
    totalProteins,
    totalCarbs,
    totalFats,
    loading: mealsLoading,
    refreshMeals
  } = useMealLog();
  const { user, profile } = useAuth();

  const [dailyGoal, setDailyGoal] = useState(2000);
  const [firstName, setFirstName] = useState("");
  const [greeting, setGreeting] = useState("Good morning");
  const [refreshing, setRefreshing] = useState(false);

  const { getStreakMessage } = useEncouragement();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    refreshMeals();
  }, []);

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting(t('greeting.morning'));
    else if (hour >= 12 && hour < 18) setGreeting(t('greeting.afternoon'));
    else setGreeting(t('greeting.evening'));

    if (profile) {
      if (profile.daily_calorie_goal) setDailyGoal(profile.daily_calorie_goal);
      if (profile.full_name) {
        setFirstName(profile.full_name.split(" ")[0]);
      }
    }

    const fetchStreak = async () => {
      try {
        if (user) {
          const count = await getStreak();
          setStreak(count);
        }
      } catch (err) { }
    };
    fetchStreak();
  }, [user, profile, t]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMeals();
    setTimeout(() => setRefreshing(false), 1000); // Ensure at least 1s spinner
  };

  // Determine ring color
  const isOverBudget = totalCalories > dailyGoal;
  const ringColor = isOverBudget ? "#F97316" : (totalCalories / dailyGoal >= 0.8 ? "#F5C518" : "#22C55E");

  const getMealTypeDisplay = (mealType: string) => {
    const types: Record<string, { icon: string, label: string }> = {
      breakfast: { icon: '🌅', label: 'Breakfast' },
      lunch: { icon: '☀️', label: 'Lunch' },
      dinner: { icon: '🌙', label: 'Dinner' },
      snack: { icon: '🍎', label: 'Snack' }
    }
    return types[mealType] || types.snack
  }

  return (
    <motion.div
      className="relative min-h-screen bg-background pb-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Unauthenticated Banner */}
      {!user && (
        <div className="bg-yellow-100 px-4 py-2 text-center text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
          ⚠️ <span className="font-medium">Sign in</span> to save your meals across sessions.{" "}
          <Link to="/login" className="underline hover:text-yellow-900">
            Sign in
          </Link>
        </div>
      )}

      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className="text-xl font-display font-bold text-foreground">
            {greeting}{firstName && (language === 'ar' ? `، ${firstName}` : `, ${firstName}`)} 👋
          </h1>
          <p className="text-sm text-muted-foreground">{t('todaysMeals')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary overflow-hidden shadow-sm"
          >
            {profile?.profile_photo_url ? (
              <img
                src={profile.profile_photo_url}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : user ? (
              <div className="h-full w-full flex items-center justify-center bg-[#F5C518] text-white font-bold text-xs ring-2 ring-white/20">
                {firstName ? firstName.charAt(0) : "U"}
              </div>
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </header>

      {/* Banners */}
      <div className="px-5 pt-4 pb-2 flex flex-col gap-3">
        {user && streak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 
                        rounded-2xl text-white shadow-lg relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="text-5xl">🔥</span>
            </div>
            <h3 className="text-xs uppercase font-black opacity-80 mb-1 tracking-widest">{t('encouragingMessage')}</h3>
            <p className="font-bold text-lg font-display leading-tight">
              {getStreakMessage(streak)}
            </p>
          </motion.div>
        )}
        <HomeBanners />
      </div>

      {/* Calorie ring */}
      <div className="flex justify-center py-4">
        <CalorieRing
          consumed={totalCalories}
          goal={dailyGoal}
          color={ringColor}
        />
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2 px-5">
        <MacroPill emoji="🥩" label={t('macros.proteins')} grams={Math.round(totalProteins)} />
        <MacroPill emoji="🌾" label={t('macros.carbs')} grams={Math.round(totalCarbs)} />
        <MacroPill emoji="🥑" label={t('macros.fats')} grams={Math.round(totalFats)} />
      </div>

      {/* Meal log */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-base font-display font-bold text-foreground">{t('todaysMeals')}</h2>

        {mealsLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton variant="card" count={3} />
          </div>
        ) : meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center rounded-3xl border border-dashed border-white/10 bg-secondary/30">
            <div className="text-3xl mb-2">🍽️</div>
            <p className="font-bold text-sm text-muted-foreground p-4">
              {t('noMealsToday')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {meals.map((meal, index) => {
                const mealTypeDisplay = getMealTypeDisplay(meal.meal_type || 'snack')

                return (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/diary/meal/${meal.id}`)}
                    className="flex items-center gap-4 p-3 bg-card border border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={meal.image || '/placeholder-food.png'}
                        alt={meal.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow-sm">
                        {mealTypeDisplay.icon}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{meal.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                        {t(`mealType.${meal.meal_type}`) || mealTypeDisplay.label} • {meal.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-foreground">
                        {meal.calories}
                      </p>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">kcal</span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Floating Action Button (only if logged in) */}
      {user && (
        <button
          onClick={() => navigate('/chatbot')}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full
                   bg-[#F5C518] text-white shadow-lg
                   flex items-center justify-center
                   hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      <BottomNav />
    </motion.div>
  );
};

export default HomeScreen;
