import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CrmStageTrackerProps {
    stages: string[];
    currentStage: string;
    onStageClick?: (stage: string) => void;
    className?: string;
}

export function CrmStageTracker({ stages, currentStage, onStageClick, className }: CrmStageTrackerProps) {
    const currentIndex = stages.indexOf(currentStage);

    return (
        <div className={cn("w-full overflow-x-auto", className)}>
            <div className="flex items-center min-w-max">
                {stages.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isFuture = index > currentIndex;

                    return (
                        <div
                            key={stage}
                            className={cn(
                                "flex items-center relative group cursor-pointer",
                                index !== stages.length - 1 && "flex-1"
                            )}
                            onClick={() => onStageClick?.(stage)}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors z-10",
                                isCompleted && "bg-primary border-primary text-primary-foreground",
                                isCurrent && "bg-background border-primary text-primary",
                                isFuture && "bg-background border-muted text-muted-foreground"
                            )}>
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-xs font-medium">{index + 1}</span>
                                )}
                            </div>

                            {/* Label */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {stage}
                            </div>

                            {/* Connector Line */}
                            {index !== stages.length - 1 && (
                                <div className={cn(
                                    "h-0.5 flex-1 mx-2 transition-colors",
                                    index < currentIndex ? "bg-primary" : "bg-muted"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
