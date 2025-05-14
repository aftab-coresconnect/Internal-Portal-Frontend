import React, { useState, useEffect } from 'react';
import { Box, Text, BoxProps } from '@chakra-ui/react';

interface AnimatedNumberInputProps extends BoxProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}

const AnimatedNumberInput: React.FC<AnimatedNumberInputProps> = ({
  value,
  duration = 1000,
  formatter = (val) => val.toString(),
  fontSize = "2xl",
  fontWeight = "bold",
  color = "brand.500",
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startValue = displayValue;
    const endValue = value;
    const difference = endValue - startValue;
    const steps = 20;
    const increment = difference / steps;
    
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const newValue = startValue + (increment * step);
      
      if (step >= steps) {
        setDisplayValue(endValue);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.round(newValue));
      }
    }, duration / steps);
    
    return () => {
      clearInterval(interval);
    };
  }, [value, duration]);

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="all 0.3s"
      {...rest}
    >
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
      >
        {formatter(displayValue)}
      </Text>
    </Box>
  );
};

export default AnimatedNumberInput; 