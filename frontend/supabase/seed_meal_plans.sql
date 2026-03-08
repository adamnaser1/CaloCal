-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER,
    avg_calories_per_day INTEGER,
    goal_type TEXT CHECK (goal_type IN ('lose', 'gain', 'maintain')),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category TEXT,
    rating NUMERIC(2, 1),
    users_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meal_plan_days table
CREATE TABLE IF NOT EXISTS meal_plan_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
    day_number INTEGER,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_description TEXT,
    estimated_calories INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Seed Data (Plans)
INSERT INTO meal_plans (title, description, duration_days, avg_calories_per_day, goal_type, difficulty, category, rating, users_count)
VALUES
('Régime méditerranéen tunisien', 'Un plan équilibré inspiré de la cuisine tunisienne traditionnelle avec des influences méditerranéennes.', 7, 1800, 'lose', 'easy', 'tunisian', 4.7, 12000),
('High Protein Tunisien', 'Riche en protéines pour la prise de masse musculaire avec des plats tunisiens.', 21, 2000, 'gain', 'medium', 'highprotein', 4.5, 8500),
('Low Carb Maghreb', 'Faible en glucides, adapté aux saveurs du Maghreb.', 14, 1600, 'lose', 'easy', 'tunisian', 4.3, 6200),
('Ramadan Special', 'Plan nutritionnel adapté au jeûne du Ramadan, équilibré pour le Iftar et Suhoor.', 30, 1800, 'maintain', 'easy', 'ramadan', 4.8, 15000),
('Balanced Classic', 'Un plan équilibré pour maintenir son poids avec une alimentation variée.', 28, 1850, 'maintain', 'easy', 'tunisian', 4.6, 9800)
ON CONFLICT DO NOTHING;

-- Insert Seed Data (Days for 'Régime méditerranéen tunisien')
DO $$
DECLARE
    plan1_id UUID;
BEGIN
    SELECT id INTO plan1_id FROM meal_plans WHERE title = 'Régime méditerranéen tunisien' LIMIT 1;

    IF plan1_id IS NOT NULL THEN
        -- Delete existing days to avoid duplicates if re-running
        DELETE FROM meal_plan_days WHERE plan_id = plan1_id;

        INSERT INTO meal_plan_days (plan_id, day_number, meal_type, food_description, estimated_calories)
        VALUES
        (plan1_id, 1, 'breakfast', 'Lben + msemen', 340),
        (plan1_id, 1, 'lunch', 'Couscous légumes', 520),
        (plan1_id, 1, 'dinner', 'Chorba frik', 280),
        (plan1_id, 1, 'snack', 'Dattes + amandes', 180),
        (plan1_id, 2, 'breakfast', 'Café + pain complet + huile d''olive', 280),
        (plan1_id, 2, 'lunch', 'Ojja merguez', 480),
        (plan1_id, 2, 'dinner', 'Salade mechouia + poisson', 320),
        (plan1_id, 2, 'snack', 'Fruit de saison', 80);
    END IF;
END $$;
