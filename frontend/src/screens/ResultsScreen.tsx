import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMealLog, Ingredient } from "@/context/MealLogContext";
import IngredientRow from "@/components/IngredientRow";
import { motion } from "framer-motion";
import { type MealLogInput, type MealItemInput, type MealAnalysisResult } from "@/services/mealsService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, Check, Edit2, Plus, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

// Mock remains as fallback if needed, but we try to use state result
const mockResultDefault = {
  name: "Couscous au poulet",
  calories: 485,
  proteins: 32,
  carbs: 58,
  fats: 14,
  ingredients: [
    { emoji: "🌾", name: "Couscous", grams: 150, calories: 170, confidence: 95 },
    { emoji: "🍗", name: "Poulet grillé", grams: 120, calories: 198, confidence: 91 },
    { emoji: "🥕", name: "Carottes", grams: 80, calories: 33, confidence: 88 },
    { emoji: "🫒", name: "Huile d'olive", grams: 10, calories: 84, confidence: 79 },
  ],
};

const ResultsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addMeal } = useMealLog();

  const state = location.state as {
    image?: string;
    analysisResult?: MealAnalysisResult;
    inputMethod?: 'photo' | 'voice';
    transcript?: string;
  };

  const image = state?.image;
  // Use passed result or default mock
  const [result, setResult] = useState<any>(state?.analysisResult || mockResultDefault);
  const [isSaving, setIsSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(!state?.analysisResult);
  const [selectedMealType, setSelectedMealType] = useState<'snack' | 'breakfast' | 'lunch' | 'dinner'>('snack');

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  useEffect(() => {
    // If we have a direct result passed (e.g. from Voice), use it
    if (state?.analysisResult) {
      setResult(state.analysisResult);
      setAnalyzing(false);
      return;
    }

    // Otherwise, simulate analysis for photo
    const analyze = async () => {
      const timer = setTimeout(() => {
        setAnalyzing(false);
        // We could switch this mock based on image later
        setResult(mockResultDefault);
      }, 3000);
      return () => clearTimeout(timer);
    };

    analyze();
  }, [state]);

  const getMealType = (hour: number): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 21) return 'dinner';
    return 'snack';
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map result items to MealItemInput
      // Support both structure from Voice Analysis and Mock
      const ingredients = result.items || result.ingredients || [];

      const mealItems: MealItemInput[] = ingredients.map((ing: any) => ({
        custom_name: ing.name,
        quantity_g: ing.quantity_g || ing.grams,
        calories: ing.calories,
        proteins: ing.proteins || 0,
        carbs: ing.carbs || 0,
        fats: ing.fats || 0,
        confidence_score: ing.confidence || ing.confidence_score
      }));

      const input: MealLogInput = {
        meal_name: result.mealName || result.name || "Meal",
        meal_type: selectedMealType,
        photo_url: image,
        total_calories: result.totalCalories || result.calories,
        total_proteins: result.totalProteins || result.proteins,
        total_carbs: result.totalCarbs || result.carbs,
        total_fats: result.totalFats || result.fats,
        input_method: state?.inputMethod || 'photo',
        items: mealItems
      };

      await addMeal(input);
      toast({
        title: "Meal saved! 🎉",
        variant: "success", // Assuming we adding this or it relies on styling
        duration: 3000,
      });
      navigate("/", { replace: true });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Safe accessors
  const calories = result.totalCalories || result.calories || 0;
  const proteins = result.totalProteins || result.proteins || 0;
  const carbs = result.totalCarbs || result.carbs || 0;
  const fats = result.totalFats || result.fats || 0;
  const mealName = result.mealName || result.name || "Meal";
  const items = result.items || result.ingredients || [];

  const macros = [
    { label: "Proteins", grams: Math.round(proteins), color: "bg-blue-500" },
    { label: "Carbs", grams: Math.round(carbs), color: "bg-primary" },
    { label: "Fats", grams: Math.round(fats), color: "bg-success" },
  ];
  const maxGrams = Math.max(...macros.map((m) => m.grams), 1);

  if (analyzing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse font-medium">Analyzing your meal...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header with photo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        {image ? (
          <img src={image} alt="Meal" className="h-14 w-14 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-2xl">
            🍽️
          </div>
        )}
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">{mealName}</h1>
          <p className="text-xs text-muted-foreground">Today at {timeStr}</p>
        </div>
      </div>

      {/* Hero calorie card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mx-5 rounded-3xl bg-primary p-6 text-center shadow-fab"
      >
        <span className="text-4xl font-display font-bold text-primary-foreground">
          {calories} kcal
        </span>
        <p className="mt-1 text-sm text-primary-foreground/70">Estimated for this meal</p>
      </motion.div>

      {/* Macros */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-sm font-display font-semibold text-foreground">Macros breakdown</h2>
        <div className="space-y-3">
          {macros.map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="w-16 text-xs text-muted-foreground">{m.label}</span>
              <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.grams / maxGrams) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${m.color}`}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-foreground">{m.grams}g</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-sm font-display font-semibold text-foreground">Detected ingredients</h2>
        <div className="flex flex-col gap-2">
          {items.map((ing: any, idx: number) => (
            // Adapting to IngredientRow props if they differ
            <IngredientRow
              key={idx}
              name={ing.name}
              emoji={ing.emoji || "🍽️"}
              grams={ing.quantity_g || ing.grams}
              calories={ing.calories}
              confidence={Math.round(((ing.confidence || ing.confidence_score || 0.9) > 1 ? (ing.confidence || ing.confidence_score) : (ing.confidence || ing.confidence_score || 0.9) * 100))}
            />
          ))}
        </div>
      </section>

      {/* Correction link */}
      <p className="mt-4 px-5 text-xs text-muted-foreground">
        Something wrong?{" "}
        <span
          onClick={() => navigate("/manual-entry", { state: { fromResults: true, result } })}
          className="underline cursor-pointer"
        >
          Correct manually →
        </span>
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 px-5">
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Meal Type</p>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { id: 'breakfast', icon: '🌅', label: 'Breakfast' },
                { id: 'lunch', icon: '☀️', label: 'Lunch' },
                { id: 'dinner', icon: '🌙', label: 'Dinner' },
                { id: 'snack', icon: '🍎', label: 'Snack' }
              ] as const
            ).map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedMealType(type.id)}
                className={`p-3 rounded-xl border-2 transition-all ${selectedMealType === type.id
                  ? 'border-[#F5C518] bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-xs font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-display font-bold text-primary-foreground shadow-fab disabled:opacity-70"
        >
          {isSaving && <Loader2 className="h-5 w-5 animate-spin" />}
          {isSaving ? "Saving..." : "Save to my diary"}
        </button>
        <button
          onClick={() => navigate("/capture", { replace: true })}
          disabled={isSaving}
          className="w-full rounded-2xl border border-border py-3 text-sm font-medium text-foreground disabled:opacity-70"
        >
          Retake
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
