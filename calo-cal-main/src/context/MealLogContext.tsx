import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  saveMealLog,
  getTodayMealLogs,
  deleteMealLog,
  MealLogInput,
  MealItemInput
} from "@/services/mealsService";
import { useAuth } from "@/context/AuthContext";

export interface Ingredient extends MealItemInput {
  name: string; // mapping custom_name to name for UI compatibility
  grams: number; // mapping quantity_g to grams
  emoji: string; // will be hardcoded or stored if we update schema, for now fallback
}

export interface Meal {
  id: string;
  name: string; // meal_type or generated name
  time: string; // derived from logged_at
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  image?: string;
  ingredients?: Ingredient[];
  meal_type?: string;
}

interface MealLogContextType {
  meals: Meal[];
  dailyGoal: number;
  addMeal: (mealInput: MealLogInput) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  totalCalories: number;
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
  refreshMeals: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

export const MealLogProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dailyGoal = 2000;

  const refreshMeals = async () => {
    // alias for loadTodayMeals to be exposed
    await loadTodayMeals();
  };

  const loadTodayMeals = async () => {
    if (!user) {
      setMeals([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getTodayMealLogs();
      const mappedMeals: Meal[] = data.map((log: any) => ({
        id: log.id,
        name: log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1), // Simple name from type
        time: new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calories: log.total_calories,
        proteins: log.total_proteins,
        carbs: log.total_carbs,
        fats: log.total_fats,
        image: log.photo_url,
        meal_type: log.meal_type,
        ingredients: log.meal_items?.map((item: any) => ({
          name: item.custom_name,
          emoji: "🍽️", // Fallback emoji
          grams: item.quantity_g,
          calories: item.calories,
          proteins: item.proteins,
          carbs: item.carbs,
          fats: item.fats,
          confidence: item.confidence_score
        }))
      }));
      setMeals(mappedMeals);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTodayMeals();
    } else {
      setMeals([]);
    }
  }, [user]);

  const addMeal = async (mealInput: MealLogInput) => {
    setLoading(true);
    setError(null);
    try {
      await saveMealLog(mealInput);
      await loadTodayMeals();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMeal = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMealLog(id);
      await loadTodayMeals();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProteins = meals.reduce((s, m) => s + m.proteins, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFats = meals.reduce((s, m) => s + m.fats, 0);

  return (
    <MealLogContext.Provider
      value={{
        meals,
        dailyGoal,
        addMeal,
        removeMeal,
        refreshMeals,
        totalCalories,
        totalProteins,
        totalCarbs,
        totalFats,
        loading,
        error
      }}
    >
      {children}
    </MealLogContext.Provider>
  );
};

export const useMealLog = () => {
  const ctx = useContext(MealLogContext);
  if (!ctx) throw new Error("useMealLog must be used within MealLogProvider");
  return ctx;
};
