import { motion } from "framer-motion";

interface CalorieRingProps {
  consumed: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CalorieRing = ({
  consumed,
  goal,
  size = 180,
  strokeWidth = 15,
  color = "#F5C518"
}: CalorieRingProps) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / goal, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-foreground">
          {Math.round(consumed)}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          / {Math.round(goal)} kcal
        </span>
      </div>
    </div>
  );
};

export default CalorieRing;
