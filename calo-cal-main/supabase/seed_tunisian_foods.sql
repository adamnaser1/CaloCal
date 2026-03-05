INSERT INTO food_items (
  name_fr, name_ar, category,
  calories_per_100g, proteins_per_100g,
  carbs_per_100g, fats_per_100g
) VALUES
-- Plats principaux
('Couscous au poulet', 'كسكسي بالدجاج', 'tunisian', 139, 5.8, 23.2, 2.1),
('Couscous au poisson', 'كسكسي بالحوت', 'tunisian', 145, 7.2, 22.8, 3.1),
('Couscous à l''agneau', 'كسكسي بالعلوش', 'tunisian', 185, 8.5, 23.0, 6.5),
('Brik à l''œuf', 'بريك بالبيض', 'tunisian', 280, 8.4, 22, 16),
('Brik au thon', 'بريك بالتن', 'tunisian', 265, 10.2, 20, 15),
('Lablabi', 'لبلابي', 'tunisian', 160, 9, 22.5, 4.2),
('Ojja merguez', 'عجة مرقاز', 'tunisian', 240, 14, 8, 16.5),
('Ojja aux fruits de mer', 'عجة بفواكه البحر', 'tunisian', 185, 16, 6, 10),
('Chorba frik', 'شربة فريك', 'tunisian', 93, 3.5, 14, 2.8),
('Chorba aadess', 'شربة عدس', 'tunisian', 88, 4.8, 13, 1.9),
('Fricassé', 'فريكاسي', 'tunisian', 220, 6.2, 28, 9),
('Kafteji', 'كفتاجي', 'tunisian', 165, 7, 12, 9.5),
('Makloub', 'مقلوب', 'tunisian', 195, 8, 26, 6.2),
('Mloukhiya', 'ملوخية', 'tunisian', 125, 6.5, 15, 4.8),
('Kamounia', 'كمونية', 'tunisian', 180, 12, 5, 10),
('Mosli poulet', 'مصلي دجاج', 'tunisian', 160, 15, 6, 8),
('Ain sbaniouria', 'عين سبنيورية', 'tunisian', 210, 14, 8, 12),
('Tajine tunisien', 'طاجين', 'tunisian', 230, 14, 12, 15),

-- Salades & Entrées
('Salade mechouia', 'سلطة مشوية', 'tunisian', 65, 2.1, 10.2, 2.5),
('Salade tunisienne', 'سلطة تونسية', 'tunisian', 45, 1.8, 7.5, 1.2),
('Slata', 'سلاطة', 'tunisian', 38, 1.5, 6.8, 0.9),
('Houria', 'هرية', 'tunisian', 95, 2.2, 18, 2.8),
('Omek houria', 'أم الهريسة', 'tunisian', 78, 1.8, 14.5, 2.1),
('Doigts de Fatma', 'صوابع فاطمة', 'tunisian', 290, 8, 24, 18),

-- Pâtisseries
('Makroudh', 'مقروض', 'tunisian', 380, 4.2, 58, 15),
('Baklawa', 'بقلاوة', 'tunisian', 420, 5.8, 52, 21),
('Yo-yo', 'يويو', 'tunisian', 390, 5.5, 48, 18.5),
('Kaak warka', 'كعك الوركة', 'tunisian', 410, 6, 55, 19),
('Zrir', 'زرير', 'tunisian', 445, 8.5, 38, 28),
('Bambalouni', 'بمبالوني', 'tunisian', 325, 4.8, 42, 15.5),
('Assida', 'عصيدة', 'tunisian', 220, 3.2, 38, 6.8),
('Bsissa', 'بسيسة', 'tunisian', 395, 11, 62, 12),
('Samsa', 'صمصة', 'tunisian', 450, 8, 45, 25),
('Ghraiba', 'غريبة', 'tunisian', 480, 6, 58, 26),

-- Boissons
('Lben', 'لبن', 'dairy', 42, 3.2, 4.8, 1.2),
('Thé à la menthe', 'شاي بالنعناع', 'tunisian', 25, 0, 6.5, 0),
('Café turc', 'قهوة تركية', 'tunisian', 2, 0.1, 0.2, 0),
('Citronnade', 'سيتروناد', 'tunisian', 45, 0, 11, 0),

-- Accompagnements
('Harissa', 'هريسة', 'tunisian', 45, 1.8, 6.2, 1.8),
('Pain tabouna', 'خبز الطابونة', 'tunisian', 265, 8.5, 52, 2.8),
('Msemen', 'مسمن', 'tunisian', 295, 7.2, 48, 8.5),
('Chapati tunisien', 'شباتي', 'tunisian', 280, 7.8, 50, 5.2),
('Makhobz', 'خبز', 'tunisian', 250, 8, 50, 1.5),

-- Fruits & Autres
('Datte', 'تمر', 'fruit', 280, 2.5, 75, 0.4),
('Figue de barbarie', 'هندي', 'fruit', 41, 0.7, 9.6, 0.5),
('Grenade', 'رمان', 'fruit', 83, 1.7, 18.7, 1.2);
