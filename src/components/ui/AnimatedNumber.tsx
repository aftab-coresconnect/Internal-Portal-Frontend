import React, { useState, useEffect, useRef } from 'react';
import { Text, TextProps } from '@chakra-ui/react';

interface AnimatedNumberProps extends TextProps {
  value: number;
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  delay = 0,
  formatter = (val) => val.toString(),
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startAnimation = () => {
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          startAnimating();
        }, delay);
        return () => clearTimeout(timeoutId);
      } else {
        startAnimating();
        return () => {
          // Empty cleanup function
        };
      }
    };

    const startAnimating = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTime.current = null;
      animationRef.current = requestAnimationFrame(animateNumber);
    };

    const animateNumber = (timestamp: number) => {
      if (!startTime.current) {
        startTime.current = timestamp;
      }

      const elapsedTime = timestamp - startTime.current;
      const progress = Math.min(elapsedTime / duration, 1);
      
      if (progress < 1) {
        const nextValue = Math.floor(progress * value);
        setDisplayValue(nextValue);
        animationRef.current = requestAnimationFrame(animateNumber);
      } else {
        setDisplayValue(value);
      }
    };

    const cleanup = startAnimation();
    
    return () => {
      cleanup();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, delay]);

  return <Text {...rest}>{formatter(displayValue)}</Text>;
};

export default AnimatedNumber; 