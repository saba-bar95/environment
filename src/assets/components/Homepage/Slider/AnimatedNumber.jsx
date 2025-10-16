import { useState, useEffect, useRef } from "react";

const AnimatedNumber = ({ targetValue, duration = 3000 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let startTime;

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easedPercentage = easeOutExpo(percentage);

      if (percentage >= 1) {
        // Force exact final value to avoid any rounding/precision discrepancies
        setAnimatedValue(targetValue);
        return;
      }

      // Use Math.round for proper rounding to 2 decimals
      const calculatedValue =
        Math.round(easedPercentage * targetValue * 100) / 100;

      setAnimatedValue(calculatedValue);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration]);

  return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1 }).format(
    animatedValue
  );
};

export default AnimatedNumber;
