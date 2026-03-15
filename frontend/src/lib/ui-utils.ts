/**
 * Safely convert a string to lowercase.
 * Returns empty string if input is null or undefined.
 */
export const safeToLower = (str?: string | null): string => {
    if (!str) return '';
    return String(str).toLowerCase();
};

/**
 * Robust emoji picker for food items.
 */
export const getEmoji = (name?: string | null): string => {
    const lower = safeToLower(name);
    if (lower.includes("apple")) return "🍎";
    if (lower.includes("banana")) return "🍌";
    if (lower.includes("burger")) return "🍔";
    if (lower.includes("pizza")) return "🍕";
    if (lower.includes("salad")) return "🥗";
    if (lower.includes("coffee")) return "☕";
    if (lower.includes("egg")) return "🥚";
    if (lower.includes("chicken")) return "🍗";
    if (lower.includes("rice")) return "🍚";
    return "🍽️";
};

/**
 * Standardized meal type formatting with icons.
 */
export const getMealTypeDisplay = (type?: string | null) => {
    const lower = safeToLower(type);
    const types: Record<string, { icon: string, label: string }> = {
        breakfast: { icon: '🌅', label: 'Breakfast' },
        lunch: { icon: '☀️', label: 'Lunch' },
        dinner: { icon: '🌙', label: 'Dinner' },
        snack: { icon: '🍎', label: 'Snack' }
    };
    return types[lower] || types.snack;
};

/**
 * Standardized gradients for meal cards.
 */
export const getMealGradient = (type?: string | null): string => {
    const lower = safeToLower(type);
    if (lower === 'breakfast') return 'from-orange-400 to-orange-200';
    if (lower === 'lunch') return 'from-yellow-400 to-yellow-200';
    if (lower === 'dinner') return 'from-blue-400 to-blue-200';
    return 'from-green-400 to-green-200';
};
