// @ts-nocheck
// deno-lint-ignore-file no-explicit-any


const HF_TOKEN = Deno.env.get('HF_TOKEN');
const EDAMAM_APP_ID = Deno.env.get('EDAMAM_APP_ID');
const EDAMAM_APP_KEY = Deno.env.get('EDAMAM_APP_KEY');
const HF_API = 'https://router.huggingface.co/models';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};


// Tunisian dish nutritional database (fallback)
const TUNISIAN_NUTRITION: Record<string, { cal: number; prot: number; carbs: number; fats: number }> = {
    couscous: { cal: 139, prot: 5.8, carbs: 23.2, fats: 2.1 },
    brik: { cal: 280, prot: 8.4, carbs: 22, fats: 16 },
    lablabi: { cal: 160, prot: 9, carbs: 22.5, fats: 4.2 },
    ojja: { cal: 240, prot: 14, carbs: 8, fats: 16.5 },
    fricassé: { cal: 220, prot: 6.2, carbs: 28, fats: 9 },
    chorba: { cal: 93, prot: 3.5, carbs: 14, fats: 2.8 },
    mechouia: { cal: 65, prot: 2.1, carbs: 10.2, fats: 2.5 },
    makroudh: { cal: 380, prot: 4.2, carbs: 58, fats: 15 },
    kafteji: { cal: 165, prot: 7, carbs: 12, fats: 9.5 },
    mloukhiya: { cal: 125, prot: 6.5, carbs: 15, fats: 4.8 },
    chakchouka: { cal: 120, prot: 6, carbs: 10, fats: 6 },
    harissa: { cal: 45, prot: 1.8, carbs: 6.2, fats: 1.8 },
    tajine: { cal: 180, prot: 12, carbs: 5, fats: 11 },
};

const TUNISIAN_DISHES = Object.keys(TUNISIAN_NUTRITION);

async function getCaptionFromImage(imageBase64: string): Promise<string> {
    if (!HF_TOKEN) throw new Error('HF_TOKEN not configured');

    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const binary = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const response = await fetch(`${HF_API}/Salesforce/blip-image-captioning-base`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/octet-stream',
        },
        body: binary,
    });

    if (!response.ok) return '';
    const data = await response.json();
    return data[0]?.generated_text || '';
}

async function classifyDish(imageBase64: string): Promise<any[]> {
    if (!HF_TOKEN) return [];

    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const candidateLabels = [
        ...TUNISIAN_DISHES,
        'pizza', 'burger', 'sandwich', 'salad', 'rice dish',
        'pasta', 'soup', 'grilled chicken', 'fish dish', 'bread'
    ];

    const response = await fetch(`${HF_API}/openai/clip-vit-base-patch32`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: { image: base64Data },
            parameters: { candidate_labels: candidateLabels }
        }),
    });

    if (!response.ok) return [];
    const data = await response.json();
    if (data.labels && data.scores) {
        return data.labels.map((label: string, i: number) => ({ label, score: data.scores[i] }));
    }
    return data || [];
}

async function queryEdamamNutrition(ingredient: string) {
    if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) return null;
    try {
        const response = await fetch(
            `https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&nutrition-type=cooking&ingr=${encodeURIComponent('100g ' + ingredient)}`
        );
        if (!response.ok) return null;
        const data = await response.json();
        if (!data.calories) return null;
        return {
            name: ingredient,
            calories_per_100g: Math.round(data.calories),
            proteins_per_100g: Math.round(data.totalNutrients?.PROCNT?.quantity || 0),
            carbs_per_100g: Math.round(data.totalNutrients?.CHOCDF?.quantity || 0),
            fats_per_100g: Math.round(data.totalNutrients?.FAT?.quantity || 0),
        };
    } catch {
        return null;
    }
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        const { imageBase64, transcript, type } = await req.json();

        if (type === 'photo' && imageBase64) {
            const [caption, classResults] = await Promise.all([
                getCaptionFromImage(imageBase64),
                classifyDish(imageBase64)
            ]);

            const topDish = classResults[0] || { label: 'meal', score: 0.5 };
            const localNut = TUNISIAN_NUTRITION[topDish.label.toLowerCase()];
            const edamamNut = await queryEdamamNutrition(topDish.label);

            const nutrition = {
                cal: edamamNut?.calories_per_100g || localNut?.cal || 150,
                prot: edamamNut?.proteins_per_100g || localNut?.prot || 8,
                carbs: edamamNut?.carbs_per_100g || localNut?.carbs || 18,
                fats: edamamNut?.fats_per_100g || localNut?.fats || 5
            };

            const servingG = 250;
            const factor = servingG / 100;

            const items = [{
                name: topDish.label,
                quantity_g: servingG,
                calories: Math.round(nutrition.cal * factor),
                proteins: Math.round(nutrition.prot * factor),
                carbs: Math.round(nutrition.carbs * factor),
                fats: Math.round(nutrition.fats * factor),
                confidence: topDish.score
            }];

            return new Response(JSON.stringify({
                mealName: topDish.label,
                totalCalories: items[0].calories,
                totalProteins: items[0].proteins,
                totalCarbs: items[0].carbs,
                totalFats: items[0].fats,
                items
            }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        if (type === 'voice' && transcript) {
            const dish = transcript.toLowerCase();
            const localNut = TUNISIAN_NUTRITION[dish];
            const edamamNut = await queryEdamamNutrition(dish);

            const nutrition = {
                cal: edamamNut?.calories_per_100g || localNut?.cal || 150,
                prot: edamamNut?.proteins_per_100g || localNut?.prot || 8,
                carbs: edamamNut?.carbs_per_100g || localNut?.carbs || 18,
                fats: edamamNut?.fats_per_100g || localNut?.fats || 5
            };

            const factor = 2.5;
            const res = {
                mealName: dish,
                totalCalories: Math.round(nutrition.cal * factor),
                totalProteins: Math.round(nutrition.prot * factor),
                totalCarbs: Math.round(nutrition.carbs * factor),
                totalFats: Math.round(nutrition.fats * factor),
                items: [{
                    name: dish,
                    quantity_g: 250,
                    calories: Math.round(nutrition.cal * factor),
                    proteins: Math.round(nutrition.prot * factor),
                    carbs: Math.round(nutrition.carbs * factor),
                    fats: Math.round(nutrition.fats * factor),
                    confidence: 0.9
                }]
            };
            return new Response(JSON.stringify(res), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: corsHeaders });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
});
