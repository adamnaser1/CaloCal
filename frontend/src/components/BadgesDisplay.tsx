import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/services/authService'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlocked_at: string
}

export default function BadgesDisplay() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  
  useEffect(() => {
    loadBadges()
  }, [])
  
  const loadBadges = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return;
      
      const { data } = await supabase
        .from('user_badges')
        .select(`
          id,
          unlocked_at,
          badges (
            name,
            icon,
            description
          )
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })
      
      if (data) {
        setBadges(data.map(item => ({
          id: item.id,
          // Handle Supabase relationships that might be returned as an array or object
          name: Array.isArray(item.badges) ? item.badges[0]?.name : (item.badges as any)?.name,
          icon: Array.isArray(item.badges) ? item.badges[0]?.icon : (item.badges as any)?.icon,
          description: Array.isArray(item.badges) ? item.badges[0]?.description : (item.badges as any)?.description,
          unlocked_at: item.unlocked_at
        })))
      }
    } catch (error) {
      console.error('Error loading badges:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#F5C518] border-t-transparent 
                      rounded-full animate-spin" />
      </div>
    )
  }
  
  if (badges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No badges yet. Keep tracking to unlock achievements! 🏆</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl 
                   shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 aspect-square"
        >
          <div className="text-4xl mb-3 flex-1 flex items-center justify-center">{badge.icon || '🏅'}</div>
          <div className="h-10 flex items-center justify-center">
             <h4 className="font-semibold text-xs text-center text-gray-900 dark:text-white line-clamp-2">{badge.name || 'Achievement'}</h4>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
            {new Date(badge.unlocked_at).toLocaleDateString()}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
