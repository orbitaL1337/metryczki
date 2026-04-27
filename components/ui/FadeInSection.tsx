"use client";

import { motion, useReducedMotion } from "framer-motion";

type FadeInVariant = "soft" | "dynamic";
type FadeInDirection = "up" | "left" | "right";

type FadeInSectionProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: FadeInVariant;
  direction?: FadeInDirection;
};

export default function FadeInSection({
  children,
  delay = 0,
  className,
  variant = "soft",
  direction = "up",
}: FadeInSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const isDynamic = variant === "dynamic";
  const initialX = shouldReduceMotion ? 0 : direction === "left" ? -24 : direction === "right" ? 24 : 0;
  const initialY = shouldReduceMotion ? 0 : isDynamic ? 28 : 16;
  const initialScale = shouldReduceMotion ? 1 : isDynamic ? 0.94 : 1;
  const initialRotate = shouldReduceMotion
    ? 0
    : isDynamic
      ? direction === "left"
        ? -1.4
        : direction === "right"
          ? 1.4
          : 0
      : 0;

  const transition = shouldReduceMotion
    ? { duration: 0.2, delay }
    : isDynamic
      ? {
          x: { type: "spring", stiffness: 160, damping: 18, mass: 0.8, delay },
          y: { type: "spring", stiffness: 160, damping: 18, mass: 0.8, delay },
          scale: { type: "spring", stiffness: 180, damping: 14, mass: 0.7, delay },
          rotate: { type: "spring", stiffness: 140, damping: 16, mass: 0.8, delay },
          opacity: { duration: 0.36, ease: "easeOut", delay },
          filter: { duration: 0.5, ease: "easeOut", delay },
        }
      : { duration: 0.55, ease: "easeOut", delay };

  return (
    <motion.div
      className={className}
      style={shouldReduceMotion ? undefined : { willChange: "transform, opacity, filter" }}
      initial={{
        opacity: 0,
        x: initialX,
        y: initialY,
        scale: initialScale,
        rotate: initialRotate,
        filter: shouldReduceMotion ? "none" : isDynamic ? "blur(7px)" : "blur(4px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-90px 0px -120px 0px", amount: 0.18 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
