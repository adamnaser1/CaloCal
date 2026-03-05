import { supabase } from '@/lib/supabase'

export interface MealPlan {
    id: string
    title: string
    description: string
    duration_days: number
    avg_calories_per_day: number
    goal_type: 'lose' | 'gain' | 'maintain'
    difficulty: 'easy' | 'medium' | 'hard'
    category: string
    rating: number
    users_count: number
}

export interface MealPlanDay {
    id: string
    plan_id: string
    day_number: number
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    food_description: string
    estimated_calories: number
}

export async function getAllMealPlans(category?: string): Promise<MealPlan[]> {
    let query = supabase
        .from('meal_plans')
        .select('*')
        .order('users_count', { ascending: false })

    if (category && category !== 'all') {
        query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) {
        console.error('Error fetching meal plans:', error)
        return []
    }
    return data ?? []
}

export async function getMealPlanById(id: string): Promise<{ plan: MealPlan, days: MealPlanDay[] } | null> {
    const [planRes, daysRes] = await Promise.all([
        supabase
            .from('meal_plans')
            .select('*')
            .eq('id', id)
            .single(),
        supabase
            .from('meal_plan_days')
            .select('*')
            .eq('plan_id', id)
            .order('day_number', { ascending: true })
    ])

    if (planRes.error || !planRes.data) {
        return null
    }

    return {
        plan: planRes.data as MealPlan,
        days: (daysRes.data ?? []) as MealPlanDay[]
    }
}

export async function searchMealPlans(query: string): Promise<MealPlan[]> {
    const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('rating', { ascending: false })

    if (error) {
        console.error('Error searching meal plans:', error)
        return []
    }
    return data ?? []
}
