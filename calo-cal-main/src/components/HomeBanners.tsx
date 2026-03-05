import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
    {
        id: 1,
        image: '/banners/banner-1.jpg', // User will add these
        title: 'Discover Tunisian Flavors',
        subtitle: 'Track traditional dishes with AI'
    },
    {
        id: 2,
        image: '/banners/banner-2.jpg',
        title: 'Reach Your Goals',
        subtitle: 'Smart tracking, real results'
    },
    {
        id: 3,
        image: '/banners/banner-3.jpg',
        title: 'AI-Powered Recognition',
        subtitle: 'Just snap and track instantly'
    }
]

export default function HomeBanners() {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto-slide every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden 
                    bg-gradient-to-r from-[#F5C518] to-yellow-500 shadow-md">
            {/* Banner Images */}
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="min-w-full h-full relative flex-shrink-0"
                    >
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback gradient if image fails
                                (e.target as HTMLElement).style.display = 'none'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t 
                            from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-xl font-bold mb-1">
                                {banner.title}
                            </h3>
                            <p className="text-sm opacity-90">
                                {banner.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 
                      flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50 w-2'
                            }`}
                    />
                ))}
            </div>

            {/* Optional: Manual Navigation Arrows */}
            <button
                onClick={() => setCurrentIndex((prev) =>
                    prev === 0 ? banners.length - 1 : prev - 1
                )}
                className="absolute left-2 top-1/2 -translate-y-1/2 
                   w-8 h-8 rounded-full bg-white/20 backdrop-blur z-10
                   flex items-center justify-center text-white
                   hover:bg-white/40 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <button
                onClick={() => setCurrentIndex((prev) =>
                    (prev + 1) % banners.length
                )}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                   w-8 h-8 rounded-full bg-white/20 backdrop-blur z-10
                   flex items-center justify-center text-white
                   hover:bg-white/40 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    )
}
