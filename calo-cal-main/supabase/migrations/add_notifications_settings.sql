ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notifications_settings 
  jsonb DEFAULT '{
    "breakfastReminder": { 
      "enabled": true, "time": "07:30" 
    },
    "lunchReminder": { 
      "enabled": true, "time": "12:30" 
    },
    "dinnerReminder": { 
      "enabled": false, "time": "19:30" 
    },
    "weeklyReports": true,
    "nutritionTips": false,
    "hydrationReminders": true
  }'::jsonb;
