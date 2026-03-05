interface MealCardProps {
  name: string;
  time: string;
  calories: number;
  image?: string;
}

const MealCard = ({ name, time, calories, image }: MealCardProps) => (
  <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <span className="text-xl">🍽️</span>
      )}
    </div>
    <div className="flex flex-1 flex-col">
      <span className="text-sm font-semibold text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
    <span className="text-sm font-bold text-primary-foreground bg-primary px-3 py-1 rounded-xl">
      {calories} kcal
    </span>
  </div>
);

export default MealCard;
