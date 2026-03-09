"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Armchair } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeatMapProps {
    selectedSeat: string;
    onSelect: (seat: string) => void;
    occupiedSeats?: string[];
    rows?: number;
}

const SeatMap: React.FC<SeatMapProps> = ({
    selectedSeat,
    onSelect,
    occupiedSeats = ['1A', '3F', '5B', '10C', '12E'],
    rows = 20
}) => {
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
        <div className="bg-secondary/30 p-6 rounded-3xl border border-border overflow-hidden">
            <div className="flex flex-col items-center">
                {/* Cockpit Area */}
                <div className="w-32 h-16 bg-muted rounded-t-full mb-12 flex items-center justify-center border-t-4 border-primary/20">
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Cockpit</span>
                </div>

                {/* Seat Grid */}
                <div className="grid gap-y-4">
                    {Array.from({ length: rows }).map((_, rowIndex) => {
                        const rowNum = rowIndex + 1;
                        return (
                            <div key={rowNum} className="flex items-center gap-4">
                                {/* Left Side (A, B, C) */}
                                <div className="flex gap-2">
                                    {cols.slice(0, 3).map((col) => {
                                        const id = `${rowNum}${col}`;
                                        const isOccupied = occupiedSeats.includes(id);
                                        const isSelected = selectedSeat === id;

                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                disabled={isOccupied}
                                                onClick={() => onSelect(id)}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all relative group",
                                                    isOccupied
                                                        ? "bg-muted cursor-not-allowed opacity-50"
                                                        : isSelected
                                                            ? "sky-gradient text-white shadow-lg scale-110 z-10"
                                                            : "bg-background border-2 border-border hover:border-primary/50"
                                                )}
                                                title={isOccupied ? "Occupied" : `Seat ${id}`}
                                            >
                                                <Armchair className={cn("w-4 h-4", isOccupied ? "text-muted-foreground" : isSelected ? "text-white" : "text-primary/40")} />
                                                {!isOccupied && !isSelected && (
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                        {id}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Aisle */}
                                <div className="w-8 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-muted-foreground/30">{rowNum}</span>
                                </div>

                                {/* Right Side (D, E, F) */}
                                <div className="flex gap-2">
                                    {cols.slice(3).map((col) => {
                                        const id = `${rowNum}${col}`;
                                        const isOccupied = occupiedSeats.includes(id);
                                        const isSelected = selectedSeat === id;

                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                disabled={isOccupied}
                                                onClick={() => onSelect(id)}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all relative group",
                                                    isOccupied
                                                        ? "bg-muted cursor-not-allowed opacity-50"
                                                        : isSelected
                                                            ? "sky-gradient text-white shadow-lg scale-110 z-10"
                                                            : "bg-background border-2 border-border hover:border-primary/50"
                                                )}
                                                title={isOccupied ? "Occupied" : `Seat ${id}`}
                                            >
                                                <Armchair className={cn("w-4 h-4", isOccupied ? "text-muted-foreground" : isSelected ? "text-white" : "text-primary/40")} />
                                                {!isOccupied && !isSelected && (
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                        {id}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-12 flex justify-center gap-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-background border-2 border-border" />
                    <span className="text-xs text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded sky-gradient" />
                    <span className="text-xs text-muted-foreground">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted opacity-50" />
                    <span className="text-xs text-muted-foreground">Occupied</span>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
