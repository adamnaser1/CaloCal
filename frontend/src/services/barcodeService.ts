import { saveMealLog, getMealType } from './mealsService';

export interface ProductInfo {
    name: string;
    brand: string;
    imageUrl?: string;
    calories_per_100g: number;
    proteins_per_100g: number;
    carbs_per_100g: number;
    fats_per_100g: number;
    barcode: string;
}

export async function lookupBarcode(barcode: string): Promise<ProductInfo | null> {
    try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await res.json();

        if (data.status !== 1) return null;

        const p = data.product;
        const nutriments = p.nutriments || {};

        return {
            name: p.product_name || p.product_name_fr || 'Unknown product',
            brand: p.brands || '',
            imageUrl: p.image_url || p.image_front_url,
            calories_per_100g: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
            proteins_per_100g: nutriments.proteins_100g || 0,
            carbs_per_100g: nutriments.carbohydrates_100g || 0,
            fats_per_100g: nutriments.fat_100g || 0,
            barcode
        };
    } catch (error) {
        console.warn("Barcode lookup failed", error);
        return null;
    }
}

export async function addBarcodeProductToLog(product: ProductInfo, quantityG: number) {
    const ratio = quantityG / 100;

    return saveMealLog({
        meal_type: getMealType(),
        input_method: 'barcode',
        total_calories: Math.round(product.calories_per_100g * ratio),
        total_proteins: Math.round(product.proteins_per_100g * ratio),
        total_carbs: Math.round(product.carbs_per_100g * ratio),
        total_fats: Math.round(product.fats_per_100g * ratio),
        items: [{
            custom_name: `${product.name}${product.brand ? ' — ' + product.brand : ''}`,
            quantity_g: quantityG,
            calories: Math.round(product.calories_per_100g * ratio),
            proteins: Math.round(product.proteins_per_100g * ratio),
            carbs: Math.round(product.carbs_per_100g * ratio),
            fats: Math.round(product.fats_per_100g * ratio),
            confidence_score: 1.0
        }]
    });
}
