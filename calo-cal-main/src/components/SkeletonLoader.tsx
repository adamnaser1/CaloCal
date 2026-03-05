import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | 'circle' | 'chart';
    width?: string;
    height?: string;
    count?: number;
    className?: string;
}

export function SkeletonLoader({
    variant = 'card',
    width,
    height,
    count = 1,
    className
}: SkeletonLoaderProps) {
    const renderSkeleton = (index: number) => {
        let baseClasses = "animate-pulse bg-muted";

        switch (variant) {
            case 'card':
                baseClasses = cn(baseClasses, "rounded-2xl w-full h-24");
                break;
            case 'text':
                baseClasses = cn(baseClasses, "rounded-full w-3/4 h-4");
                break;
            case 'circle':
                baseClasses = cn(baseClasses, "rounded-full w-12 h-12");
                break;
            case 'chart':
                baseClasses = cn(baseClasses, "rounded-2xl w-full h-48");
                break;
        }

        // Apply overrides
        const style = {
            width,
            height
        };

        return (
            <div
                key={index}
                className={cn(baseClasses, className)}
                style={style as React.CSSProperties}
            />
        );
    };

    if (count === 1) return renderSkeleton(0);

    return (
        <div className="flex flex-col gap-3 w-full">
            {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
        </div>
    );
}
