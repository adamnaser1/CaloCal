import { useLanguage } from '@/contexts/LanguageContext'

export function useEncouragement() {
    const { t } = useLanguage()

    const getStreakMessage = (days: number) => {
        if (days === 1) {
            return t('encouragement.streakStart')
        }
        return t('encouragement.streakContinue', { days })
    }

    const getGoalProgressMessage = (percent: number) => {
        return t('encouragement.goalProgress', { percent: Math.round(percent) })
    }

    const getMealMessage = (meal: any, dailyStats: any) => {
        const messages = []

        // First meal of the day
        if (dailyStats.mealCount === 1) {
            messages.push(t('encouragement.firstMeal'))
        }

        // Balanced meal (macros within 5% of target ratios)
        const proteinRatio = (meal.total_proteins * 4) / meal.total_calories
        const carbRatio = (meal.total_carbs * 4) / meal.total_calories
        const fatRatio = (meal.total_fats * 9) / meal.total_calories

        if (
            proteinRatio >= 0.25 && proteinRatio <= 0.35 &&
            carbRatio >= 0.40 && carbRatio <= 0.50 &&
            fatRatio >= 0.20 && fatRatio <= 0.30
        ) {
            messages.push(t('encouragement.balancedMeal'))
        }

        // Low calorie
        if (meal.total_calories < 300) {
            messages.push(t('encouragement.lowCalorie'))
        }

        // Protein goal reached
        if (dailyStats.totalProteins >= dailyStats.proteinGoal) {
            messages.push(t('encouragement.proteinGoal'))
        }

        return messages
    }

    const getRandomTip = () => {
        const tips = [
            t('encouragement.waterReminder'),
            t('encouragement.perfectDay'),
        ]
        return tips[Math.floor(Math.random() * tips.length)]
    }

    return {
        getStreakMessage,
        getGoalProgressMessage,
        getMealMessage,
        getRandomTip,
    }
}
