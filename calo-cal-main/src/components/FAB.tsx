import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FABProps {
  onClick: () => void;
}

const FAB = ({ onClick }: FABProps) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
      className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5c518] text-black shadow-lg shadow-yellow-500/30 transition-colors hover:bg-yellow-400 active:scale-90"
    >
      <Plus size={28} strokeWidth={2.5} />
    </motion.button>
  );
};
export default FAB;
