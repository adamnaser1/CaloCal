import React from 'react';

interface Action {
    label: string;
    onClick: () => void;
}

interface EmptyStateProps {
    emoji: string;
    title: string;
    subtitle: string;
    primaryAction?: Action;
    secondaryAction?: Action;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    emoji,
    title,
    subtitle,
    primaryAction,
    secondaryAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F5C518]/20">
                <span className="text-5xl">{emoji}</span>
            </div>

            <h3 className="mt-6 font-display text-[22px] font-bold text-[#1A1A1A]">
                {title}
            </h3>

            <p className="mt-2 max-w-xs font-display text-sm text-gray-500">
                {subtitle}
            </p>

            {primaryAction && (
                <button
                    onClick={primaryAction.onClick}
                    className="mt-8 w-full rounded-full bg-[#F5C518] py-4 font-display font-bold text-black shadow-sm transition-transform active:scale-[0.98]"
                >
                    {primaryAction.label}
                </button>
            )}

            {secondaryAction && (
                <button
                    onClick={secondaryAction.onClick}
                    className="mt-3 w-full rounded-full border border-gray-200 bg-transparent py-3 font-display font-bold text-gray-600 transition-colors hover:bg-gray-50 active:scale-[0.98]"
                >
                    {secondaryAction.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
