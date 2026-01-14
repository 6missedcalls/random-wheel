import { Variants } from 'framer-motion';

// Page/Container entrance
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

// Individual item entrance
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// Scale in (for buttons, cards)
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 },
  },
};

// Result reveal (dramatic)
export const resultRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// Pulse (for attention)
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Segment list item (for reordering)
export const segmentItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.15 },
  },
};
