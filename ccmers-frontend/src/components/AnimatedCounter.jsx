import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const spring = useSpring(0, { duration: 1500, bounce: 0 });
  const display = useTransform(spring, (current) => Math.floor(current));

  useEffect(() => {
    spring.set(value);
    setHasAnimated(true);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export default AnimatedCounter;
