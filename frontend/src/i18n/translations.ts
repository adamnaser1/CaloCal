export const translations = {
    en: {
        // Common
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        done: 'Done',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        meal: 'Meal',

        // Home
        greeting: {
            morning: 'Good morning',
            afternoon: 'Good afternoon',
            evening: 'Good evening',
        },
        todaysMeals: "Today's meals",
        addMeal: 'Add meal',
        caloriesRemaining: 'kcal remaining',
        encouragingMessage: 'Encouraging Message',
        noMealsToday: '🍽️ No meals today — tap + to start',

        // Meal types
        mealType: {
            breakfast: 'Breakfast',
            lunch: 'Lunch',
            dinner: 'Dinner',
            snack: 'Snack',
        },
        mealTypes: { // For backward compatibility
            breakfast: 'Breakfast',
            lunch: 'Lunch',
            dinner: 'Dinner',
            snack: 'Snack',
        },

        // Macros
        macros: {
            proteins: 'Proteins',
            carbs: 'Carbs',
            fats: 'Fats',
        },

        // Diary
        diary: 'Diary',
        dailySummary: 'Daily Summary',
        totalMacros: 'Total Macros',
        noMealsLogged: 'No meals logged for this day',
        reachedBeginning: "You've reached the beginning of your journey",
        'diary.emptyTitle': 'Your diary is empty',
        'diary.emptySubtitle': 'Start logging your meals to see them here!',

        // Capture
        capture: {
            title: 'Snap your meal',
            startingCamera: 'Starting camera...',
            gallery: 'Gallery',
            scan: 'Scan',
            voice: 'Voice',
            hint: 'The clearer the photo, the better the analysis',
        },
        'camera.denied': 'Could not access camera. Please allow camera permission.',

        // Profile
        profile: 'Profile',
        personalInfo: 'Personal information',
        myGoals: 'My goals',
        notifications: 'Notifications',
        language: 'Language',
        changePhoto: 'Change photo',
        logout: 'Logout',
        darkMode: 'Dark Mode',
        dataPrivacy: 'Data & Privacy',
        exportData: 'Export My Data',
        helpCenter: 'Help Center',
        aboutApp: 'About Calo Cal',
        privacyPolicy: 'Privacy Policy',
        backToHome: 'Back to Home',
        'profile.privacy': 'Privacy Policy',
        'profile.about': 'About Calo Cal',
        'profile.darkModeEnabled': 'Dark mode enabled',
        'profile.lightModeEnabled': 'Light mode enabled',
        'profile.preferenceSaved': 'Your preference has been saved',
        'profile.photoUpdated': 'Profile photo updated!',
        'profile.photoUploadError': 'Could not upload photo',

        // Notifications
        notificationsSettings: 'Notification Settings',
        mealReminders: 'Meal reminders',
        goalUpdates: 'Goal updates',
        weeklySummary: 'Weekly summary',
        pushNotifications: 'Push notifications',
        notificationsSaved: 'Preferences updated',

        // Export
        downloadData: 'Download your data',
        exportDescription: 'Get a copy of all your meal logs and profile information in JSON format.',
        whatsIncluded: "What's included?",
        profileDetails: 'Profile details (height, weight, goals)',
        completeHistory: 'Complete meal history',
        ingredientBreakdowns: 'Ingredient breakdowns',
        analysisTimestamps: 'Analysis timestamps',
        generating: 'Generating...',
        downloadJson: 'Download JSON',
        'exportData.successTitle': 'Data exported ✓',
        'exportData.successDesc': 'JSON file downloaded',
        'exportData.errorTitle': 'Export failed',

        // Privacy
        'privacy.title': 'Your Privacy Matters',
        'privacy.intro': 'At Calo Cal, we believe your health data is personal. This policy outlines how we protect and manage your information.',
        'privacy.dataCollection': 'Data Collection',
        'privacy.dataCollectionDesc': 'We only collect data necessary for tracking your nutrition goals, including age, weight, height, and meal logs.',
        'privacy.security': 'Security',
        'privacy.securityDesc': 'Your data is securely stored in Supabase and is only accessible by you.',
        'privacy.sharing': 'Data Sharing',
        'privacy.sharingDesc': 'We never sell your personal data to third parties.',
        'privacy.rights': 'Your Rights',
        'privacy.rightsDesc': 'You can export your data at any time from the Export section.',

        // About
        'about.ourMission': 'Our Mission',
        'about.missionDesc': 'Calo Cal was built to simplify nutrition tracking in Tunisia. We combine advanced AI to help you reach your goals.',

        // ... rest as before
    },

    fr: {
        // Common
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        done: 'Terminé',
        loading: 'Chargement...',
        success: 'Succès',
        error: 'Erreur',
        meal: 'Repas',

        // Home
        greeting: {
            morning: 'Bonjour',
            afternoon: 'Bon après-midi',
            evening: 'Bonsoir',
        },
        todaysMeals: "Repas d'aujourd'hui",
        addMeal: 'Ajouter un repas',
        caloriesRemaining: 'kcal restantes',
        encouragingMessage: 'Message d\'encouragement',
        noMealsToday: '🍽️ Aucun repas aujourd\'hui — appuyez sur + pour commencer',

        // Meal types
        mealType: {
            breakfast: 'Petit-déjeuner',
            lunch: 'Déjeuner',
            dinner: 'Dîner',
            snack: 'Collation',
        },
        mealTypes: { // For backward compatibility
            breakfast: 'Petit-déjeuner',
            lunch: 'Déjeuner',
            dinner: 'Dîner',
            snack: 'Collation',
        },

        // Macros
        macros: {
            proteins: 'Protéines',
            carbs: 'Glucides',
            fats: 'Lipides',
        },

        // Diary
        diary: 'Journal',
        dailySummary: 'Résumé Quotidien',
        totalMacros: 'Total des Macros',
        noMealsLogged: 'Aucun repas enregistré pour ce jour',
        reachedBeginning: "Vous avez atteint le début de votre parcours",
        'diary.emptyTitle': 'Votre journal est vide',
        'diary.emptySubtitle': 'Commencez à enregistrer vos repas pour les voir ici !',

        // Capture
        capture: {
            title: 'Prenez votre repas en photo',
            startingCamera: 'Démarrage de la caméra...',
            gallery: 'Galerie',
            scan: 'Scanner',
            voice: 'Voix',
            hint: 'Plus la photo est claire, meilleure est l\'analyse',
        },
        'camera.denied': 'Impossible d\'accéder à la caméra. Veuillez autoriser la permission.',

        // Profile
        profile: 'Profil',
        personalInfo: 'Informations personnelles',
        myGoals: 'Mes objectifs',
        notifications: 'Notifications',
        language: 'Langue',
        changePhoto: 'Changer la photo',
        logout: 'Déconnexion',
        darkMode: 'Mode Sombre',
        dataPrivacy: 'Données et Confidentialité',
        exportData: 'Exporter mes données',
        helpCenter: "Centre d'aide",
        aboutApp: 'À propos de Calo Cal',
        privacyPolicy: 'Politique de confidentialité',
        backToHome: 'Retour à l\'accueil',
        'profile.privacy': 'Politique de confidentialité',
        'profile.about': 'À propos de Calo Cal',
        'profile.darkModeEnabled': 'Mode sombre activé',
        'profile.lightModeEnabled': 'Mode clair activé',
        'profile.preferenceSaved': 'Votre préférence a été enregistrée',
        'profile.photoUpdated': 'Photo de profil mise à jour !',
        'profile.photoUploadError': 'Impossible de charger la photo',

        // Notifications
        notificationsSettings: 'Paramètres des notifications',
        mealReminders: 'Rappels de repas',
        goalUpdates: 'Mises à jour des objectifs',
        weeklySummary: 'Résumé hebdomadaire',
        pushNotifications: 'Notifications push',
        notificationsSaved: 'Préférences mises à jour',

        // Export
        downloadData: 'Télécharger vos données',
        exportDescription: 'Obtenez une copie de tous vos journaux de repas et informations de profil au format JSON.',
        whatsIncluded: "Ce qui est inclus ?",
        profileDetails: 'Détails du profil (taille, poids, objectifs)',
        completeHistory: 'Historique complet des repas',
        ingredientBreakdowns: 'Détails des ingrédients',
        analysisTimestamps: 'Horodatages des analyses',
        generating: 'Génération...',
        downloadJson: 'Télécharger JSON',
        'exportData.successTitle': 'Données exportées ✓',
        'exportData.successDesc': 'Fichier JSON téléchargé',
        'exportData.errorTitle': 'L\'exportation a échoué',

        // Privacy
        'privacy.title': 'Votre vie privée compte',
        'privacy.intro': 'Chez Calo Cal, nous pensons que vos données de santé sont personnelles.',
        'privacy.dataCollection': 'Collecte de données',
        'privacy.dataCollectionDesc': 'Nous ne collectons que les données nécessaires au suivi de vos objectifs nutritionnels.',
        'privacy.security': 'Sécurité',
        'privacy.securityDesc': 'Vos données sont stockées en toute sécurité dans Supabase.',
        'privacy.sharing': 'Partage de données',
        'privacy.sharingDesc': 'Nous ne vendons jamais vos données personnelles à des tiers.',
        'privacy.rights': 'Vos droits',
        'privacy.rightsDesc': 'Vous pouvez exporter vos données à tout moment depuis la section Export.',

        // About
        'about.ourMission': 'Notre Mission',
        'about.missionDesc': 'Calo Cal a été conçu pour simplifier le suivi nutritionnel en Tunisie.',

        // ... rest as before
    },

    ar: {
        // Common
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        done: 'تم',
        loading: 'جاري التحميل...',
        success: 'نجاح',
        error: 'خطأ',
        meal: 'وجبة',

        // Home
        greeting: {
            morning: 'صباح الخير',
            afternoon: 'نهارك سعيد',
            evening: 'مساء الخير',
        },
        todaysMeals: 'وجبات اليوم',
        addMeal: 'زيد ماكلة',
        caloriesRemaining: 'كالوري باقي',
        encouragingMessage: 'تشجيع',
        noMealsToday: '🍽️ ما فما حتى وجبة اليوم — انزل على + باش تبدأ',

        // Meal types
        mealType: {
            breakfast: 'فطور صباح',
            lunch: 'غداء',
            dinner: 'عشاء',
            snack: 'لمجة',
        },
        mealTypes: { // For backward compatibility
            breakfast: 'فطور صباح',
            lunch: 'غداء',
            dinner: 'عشاء',
            snack: 'لمجة',
        },

        // Macros
        macros: {
            proteins: 'بروتين',
            carbs: 'كارب',
            fats: 'دهون',
        },

        // Diary
        diary: 'اليوميات',
        dailySummary: 'ملخص اليوم',
        totalMacros: 'مجموع الماكرو',
        noMealsLogged: 'لا توجد وجبات مسجلة في هذا اليوم',
        reachedBeginning: "وصلت لبداية رحلتك",
        'diary.emptyTitle': 'اليوميات فارغة',
        'diary.emptySubtitle': 'ابدأ بتسجيل وجباتك باش تشوفهم هنا !',

        // Capture
        capture: {
            title: 'صور ماكلتك',
            startingCamera: 'جاري تشغيل الكاميرا...',
            gallery: 'المعرض',
            scan: 'سكان',
            voice: 'صوت',
            hint: 'كل ما كانت الصورة أوضح، كل ما كان التحليل أدق',
        },
        'camera.denied': 'ما نجمناش ندخلوا للكاميرا. من فضلك وافق على الصلاحيات.',

        // Profile
        profile: 'الملف الشخصي',
        personalInfo: 'المعلومات الشخصية',
        myGoals: 'أهدافي',
        notifications: 'الإشعارات',
        language: 'اللغة',
        changePhoto: 'بدل الصورة',
        logout: 'تسجيل الخروج',
        darkMode: 'الوضع المظلم',
        dataPrivacy: 'البيانات والخصوصية',
        exportData: 'تصدير بياناتي',
        helpCenter: 'مركز المساعدة',
        aboutApp: 'حول التطبيق',
        privacyPolicy: 'سياسة الخصوصية',
        backToHome: 'رجوع للرئيسية',
        'profile.privacy': 'سياسة الخصوصية',
        'profile.about': 'حول التطبيق',
        'profile.darkModeEnabled': 'تم تفعيل الوضع المظلم',
        'profile.lightModeEnabled': 'تم تفعيل الوضع المضيء',
        'profile.preferenceSaved': 'تم حفظ تفضيلاتك',
        'profile.photoUpdated': 'تم تحديث صورة الملف الشخصي !',
        'profile.photoUploadError': 'ما نجمناش نحملوا الصورة',

        // Notifications
        notificationsSettings: 'إعدادات الإشعارات',
        mealReminders: 'تذكير بالوجبات',
        goalUpdates: 'تحديثات الأهداف',
        weeklySummary: 'ملخص الأسبوع',
        pushNotifications: 'إشعارات',
        notificationsSaved: 'تم تحديث الإعدادات',

        // Export
        downloadData: 'تحميل بياناتك',
        exportDescription: 'احصل على نسخة من جميع سجلات وجباتك ومعلومات ملفك الشخصي بتنسيق JSON.',
        whatsIncluded: 'شنوة موجود ؟',
        profileDetails: 'تفاصيل الملف الشخصي (الطول، الوزن، الأهداف)',
        completeHistory: 'سجل الوجبات الكامل',
        ingredientBreakdowns: 'تفاصيل المكونات',
        analysisTimestamps: 'طوابع زمنية للتحليل',
        generating: 'جاري التحضير...',
        downloadJson: 'تحميل JSON',
        'exportData.successTitle': 'تم تصدير البيانات ✓',
        'exportData.successDesc': 'تم تحميل ملف JSON',
        'exportData.errorTitle': 'فشل التصدير',

        // Privacy
        'privacy.title': 'خصوصيتك تهمنا',
        'privacy.intro': 'في Calo Cal، نؤمن أن بياناتك الصحية شخصية.',
        'privacy.dataCollection': 'جمع البيانات',
        'privacy.dataCollectionDesc': 'نجمع فقط البيانات الضرورية لتتبع أهدافك الغذائية.',
        'privacy.security': 'الأمان',
        'privacy.securityDesc': 'بياناتك مخزنة بأمان في Supabase.',
        'privacy.sharing': 'مشاركة البيانات',
        'privacy.sharingDesc': 'لا نبيع بياناتك الشخصية لأطراف ثالثة أبداً.',
        'privacy.rights': 'حقوقك',
        'privacy.rightsDesc': 'يمكنك تصدير بياناتك في أي وقت من قسم التصدير.',

        // About
        'about.ourMission': 'مهمتنا',
        'about.missionDesc': 'تم بناء Calo Cal لتبسيط تتبع التغذية في تونس.',
    }
}

export type Language = 'en' | 'fr' | 'ar'

export function translate(key: string, lang: Language, params?: Record<string, any>): string {
    const keys = key.split('.')
    let value: any = translations[lang]

    for (const k of keys) {
        value = value?.[k]
    }

    if (typeof value === 'string' && params) {
        return value.replace(/{(\w+)}/g, (_, key) => params[key] ?? `{${key}}`)
    }

    return value || key
}
