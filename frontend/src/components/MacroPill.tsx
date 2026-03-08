interface MacroPillProps {
  emoji: string;
  label: string;
  grams: number;
}

const MacroPill = ({ emoji, label, grams }: MacroPillProps) => (
  <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-card">
    <span className="text-lg">{emoji}</span>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{grams}g</span>
    </div>
  </div>
);

export default MacroPill;
