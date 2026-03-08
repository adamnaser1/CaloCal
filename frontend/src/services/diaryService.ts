import { supabase } from '@/lib/supabase'

export interface MealItem {
    id: string
    meal_log_id: string
    custom_name: string
    quantity_g: number
    calories: number
    proteins: number
    carbs: number
    fats: number
    confidence_score: number
}

export interface MealLog {
    id: string
    user_id: string
    meal_type: string
    photo_url: string | null
    total_calories: number
    total_proteins: number
    total_carbs: number
    total_fats: number
    logged_at: string
    input_method: string
    meal_items: MealItem[]
}

export async function getMealLogsForDate(date: Date) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
        .from('meal_logs')
        .select(`*, meal_items(*)`)
        .eq('user_id', user.id)
        .gte('logged_at', start.toISOString())
        .lte('logged_at', end.toISOString())
        .order('logged_at', { ascending: true })

    if (error) throw error
    return (data as MealLog[]) ?? []
}

export async function getMealLogById(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('meal_logs')
        .select(`*, meal_items(*)`)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error) throw error
    return data as MealLog
}

export async function updateMealItemQuantity(
    itemId: string,
    newQuantityG: number,
    originalQuantityG: number,
    originalCalories: number,
    originalProteins: number,
    originalCarbs: number,
    originalFats: number
) {
    // Prevent division by zero
    if (originalQuantityG === 0) return;

    const ratio = newQuantityG / originalQuantityG
    const newCalories = Math.round(originalCalories * ratio)
    const newProteins = Math.round(originalProteins * ratio)
    const newCarbs = Math.round(originalCarbs * ratio)
    const newFats = Math.round(originalFats * ratio)

    const { error } = await supabase
        .from('meal_items')
        .update({
            quantity_g: newQuantityG,
            calories: newCalories,
            proteins: newProteins,
            carbs: newCarbs,
            fats: newFats
        })
        .eq('id', itemId)

    if (error) throw error

    // Recalculate and update meal_log totals
    await recalculateMealLogTotals(itemId)
}

export async function deleteMealItem(itemId: string) {
    // Get the item first to know the parent meal_log_id
    const { data: item, error: fetchError } = await supabase
        .from('meal_items')
        .select('meal_log_id')
        .eq('id', itemId)
        .single();

    if (fetchError) throw fetchError;

    const mealLogId = item.meal_log_id;

    const { error: deleteError } = await supabase
        .from('meal_items')
        .delete()
        .eq('id', itemId)

    if (deleteError) throw deleteError

    // Recalculate totals or delete meal if empty
    await recalculateMealLogTotalsByLogId(mealLogId);
}

export async function deleteMealLog(id: string) {
    const { error } = await supabase
        .from('meal_logs')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Private helpers

async function recalculateMealLogTotals(itemId: string) {
    // We need the meal_log_id, simpler to just fetch the item again or assume we passed it?
    // But wait, if we updated the item, we can fetch it to get the log id.
    const { data: item, error: fetchError } = await supabase
        .from('meal_items')
        .select('meal_log_id')
        .eq('id', itemId)
        .single()

    if (fetchError) return; // Should handle error better?

    await recalculateMealLogTotalsByLogId(item.meal_log_id);
}

async function recalculateMealLogTotalsByLogId(mealLogId: string) {
    // Fetch all items for this log
    const { data: items, error: itemsError } = await supabase
        .from('meal_items')
        .select('calories, proteins, carbs, fats')
        .eq('meal_log_id', mealLogId)

    if (itemsError) throw itemsError;

    if (!items || items.length === 0) {
        // If no items left, delete the log
        await deleteMealLog(mealLogId);
        return;
    }

    const totals = items.reduce((acc, curr) => ({
        calories: acc.calories + curr.calories,
        proteins: acc.proteins + curr.proteins,
        carbs: acc.carbs + curr.carbs,
        fats: acc.fats + curr.fats
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

    const { error: updateError } = await supabase
        .from('meal_logs')
        .update({
            total_calories: totals.calories,
            total_proteins: totals.proteins,
            total_carbs: totals.carbs,
            total_fats: totals.fats
        })
        .eq('id', mealLogId)

    if (updateError) throw updateError;
}
