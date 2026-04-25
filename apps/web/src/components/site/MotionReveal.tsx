"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  y = 28,
}: MotionRevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
