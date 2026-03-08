import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackScreen() {
    const navigate = useNavigate()

    useEffect(() => {
        // Handle the OAuth callback
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                // Check if user completed onboarding
                supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data }) => {
                        if (data?.onboarding_completed) {
                            navigate('/', { replace: true })
                        } else {
                            navigate('/onboarding/goal', { replace: true })
                        }
                    })
            } else {
                navigate('/login', { replace: true })
            }
        })
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 
                        border-b-2 border-[#F5C518] mx-auto mb-4" />
                <p className="text-gray-600">Signing you in...</p>
            </div>
        </div>
    )
}
