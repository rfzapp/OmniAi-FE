"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider"; // maybe not strictly needed if we enforce #0A0A0A

type ModelName = "Luna" | "Sol" | "Terra";

interface ThinkingAnimationProps {
    model?: ModelName;
}

const MODEL_CONFIG = {
    Luna: {
        color: "#3B82F6",
        mood: "Calm",
        statusText: "Understanding your request...",
        pulseDuration: 3,
        orbitDuration: 4,
        ring: false,
        particles: 3,
    },
    Sol: {
        color: "#F59E0B",
        mood: "Fast",
        statusText: "Exploring possibilities...",
        pulseDuration: 2,
        orbitDuration: 2.5,
        ring: false,
        particles: 5,
    },
    Terra: {
        color: "#10B981",
        mood: "Stable",
        statusText: "Analyzing deeply...",
        pulseDuration: 4,
        orbitDuration: 6,
        ring: true,
        particles: 2,
    },
};

export function ThinkingAnimation({ model = "Luna" }: ThinkingAnimationProps) {
    const config = MODEL_CONFIG[model] || MODEL_CONFIG.Luna;
    const activeModelName = MODEL_CONFIG[model] ? model : "Luna";

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(4px)", scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-row items-center gap-6 py-2 px-1 text-[#111111]"
        >
            <div className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-medium text-[#111111]">{model} is thinking...</span>
                <motion.span
                    className="text-xs text-[#6B7280]"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: config.pulseDuration, repeat: Infinity, ease: "easeInOut" }}
                >
                    {config.statusText}
                </motion.span>
            </div>

            <div className="relative mt-2 flex h-8 w-8 items-center justify-center">
                {/* Ambient Glow */}
                <motion.div
                    className="absolute inset-0 rounded-full blur-[8px]"
                    style={{ backgroundColor: config.color }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                        duration: config.pulseDuration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Core Orb */}
                <motion.div
                    className="absolute h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.color, boxShadow: `0 0 10px ${config.color}` }}
                    animate={{
                        scale: [1, 1.15, 1]
                    }}
                    transition={{
                        duration: config.pulseDuration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Optional Ring for Terra */}
                {config.ring && (
                    <motion.div
                        className="absolute h-6 w-6 rounded-full border border-opacity-40"
                        style={{ borderColor: config.color }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: config.orbitDuration * 2, repeat: Infinity, ease: "linear" }}
                    />
                )}

                {/* Orbiting Particles */}
                <motion.div
                    className="absolute flex h-full w-full items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: config.orbitDuration, repeat: Infinity, ease: "linear" }}
                >
                    {Array.from({ length: config.particles }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-1 w-1 rounded-full"
                            style={{ backgroundColor: config.color }}
                            initial={{
                                x: Math.cos((i * 2 * Math.PI) / config.particles) * 12,
                                y: Math.sin((i * 2 * Math.PI) / config.particles) * 12,
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: config.pulseDuration / 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}
