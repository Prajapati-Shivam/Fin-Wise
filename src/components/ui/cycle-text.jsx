'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { features } from '@/app/constants/features';

export default function CycleText() {
  const words = features;
  const [index, setIndex] = useState(0);

  const total = words.length;
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 1300);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <span>
      <AnimatePresence mode='wait'>
        <motion.p
          key={`words_${index}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.08 }}
        >
          {words[index]}
        </motion.p>
      </AnimatePresence>
    </span>
  );
}
