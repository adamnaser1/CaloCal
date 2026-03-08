import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMealLog } from "@/context/MealLogContext";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/profileService";
import CalorieRing from "@/components/CalorieRing";
import MacroPill from "@/components/MacroPill";
import MealCard from "@/components/MealCard";
import FAB from "@/components/FAB";
import { User, RefreshCw } from "lucide-react";
import { SkeletonLoader as Skeleton } from "@/components/SkeletonLoader"; // Using alias to match prev code usage or just replace
import BottomNav from "@/components/BottomNav";
import HomeBanners from "@/components/HomeBanners";
import { motion, AnimatePresence } from "framer-motion";
import { formatCalories } from "@/lib/utils";

const HomeScreen = () => {
  const navigate = useNavigate();
  const {
    meals,
    totalCalories, // This comes from context, but context might check meals array. 
    // The prompt asked to memoize totalCalories calculation in HomeScreen if we were calculating it here. 
    // Since it's from useMealLog, let's assume useMealLog handles it or we calculate local totals if needed.
    // Checking useMealLog usage... it returns totalCalories directly.
    // But let's memoize macros/totals if we were doing custom math. 
    // Actually, let's just use what we have but apply formatting.
    totalProteins,
    totalCarbs,
    totalFats,
    loading: mealsLoading,
    refreshMeals
  } = useMealLog();
  const { user } = useAuth();

  const [dailyGoal, setDailyGoal] = useState(2000);
  const [firstName, setFirstName] = useState("");
  const [greeting, setGreeting] = useState("Good morning");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshMeals();
  }, []);

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch profile
    const fetchProfile = async () => {
      if (user) {
        const profile = await getUserProfile();
        if (profile) {
          if (profile.daily_calorie_goal) setDailyGoal(profile.daily_calorie_goal);
          if (profile.full_name) {
            setFirstName(profile.full_name.split(" ")[0]);
          }
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMeals();
    setTimeout(() => setRefreshing(false), 1000); // Ensure at least 1s spinner
  };

  // Determine ring color
  const isOverBudget = totalCalories > dailyGoal;
  const ringColor = isOverBudget ? "#F97316" : (totalCalories / dailyGoal >= 0.8 ? "#F5C518" : "#22C55E");

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
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">
            {greeting} {firstName && `, ${firstName}`} 👋
          </h1>
          <p className="text-sm text-muted-foreground">Let's hit your goals today</p>
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary overflow-hidden"
          >
            {user ? (
              <div className="h-full w-full flex items-center justify-center bg-[#F5C518] text-white font-bold text-xs">
                {firstName ? firstName.charAt(0) : "U"}
              </div>
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </header>

      {/* Banners */}
      <div className="px-5 pt-4 pb-2">
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
        <MacroPill emoji="🥩" label="Proteins" grams={Math.round(totalProteins)} />
        <MacroPill emoji="🌾" label="Carbs" grams={Math.round(totalCarbs)} />
        <MacroPill emoji="🥑" label="Fats" grams={Math.round(totalFats)} />
      </div>

      {/* Meal log */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-base font-display font-semibold text-foreground">Today's meals</h2>

        {mealsLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton variant="card" count={3} />
          </div>
        ) : meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white">
            <p className="font-display text-sm text-muted-foreground">🍽️ No meals today — tap + to start</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {meals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MealCard
                    name={meal.name}
                    time={meal.time}
                    calories={meal.calories}
                    image={meal.image}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Floating Action Button (only if logged in) */}
      {user && <FAB onClick={() => navigate("/capture")} />}
      <BottomNav />
    </motion.div>
  );
};

export default HomeScreen;
