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
        todaysMeals: "Today's Meals",
        addMeal: 'Add meal',
        caloriesRemaining: 'kcal remaining',
        encouragingMessage: 'Encouraging message',
        noMealsToday: '🍽️ No meals today — tap + to start',

        // Meal types
        mealType: {
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
            title: 'Take a photo of your meal',
            startingCamera: 'Starting camera...',
            gallery: 'Gallery',
            scan: 'Scan',
            voice: 'Voice',
            hint: 'The clearer the photo, the better the analysis',
            photoTips: 'Photo tips',
            tip1: 'Good lighting = better results!',
            tip2: 'Place the dish on a plain surface',
            tip3: 'Capture the full plate from above',
            gotIt: 'Got it',
        },
        'camera.denied': 'Could not access camera. Please allow permission.',

        // Profile
        profile: 'Profile',
        notifications: 'Notifications',
        language: 'Language',
        changePhoto: 'Change Photo',
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
        'profile.photoUploadError': 'Failed to upload photo',

        // Notifications
        notificationsSettings: 'Notifications Settings',
        mealReminders: 'Meal Reminders',
        goalUpdates: 'Goal Updates',
        weeklySummary: 'Weekly Summary',
        pushNotifications: 'Push Notifications',
        notificationsSaved: 'Preferences updated',

        // Export
        downloadData: 'Download your data',
        exportDescription: 'Get a copy of all your meal logs and profile information in JSON format.',
        whatsIncluded: "What's included?",
        profileDetails: 'Profile details (height, weight, goals)',
        completeHistory: 'Complete meal history',
        ingredientBreakdowns: 'Ingredient details',
        analysisTimestamps: 'Analysis timestamps',
        generating: 'Generating...',
        downloadJson: 'Download JSON',
        'exportData.successTitle': 'Data exported ✓',
        'exportData.successDesc': 'JSON file downloaded',
        'exportData.errorTitle': 'Export failed',

        // Privacy
        'privacy.title': 'Your Privacy Matters',
        'privacy.intro': 'At Calo Cal, we believe your health data is personal. This policy outlines how we protect your information.',
        'privacy.dataCollection': 'Data Collection',
        'privacy.dataCollectionDesc': 'We only collect data necessary for tracking your nutritional goals, including age, weight, height, and meal logs.',
        'privacy.security': 'Security',
        'privacy.securityDesc': 'Your data is securely stored in Supabase and only accessible by you.',
        'privacy.sharing': 'Data Sharing',
        'privacy.sharingDesc': 'We never sell your personal data to third parties.',
        'privacy.rights': 'Your Rights',
        'privacy.rightsDesc': 'You can export your data at any time from the Export section.',

        // About
        'about.ourMission': 'Our Mission',
        'about.missionDesc': 'Calo Cal was designed to simplify nutritional tracking in Tunisia. We combine AI to help you reach your goals.',
        'about.modernTech': 'Modern Technology',
        'about.modernTechDesc': 'Built with React, Supabase, and AI',
        'about.smartVision': 'Smart Vision',
        'about.smartVisionDesc': 'Recognize your plate in seconds',
        'about.madeWith': 'Made with {emoji} in Tunisia',

        // Auth
        auth: {
            welcome: 'Welcome back!',
            signinWithGoogle: 'Continue with Google',
            orContinue: 'Or continue with email',
            email: 'Email',
            password: 'Password',
            signingIn: 'Signing in...',
            signinBtn: 'Sign in →',
            noAccount: "Don't have an account?",
            signupLink: 'Sign up',
            createAccount: 'Create your account',
            fullName: 'Full name',
            confirmPassword: 'Confirm password',
            passwordsMatchError: "Passwords don't match",
            termsAgree: 'I agree to the Terms of Service and Privacy Policy',
            creatingAccount: 'Creating account...',
            signupBtn: 'Create account →',
            accountCreated: 'Account created!',
            welcomeOnboarding: "Welcome to Calo Cal — let's set up your profile",
            passwordStrength: {
                weak: 'Weak',
                fair: 'Fair',
                good: 'Good',
                strong: 'Strong',
            }
        },


        // Onboarding
        onboarding: {
            welcomeTagline: 'Snap it. Know it. Track it.',
            welcomeTitle: 'Track smarter, eat better',
            welcomeSubtitle: 'Powered by Adam NASR — built for Tunisian and North African cuisine',
            getStarted: 'Get Started →',
            alreadyAccount: 'I already have an account',
            goalTitle: "What's your goal?",
            goalSubtitle: "We'll personalize your daily targets",
            loseWeight: 'Lose weight',
            loseWeightDesc: 'Create a calorie deficit',
            maintainWeight: 'Maintain weight',
            maintainWeightDesc: 'Stay at your current level',
            buildMuscle: 'Build muscle',
            buildMuscleDesc: 'Increase protein intake',
            continue: 'Continue →',
            profileTitle: 'Tell us about you',
            profileSubtitle: 'Used to personalize your plan.',
            fullName: 'Full Name',
            fullNamePlaceholder: 'Enter your name',
            age: 'Age',
            sex: 'Biological sex',
            male: 'Male',
            female: 'Female',
            height: 'Height',
            currentWeight: 'Current weight',
            targetWeight: 'Target weight',
            goalDifference: 'Goal: {diff} kg to {action}',
            gain: 'gain',
            lose: 'lose',
            activityLevel: 'Activity level',
            activityLevels: {
                sedentary: { label: 'Sedentary', desc: 'Little/no exercise' },
                lightly_active: { label: 'Lightly Active', desc: '1-3 days/week' },
                moderately_active: { label: 'Moderately Active', desc: '3-5 days/week' },
                very_active: { label: 'Very Active', desc: '6-7 days/week' },
                extremely_active: { label: 'Extremely Active', desc: 'Athlete' }
            },
            caloriesTitle: 'Your daily goal',
            caloriesSubtitle: 'Based on your profile',
            kcalPerDay: 'kcal/day',
            macros: 'Macros',
            adjustManually: 'Adjust manually',
            calculationBreakdown: 'Calculation Breakdown',
            bmr: 'Basal Metabolic Rate (BMR)',
            activityMultiplier: 'Activity Multiplier',
            tdee: 'Total Daily Energy Disp. (TDEE)',
            adjustment: 'Goal Adjustment',
            finalGoal: 'Final Calorie Goal',
            startTracking: 'Start tracking! 🚀',
            errors: {
                nameLength: 'Name must be at least 2 characters.',
                ageRange: 'Age must be between 13 and 100.',
                sexRequired: 'Please select your biological sex.',
                heightRequired: 'Height is required.',
                heightRangeCm: 'Height must be between 100cm and 250cm.',
                heightRangeFt: 'Height must be between 3.3ft and 8.2ft.',
                weightRequired: 'Current weight is required.',
                weightRangeKg: 'Weight must be between 30kg and 300kg.',
                weightRangeLbs: 'Weight must be between 66lbs and 660lbs.',
                targetWeightRequired: 'Target weight is required.',
                targetWeightRangeKg: 'Target weight must be between 30kg and 300kg.',
                targetWeightRangeLbs: 'Target weight must be between 66lbs and 660lbs.',
                weightDiffRange: 'Target weight must be within ±50kg of current weight.',
                activityRequired: 'Please select your activity level.',
                savingError: 'Error saving profile',
                savingErrorDesc: 'Could not save your plan. Please try again.'
            }
        },


        // Personal Info
        personalInfo: {
            title: 'Personal information',
            fullName: 'Full Name',
            age: 'Age',
            sex: 'Sex',
            male: 'Male',
            female: 'Female',
            height: 'Height (cm)',
            currentWeight: 'Current weight',
            targetWeight: 'Target weight',
            save: 'Save changes',
        },

        // My Goals
        myGoals: {
            title: 'My Goals',
            dailyTarget: 'Daily Target',
            updateGoal: 'Update Goal',
            activityLevel: 'Activity Level',
            sedentary: 'Sedentary',
            light: 'Lightly Active',
            moderate: 'Moderately Active',
            active: 'Very Active',
            updating: 'Updating...',
        },

        // Results
        results: {
            analyzing: 'Analyzing your meal...',
            todayAt: 'Today at',
            estimatedKcal: 'Estimated for this meal',
            macrosBreakdown: 'Macros breakdown',
            detectedIngredients: 'Detected ingredients',
            correctManually: 'Correct manually →',
            mealType: 'Meal Type',
            saveToDiary: 'Save to my diary',
            retake: 'Retake',
        },

        // Help
        help: {
            search: 'Search for help...',
            gettingStarted: 'Getting Started',
            faq1Q: 'How do I track a meal?',
            faq1A: 'Tap the camera button in the center of the bottom navigation bar. You can take a photo, upload one, scan a barcode, or describe your meal with voice.',
            faq2Q: 'What if the AI makes a mistake?',
            faq2A: 'After the AI estimates your meal, you can verify and edit the ingredients before saving. You can also edit saved meals from your diary.',
            tunisianCuisine: 'Tunisian Cuisine',
            faq3Q: 'Does it recognize Tunisian food?',
            faq3A: 'Yes! Our AI is specifically trained on Tunisian and North African dishes like Couscous, Brik, Lablabi, Ojja, and more.',
            faq4Q: 'My dish isn’t found',
            faq4A: 'If scanning doesn’t work, try describing it with Voice Input ("Sahn Tounsi avec thon...") or add it manually.',
            contactSupport: 'Contact Support',
        },

        // Version
        'v1.0.0': 'Version 1.2.0',

        // Bottom Navigation
        nav: {
            home: 'Home',
            diary: 'Diary',
            capture: 'Capture',
            progress: 'Progress',
            profile: 'Profile',
        },

        // Progress
        progress: {
            title: 'Your Progress',
            subtitle: "Keep it up, you're doing great!",
            week: 'Week',
            month: 'Month',
            threeMonths: '3 Months',
            dayStreak: 'Day Streak',
            avgCalories: 'Avg Calories',
            weightLog: 'Weight Log',
            calorieTrend: 'Calorie Trend',
            target: 'Target',
            logWeight: 'Log my weight',
            noWeightData: 'No weight data yet',
            noWeightSubtitle: 'Log your first weight to track progress',
            noMealsTrend: 'No meals logged yet',
            noMealsTrendSubtitle: 'Start tracking meals to see calorie trends',
        },

        // Weight Modal
        weightModal: {
            title: 'Log your weight',
            hint: 'Tap number to type directly',
            tapToType: 'tap to type',
            placeholder: 'How are you feeling today? (optional)',
            saveEntry: 'Save Entry ✓',
            success: 'Weight logged ✓',
            error: 'Something went wrong. Please try again.',
        },

        // Encouraging messages
        encouragement: {
            streakStart: "Great start! Keep it up! 🔥",
            streakContinue: "You're on fire! {days} day streak! 🚀",
            goalProgress: "You're {percent}% towards your goal! 💪",
            perfectDay: "Perfect day! All macros on point! 🎯",
            waterReminder: "Don't forget to drink water! 💧",
            exerciseBonus: "Exercise logged! You earned {calories} extra calories! 🏃",
            weeklyWin: "Great week! {daysOnTrack}/7 days on track! 🏆",
            firstMeal: "Great choice for your first meal! 🌟",
            balancedMeal: "Nicely balanced meal! High five! ⚖️",
            lowCalorie: "Smart choice! Low calorie option! 🎉",
            proteinGoal: "Hit your protein goal for today! 💪",
        }
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
            photoTips: 'Conseils photo',
            tip1: 'Bon éclairage = meilleurs résultats !',
            tip2: 'Placez le plat sur une surface plane',
            tip3: 'Capturez toute l\'assiette d\'en haut',
            gotIt: 'Compris',
        },
        'camera.denied': 'Impossible d\'accéder à la caméra. Veuillez autoriser la permission.',

        // Profile
        profile: 'Profil',
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
        'privacy.intro': 'Chez Calo Cal, nous pensons que vos données de santé sont personnelles. Cette politique décrit comment nous protégeons vos informations.',
        'privacy.dataCollection': 'Collecte de données',
        'privacy.dataCollectionDesc': 'Nous ne collectons que les données nécessaires au suivi de vos objectifs nutritionnels, notamment l\'âge, le poids, la taille et les journaux de repas.',
        'privacy.security': 'Sécurité',
        'privacy.securityDesc': 'Vos données sont stockées en toute sécurité dans Supabase et ne sont accessibles que par vous.',
        'privacy.sharing': 'Partage de données',
        'privacy.sharingDesc': 'Nous ne vendons jamais vos données personnelles à des tiers.',
        'privacy.rights': 'Vos droits',
        'privacy.rightsDesc': 'Vous pouvez exporter vos données à tout moment depuis la section Export.',

        // About
        'about.ourMission': 'Notre Mission',
        'about.missionDesc': 'Calo Cal a été conçu pour simplifier le suivi nutritionnel en Tunisie. Nous combinons l\'IA pour vous aider à atteindre vos objectifs.',
        'about.modernTech': 'Technologie Moderne',
        'about.modernTechDesc': 'Construit avec React, Supabase et IA',
        'about.smartVision': 'Vision Intelligente',
        'about.smartVisionDesc': 'Reconnaissance de votre assiette en quelques secondes',
        'about.madeWith': 'Fait avec {emoji} en Tunisie',

        // Auth
        auth: {
            welcome: 'Bon retour !',
            signinWithGoogle: 'Continuer avec Google',
            orContinue: 'Ou continuer avec email',
            email: 'Email',
            password: 'Mot de passe',
            signingIn: 'Connexion...',
            signinBtn: 'Se connecter →',
            noAccount: "Vous n'avez pas de compte ?",
            signupLink: 'S\'inscrire',
            createAccount: 'Créez votre compte',
            fullName: 'Nom complet',
            confirmPassword: 'Confirmer le mot de passe',
            passwordsMatchError: 'Les mots de passe ne correspondent pas',
            termsAgree: 'J\'accepte les conditions d\'utilisation et la politique de confidentialité',
            creatingAccount: 'Création du compte...',
            signupBtn: 'Créer un compte →',
            accountCreated: 'Compte créé !',
            welcomeOnboarding: "Bienvenue sur Calo Cal — configurons votre profil",
            passwordStrength: {
                weak: 'Faible',
                fair: 'Moyen',
                good: 'Bon',
                strong: 'Fort',
            }
        },


        // Onboarding
        onboarding: {
            welcomeTagline: 'Prenez en photo. Identifiez. Suivez.',
            welcomeTitle: 'Suivez plus intelligemment, mangez mieux',
            welcomeSubtitle: 'Propulsé par Adam NASR — conçu pour la cuisine tunisienne et nord-africaine',
            getStarted: 'Commencer →',
            alreadyAccount: "J'ai déjà un compte",
            goalTitle: 'Quel est votre objectif ?',
            goalSubtitle: 'Nous personnaliserons vos objectifs quotidiens',
            loseWeight: 'Perdre du poids',
            loseWeightDesc: 'Créer un déficit calorique',
            maintainWeight: 'Maintenir le poids',
            maintainWeightDesc: 'Rester à votre niveau actuel',
            buildMuscle: 'Prendre du muscle',
            buildMuscleDesc: 'Augmenter l’apport en protéines',
            continue: 'Continuer →',
            profileTitle: 'Parlez-nous de vous',
            profileSubtitle: 'Utilisé pour personnaliser votre plan.',
            fullName: 'Nom Complet',
            fullNamePlaceholder: 'Entrez votre nom',
            age: 'Âge',
            sex: 'Sexe biologique',
            male: 'Homme',
            female: 'Femme',
            height: 'Taille',
            currentWeight: 'Poids actuel',
            targetWeight: 'Poids cible',
            goalDifference: 'Objectif : {diff} kg à {action}',
            gain: 'gagner',
            lose: 'perdre',
            activityLevel: 'Niveau d’activité',
            activityLevels: {
                sedentary: { label: 'Sédentaire', desc: 'Peu/pas d’exercice' },
                lightly_active: { label: 'Légèrement actif', desc: '1-3 jours/semaine' },
                moderately_active: { label: 'Modérément actif', desc: '3-5 jours/semaine' },
                very_active: { label: 'Très actif', desc: '6-7 jours/semaine' },
                extremely_active: { label: 'Extrément actif', desc: 'Athlète' }
            },
            caloriesTitle: 'Votre objectif quotidien',
            caloriesSubtitle: 'Basé sur votre profil',
            kcalPerDay: 'kcal/jour',
            macros: 'Macros',
            adjustManually: 'Ajuster manuellement',
            calculationBreakdown: 'Détail du calcul',
            bmr: 'Métabolisme de base (MB)',
            activityMultiplier: 'Multiplicateur d’activité',
            tdee: 'Dépense énergétique journalière totale (DEJT)',
            adjustment: 'Ajustement de l’objectif',
            finalGoal: 'Objectif calorique final',
            startTracking: 'Commencer à suivre ! 🚀',
            errors: {
                nameLength: 'Le nom doit comporter au moins 2 caractères.',
                ageRange: 'L’âge doit être compris entre 13 et 100 ans.',
                sexRequired: 'Veuillez sélectionner votre sexe biologique.',
                heightRequired: 'La taille est requise.',
                heightRangeCm: 'La taille doit être comprise entre 100cm et 250cm.',
                heightRangeFt: 'La taille doit être comprise entre 3.3ft et 8.2ft.',
                weightRequired: 'Le poids actuel est requis.',
                weightRangeKg: 'Le poids doit être compris entre 30kg et 300kg.',
                weightRangeLbs: 'Le poids doit être compris entre 66lbs et 660lbs.',
                targetWeightRequired: 'Le poids cible est requis.',
                targetWeightRangeKg: 'Le poids cible doit être compris entre 30kg et 300kg.',
                targetWeightRangeLbs: 'Le poids cible doit être compris entre 66lbs et 660lbs.',
                weightDiffRange: 'Le poids cible doit être à +/- 50kg du poids actuel.',
                activityRequired: 'Veuillez sélectionner votre niveau d’activité.',
                savingError: 'Erreur lors de l’enregistrement du profil',
                savingErrorDesc: 'Impossible d’enregistrer votre plan. Veuillez réessayer.'
            }
        },


        // Personal Info
        personalInfo: {
            title: 'Informations personnelles',
            fullName: 'Nom complet',
            age: 'Âge',
            sex: 'Sexe',
            male: 'Homme',
            female: 'Femme',
            height: 'Taille (cm)',
            currentWeight: 'Poids actuel',
            targetWeight: 'Poids cible',
            save: 'Enregistrer les modifications',
        },

        // My Goals
        myGoals: {
            title: 'Mes Objectifs',
            dailyTarget: 'Cible Quotidienne',
            updateGoal: 'Mettre à jour l\'objectif',
            activityLevel: 'Niveau d\'activité',
            sedentary: 'Sédentaire',
            light: 'Légèrement Actif',
            moderate: 'Modérément Actif',
            active: 'Très Actif',
            updating: 'Mise à jour...',
        },

        // Results
        results: {
            analyzing: 'Analyse de votre repas...',
            todayAt: 'Aujourd\'hui à',
            estimatedKcal: 'Estimé pour ce repas',
            macrosBreakdown: 'Détails des macros',
            detectedIngredients: 'Ingrédients détectés',
            correctManually: 'Corriger manuellement →',
            mealType: 'Type de repas',
            saveToDiary: 'Enregistrer dans mon journal',
            retake: 'Reprendre',
        },

        // Help
        help: {
            search: 'Rechercher de l\'aide...',
            gettingStarted: 'Commencer',
            faq1Q: 'Comment suivre un repas ?',
            faq1A: 'Appuyez sur le bouton photo au centre de la barre de navigation. Vous pouvez prendre une photo, en charger une, scanner un code-barres ou décrire votre repas à la voix.',
            faq2Q: 'Et si l\'IA fait une erreur ?',
            faq2A: 'Après l\'analyse, vous pouvez vérifier et modifier les ingrédients avant d\'enregistrer. Vous pouvez aussi modifier vos repas enregistrés dans votre journal.',
            tunisianCuisine: 'Cuisine Tunisienne',
            faq3Q: 'Reconnaît-il la cuisine tunisienne ?',
            faq3A: 'Oui ! Notre IA est spécifiquement formée sur les plats tunisiens comme le Couscous, Brik, Lablabi, Ojja, etc.',
            faq4Q: 'Mon plat n’est pas trouvé',
            faq4A: 'Si le scan ne fonctionne pas, essayez de le décrire par la voix ("Sahn Tounsi avec thon...") ou ajoutez-le manuellement.',
            contactSupport: 'Contacter le support',
        },

        // Version
        'v1.0.0': 'Version 1.2.0',

        // Bottom Navigation
        nav: {
            home: 'Accueil',
            diary: 'Journal',
            capture: 'Photo',
            progress: 'Progrès',
            profile: 'Profil',
        },

        // Progress
        progress: {
            title: 'Votre Progrès',
            subtitle: 'Continuez comme ça, vous faites du bon travail !',
            week: 'Semaine',
            month: 'Mois',
            threeMonths: '3 Mois',
            dayStreak: 'Jours consécutifs',
            avgCalories: 'Calories Moy.',
            weightLog: 'Suivi du poids',
            calorieTrend: 'Tendance calorique',
            target: 'Cible',
            logWeight: 'Enregistrer mon poids',
            noWeightData: 'Aucune donnée de poids',
            noWeightSubtitle: 'Enregistrez votre première pesée pour suivre votre progression',
            noMealsTrend: 'Aucun repas enregistré',
            noMealsTrendSubtitle: 'Commencez à suivre vos repas pour voir vos tendances caloriques',
        },

        // Weight Modal
        weightModal: {
            title: 'Enregistrez votre poids',
            hint: 'Appuyez sur le chiffre pour le taper directement',
            tapToType: 'appuyez pour taper',
            placeholder: 'Comment vous sentez-vous aujourd\'hui ? (optionnel)',
            saveEntry: 'Enregistrer ✓',
            success: 'Poids enregistré ✓',
            error: 'Une erreur est survenue. Veuillez réessayer.',
        },

        // Encouraging messages
        encouragement: {
            streakStart: "Excellent début ! Continuez comme ça ! 🔥",
            streakContinue: "Vous assurez ! Série de {days} jours ! 🚀",
            goalProgress: "Vous êtes à {percent}% de votre objectif ! 💪",
            perfectDay: "Journée parfaite ! Tous les macros sont respectés ! 🎯",
            waterReminder: "N'oubliez pas de boire de l'eau ! 💧",
            exerciseBonus: "Exercice enregistré ! Vous avez gagné {calories} calories de plus ! 🏃",
            weeklyWin: "Semaine réussie ! {daysOnTrack}/7 jours respectés ! 🏆",
            firstMeal: "Bon choix pour votre premier repas de la journée ! 🌟",
            balancedMeal: "Repas bien équilibré ! Beau travail ! ⚖️",
            lowCalorie: "Choix intelligent ! Option faible en calories ! 🎉",
            proteinGoal: "Objectif protéines atteint pour aujourd'hui ! 💪",
        }
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
            photoTips: 'نصائح التصوير',
            tip1: 'إضاءة باهية = نتائج خير !',
            tip2: 'حط الصحن على بلاصة مستوية',
            tip3: 'صور الصحن كامل من الفوق',
            gotIt: 'مريغل',
        },
        'camera.denied': 'ما نجمناش ندخلوا للكاميرا. من فضلك وافق على الصلاحيات.',

        // Profile
        profile: 'الملف الشخصي',
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
        'privacy.intro': 'في Calo Cal، نؤمن أن بياناتك الصحية شخصية. السياسة هذي توضح كيفاش نحميو بياناتك.',
        'privacy.dataCollection': 'جمع البيانات',
        'privacy.dataCollectionDesc': 'نجمعو كان البيانات اللازمة باش تتبع أهدافك، كيف العمر، الميزان، والطول.',
        'privacy.security': 'الأمان',
        'privacy.securityDesc': 'بياناتك مخزنة بأمان في Supabase وإنت كهو تنجم تشوفها.',
        'privacy.sharing': 'مشاركة البيانات',
        'privacy.sharingDesc': 'عمرنا ما نبيعو بياناتك الشخصية لأطراف أخرى.',
        'privacy.rights': 'حقوقك',
        'privacy.rightsDesc': 'تنجم تخرج بياناتك في أي وقت من قسم التصدير.',

        // About
        'about.ourMission': 'مهمتنا',
        'about.missionDesc': 'Calo Cal تخدمت باش تسهل تتبع التغذية في تونس. نستخدمو الذكاء الاصطناعي باش نعاونوك توصل لأهدافك.',
        'about.modernTech': 'تكنولوجيا حديثة',
        'about.modernTechDesc': 'مخدوم بـ React و Supabase وذكاء اصطناعي',
        'about.smartVision': 'رؤية ذكية',
        'about.smartVisionDesc': 'يعرف شنوة في صحنك في ثواني',
        'about.madeWith': 'تخدم بـ {emoji} في تونس',

        // Auth
        auth: {
            welcome: 'مرحبا بيك من جديد !',
            signinWithGoogle: 'واصل بجوجل',
            orContinue: 'والا كمل بالإيميل',
            email: 'الإيميل',
            password: 'كلمة السر',
            signingIn: 'جاري الدخول...',
            signinBtn: 'سجل دخولك ←',
            noAccount: 'ما عندكش حساب ؟',
            signupLink: 'سجل توا',
            createAccount: 'حل حساب جديد',
            fullName: 'الإسم الكامل',
            confirmPassword: 'تأكيد كلمة السر',
            passwordsMatchError: 'كلمات السر موش كيف كيف',
            termsAgree: 'أنا موافق على شروط الخدمة وسياسة الخصوصية',
            creatingAccount: 'جاري فتح الحساب...',
            signupBtn: 'حل حساب ←',
            accountCreated: 'تم فتح الحساب !',
            welcomeOnboarding: 'مرحبا بيك في Calo Cal — خلينا نحضرو ملفك الشخصي',
            passwordStrength: {
                weak: 'ضعيف',
                fair: 'متوسط',
                good: 'باهي',
                strong: 'قوي',
            }
        },


        // Onboarding
        onboarding: {
            welcomeTagline: 'صور. أعرف. قيد.',
            welcomeTitle: 'تبع ماكلتك بذكاء، وعيش خير',
            welcomeSubtitle: 'بفضل Adam NASR — مخدوم للماكلة التونسية والمغاربية',
            getStarted: 'أبدا توة ←',
            alreadyAccount: 'عندي حساب ديجا',
            goalTitle: 'شنوة هدفك؟',
            goalSubtitle: 'باش نحضرو أهدافك اليومية بدقة',
            loseWeight: 'نقص في الميزان',
            loseWeightDesc: 'نقص في الكالوري',
            maintainWeight: 'حافظ على الميزان',
            maintainWeightDesc: 'بقى في مستواك الحالي',
            buildMuscle: 'أعمل عضلات',
            buildMuscleDesc: 'زيد في البروتين',
            continue: 'كمل ←',
            profileTitle: 'أحكيلنا على روحك',
            profileSubtitle: 'باش نحضرو البرنامج المناسب ليك.',
            fullName: 'الإسم الكامل',
            fullNamePlaceholder: 'أكتب إسمك',
            age: 'العمر',
            sex: 'الجنس البيولوجي',
            male: 'راجل',
            female: 'مرة',
            height: 'الطول',
            currentWeight: 'الميزان توة',
            targetWeight: 'الميزان إلي تحب عليه',
            goalDifference: 'الهدف: {diff} كغ باش {action}',
            gain: 'تزيد',
            lose: 'تنقص',
            activityLevel: 'مستوى النشاط',
            activityLevels: {
                sedentary: { label: 'راقد', desc: 'ماتعملش برشة سبور' },
                lightly_active: { label: 'نشاط خفيف', desc: '1-3 أيام في الجمعة' },
                moderately_active: { label: 'نشاط متوسط', desc: '3-5 أيام في الجمعة' },
                very_active: { label: 'ناشط برشة', desc: '6-7 أيام في الجمعة' },
                extremely_active: { label: 'رياضي محترف', desc: 'أثليت' }
            },
            caloriesTitle: 'هدفك اليومي من الكالوري',
            caloriesSubtitle: 'حسب معلوماتك الشخصية',
            kcalPerDay: 'كالوري/يوم',
            macros: 'المكونات الأساسية',
            adjustManually: 'عدل وحدك',
            calculationBreakdown: 'تفاصيل الحساب',
            bmr: 'معدل الأيض الأساسي (BMR)',
            activityMultiplier: 'معامل النشاط',
            tdee: 'إستهلاك الطاقة اليومي (TDEE)',
            adjustment: 'تعديل الهدف',
            finalGoal: 'الهدف النهائي من الكالوري',
            startTracking: 'أبدا قيد ماكلتك! 🚀',
            errors: {
                nameLength: 'الإسم لازم يكون فيه زوز حروف على الأقل.',
                ageRange: 'العمر لازم يكون بين 13 و 100 سنة.',
                sexRequired: 'أختار جنسك البيولوجي.',
                heightRequired: 'الطول لازم.',
                heightRangeCm: 'الطول لازم يكون بين 100سم و 250سم.',
                heightRangeFt: 'الطول لازم يكون بين 3.3 قدم و 8.2 قدم.',
                weightRequired: 'الميزان توة لازم تكتبو.',
                weightRangeKg: 'الميزان لازم يكون بين 30 كغ و 300 كغ.',
                weightRangeLbs: 'الميزان لازم يكون بين 66 و 660 باوند.',
                targetWeightRequired: 'الميزان إلي تحب عليه لازم تكتبو.',
                targetWeightRangeKg: 'الميزان المستهدف لازم يكون بين 30 كغ و 300 كغ.',
                targetWeightRangeLbs: 'الميزان المستهدف لازم يكون بين 66 و 660 باوند.',
                weightDiffRange: 'الميزان المستهدف لازم يكون في حدود +/- 50 كغ من ميزانك توة.',
                activityRequired: 'أختار مستوى نشاطك.',
                savingError: 'غلطة في خزن المعلومات',
                savingErrorDesc: 'منجمناش نخزنو برنامجك. عاود جرب.'
            }
        },


        // Personal Info
        personalInfo: {
            title: 'المعلومات الشخصية',
            fullName: 'الإسم الكامل',
            age: 'العمر',
            sex: 'الجنس',
            male: 'راجل',
            female: 'مرا',
            height: 'الطول (صم)',
            currentWeight: 'الوزن الحالي',
            targetWeight: 'الوزن المستهدف',
            save: 'حفظ التغييرات',
        },

        // My Goals
        myGoals: {
            title: 'أهدافي',
            dailyTarget: 'الهدف اليومي',
            updateGoal: 'تحديث الهدف',
            activityLevel: 'مستوى النشاط',
            sedentary: 'نشاط قليل',
            light: 'نشاط خفيف',
            moderate: 'نشاط متوسط',
            active: 'نشاط كبير',
            updating: 'جاري التحديث...',
        },

        // Results
        results: {
            analyzing: 'جاري تحليل وجبتك...',
            todayAt: 'اليوم مع',
            estimatedKcal: 'الكالوري المقدر للوجبة هذي',
            macrosBreakdown: 'تفاصيل الماكرو',
            detectedIngredients: 'المكونات اللي لقيناها',
            correctManually: 'صلح وحدك ←',
            mealType: 'نوع الوجبة',
            saveToDiary: 'سجلها في يومياتي',
            retake: 'عاود صور',
        },

        // Help
        help: {
            search: 'لوج على مساعدة...',
            gettingStarted: 'البداية',
            faq1Q: 'كيفاش نتبع وجبة ؟',
            faq1A: 'انزل على زر الكاميرا في الوسط. تنجم تصور، تحمل صورة، تعمل سكان، والا توصف ماكلتك بالصوت.',
            faq2Q: 'شنوة يصير لو الذكاء الاصطناعي يغلط ؟',
            faq2A: 'بعد التحليل، تنجم تثبت وتصلح المكونات قبل ما تسجل. وتنجم زادة تبدل الوجبات المسجلة من اليوميات.',
            tunisianCuisine: 'الماكلة التونسية',
            faq3Q: 'يعرف الماكلة التونسية ؟',
            faq3A: 'إي ! الذكاء الاصطناعي متاعنا مدرب على الماكلة التونسية كيف الكسكسي، البريك، اللبلابي، العجة، وغيرها.',
            faq4Q: 'ماكلتي ما لقيهاش',
            faq4A: 'لو السكان ما خدمش، جرب أوصفها بالصوت ("صحن تونسي بالتن...") والا زيدها وحدك.',
            contactSupport: 'إتصل بالدعم',
        },

        // Version
        'v1.0.0': 'نسخة 1.2.0',

        // Bottom Navigation
        nav: {
            home: 'الرئيسية',
            diary: 'اليوميات',
            capture: 'تصوير',
            progress: 'تقدمي',
            profile: 'ملفي',
        },

        // Progress
        progress: {
            title: 'تقدمك',
            subtitle: 'واصل، قاعد تعمل في مجهود باهي !',
            week: 'أسبوع',
            month: 'شهر',
            threeMonths: '3 أشهر',
            dayStreak: 'أيام متتالية',
            avgCalories: 'معدل الكالوري',
            weightLog: 'سجل الوزن',
            calorieTrend: 'تطور الكالوري',
            target: 'الهدف',
            logWeight: 'سجل وزني',
            noWeightData: 'ما فما حتى سجل وزن',
            noWeightSubtitle: 'سجل أول وزن ليك باش تتبع تقدمك',
            noMealsTrend: 'ما فما حتى وجبة مسجلة',
            noMealsTrendSubtitle: 'ابدأ سجل وجباتك باش تشوف تطور الكالوري',
        },

        // Weight Modal
        weightModal: {
            title: 'سجل وزنك',
            hint: 'انزل على الرقم باش تكتبو ديراكت',
            tapToType: 'انزل باش تكتب',
            placeholder: 'كيفاش حاسس روحك اليوم ؟ (إختياري)',
            saveEntry: 'حفظ ✓',
            success: 'تم تسجيل الوزن ✓',
            error: 'فما حاجة غالطة صارت. عاود جرب.',
        },

        // Encouraging messages
        encouragement: {
            streakStart: "بداية هايلة! واصل! 🔥",
            streakContinue: "إنت طيارة! {days} أيام ورا بعضهم! 🚀",
            goalProgress: "وصلت لـ {percent}% من هدفك! 💪",
            perfectDay: "يوم مثالي! الماكرو الكل مريغلين! 🎯",
            waterReminder: "ما تنساش تشرب الماء! 💧",
            exerciseBonus: "تم تسجيل الرياضة! ربحت {calories} كالوري زايدين! 🏃",
            weeklyWin: "أسبوع ممتاز! {daysOnTrack}/7 أيام مريغلين! 🏆",
            firstMeal: "إختيار باهي لأول وجبة اليوم! 🌟",
            balancedMeal: "وجبة متوازنة! يعطيك الصحة! ⚖️",
            lowCalorie: "إختيار ذكي! وجبة فيها شوية كالوري! 🎉",
            proteinGoal: "وصلت لهدف البروتين لليوم! 💪",
        }
    }
};

export type Language = 'en' | 'fr' | 'ar';

export function translate(key: string, lang: Language, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
        value = value?.[k];
    }

    if (typeof value === 'string' && params) {
        return value.replace(/{(\w+)}/g, (_, k) => params[k] ?? `{${k}}`);
    }

    return value || key;
}
