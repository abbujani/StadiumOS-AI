"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  suffix = "",
  prefix = ""
}) => {
  const { reducedMotion } = useApp();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // If the accessibility setting "Reduced Motion" is enabled, bypass count-up animations entirely
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out transition
      const easeProgress = progress * (2 - progress);
      const current = Math.round(easeProgress * (endValue - startValue) + startValue);
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value, duration, reducedMotion]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

export default AnimatedCounter;
