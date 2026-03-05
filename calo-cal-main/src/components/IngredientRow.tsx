interface IngredientRowProps {
  emoji: string;
  name: string;
  grams: number;
  calories: number;
  confidence: number;
}

const IngredientRow = ({ emoji, name, grams, calories, confidence }: IngredientRowProps) => {
  const badgeColor =
    confidence >= 85
      ? "bg-success/15 text-success"
      : "bg-primary/20 text-primary-foreground";

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
      <span className="text-2xl">{emoji}</span>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{grams}g · {calories} kcal</span>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${badgeColor}`}>
        {confidence}%
      </span>
    </div>
  );
};

export default IngredientRow;
