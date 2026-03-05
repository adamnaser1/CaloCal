import { supabase } from '@/lib/supabase'

export interface MealItemInput {
    custom_name: string
    quantity_g: number
    calories: number
    proteins: number
    carbs: number
    fats: number
    confidence_score?: number
}

export interface MealLogInput {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    photo_url?: string
    total_calories: number
    total_proteins: number
    total_carbs: number
    total_fats: number
    input_method: 'photo' | 'voice' | 'manual' | 'barcode'
    items: MealItemInput[]
}

export interface MealAnalysisResult {
    mealName: string
    totalCalories: number
    totalProteins: number
    totalCarbs: number
    totalFats: number
    items: {
        name: string
        quantity_g: number
        calories: number
        proteins: number
        carbs: number
        fats: number
        confidence: number
    }[]
}

export async function saveMealLog(input: MealLogInput) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Insert meal_log
    const { data: mealLog, error: mealError } = await supabase
        .from('meal_logs')
        .insert({
            user_id: user.id,
            meal_type: input.meal_type,
            photo_url: input.photo_url ?? null,
            total_calories: Math.round(input.total_calories || 0),
            total_proteins: Math.round(input.total_proteins || 0),
            total_carbs: Math.round(input.total_carbs || 0),
            total_fats: Math.round(input.total_fats || 0),
            input_method: input.input_method,
            logged_at: new Date().toISOString()
        })
        .select()
        .single()

    if (mealError) throw mealError

    // Insert all meal_items
    const items = input.items.map(item => ({
        meal_log_id: mealLog.id,
        custom_name: item.custom_name,
        quantity_g: Math.round(item.quantity_g || 0),
        calories: Math.round(item.calories || 0),
        proteins: Math.round(item.proteins || 0),
        carbs: Math.round(item.carbs || 0),
        fats: Math.round(item.fats || 0),
        confidence_score: item.confidence_score ?? null
    }))

    const { error: itemsError } = await supabase
        .from('meal_items')
        .insert(items)

    if (itemsError) throw itemsError

    return mealLog
}

export async function getTodayMealLogs() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
        .from('meal_logs')
        .select(`
      *,
      meal_items (*)
    `)
        .eq('user_id', user.id)
        .gte('logged_at', todayStart.toISOString())
        .lte('logged_at', todayEnd.toISOString())
        .order('logged_at', { ascending: true })

    if (error) throw error
    return data ?? []
}

export async function deleteMealLog(mealLogId: string) {
    const { error } = await supabase
        .from('meal_logs')
        .delete()
        .eq('id', mealLogId)

    if (error) throw error
}

export function getMealType(hour: number = new Date().getHours()): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
    if (hour >= 5 && hour < 11) return 'breakfast'
    if (hour >= 11 && hour < 16) return 'lunch'
    if (hour >= 16 && hour < 21) return 'dinner'
    return 'snack'
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function analyzePhotoWithAI(
    imageBase64: string
): Promise<MealAnalysisResult> {
    const API_URL = import.meta.env.VITE_API_URL ||
        'http://localhost:8000'

    try {
        // Convert base64 to blob
        const base64Data = imageBase64.includes(',')
            ? imageBase64.split(',')[1]
            : imageBase64

        // Use proper base64 to Blob conversion
        const byteCharacters = atob(base64Data)
        const byteArray = new Uint8Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i)
        }
        const blob = new Blob([byteArray], { type: 'image/jpeg' })

        // Create FormData
        const formData = new FormData()
        formData.append('image', blob, 'meal.jpg')

        // Call backend
        const apiResponse = await fetch(
            `${API_URL}/api/analyze-meal`,
            {
                method: 'POST',
                body: formData
            }
        )

        if (!apiResponse.ok) {
            throw new Error('Backend analysis failed')
        }

        const data = await apiResponse.json()

        if (!data.success) {
            throw new Error(
                data.error || 'Could not recognize dish'
            )
        }

        // Map to frontend format — use per-item values from backend
        return {
            mealName: data.meal_name,
            totalCalories: data.total_calories,
            totalProteins: data.total_proteins,
            totalCarbs: data.total_carbs,
            totalFats: data.total_fats,
            items: data.items.map((item: any) => ({
                name: item.name,
                quantity_g: Math.round(item.quantity_g || 0),
                calories: Math.round(item.calories || 0),
                proteins: Math.round(item.proteins || 0),
                carbs: Math.round(item.carbs || 0),
                fats: Math.round(item.fats || 0),
                confidence: item.confidence ?? data.confidence
            }))
        }
    } catch (error) {
        console.error('Analysis failed:', error)
        throw error
    }
}
