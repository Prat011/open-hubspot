import React from 'react';
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatisticsProps {
    label: string;
    value: string | number;
    trend?: {
        value: number;
        direction: 'increase' | 'decrease';
    };
    className?: string;
}

export function Statistics({ label, value, trend, className }: StatisticsProps) {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">{value}</span>
                {trend && (
                    <span className={cn(
                        "text-xs font-medium flex items-center",
                        trend.direction === 'increase' ? "text-emerald-600" : "text-red-600"
                    )}>
                        {trend.value}%
                        {trend.direction === 'increase' ? (
                            <ArrowUpRight className="h-3 w-3 ml-0.5" />
                        ) : (
                            <ArrowDownRight className="h-3 w-3 ml-0.5" />
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}
