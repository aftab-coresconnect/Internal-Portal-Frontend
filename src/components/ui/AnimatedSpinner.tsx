import React from 'react';
import { motion } from 'framer-motion';
import { Box, Flex, Text, FlexProps, usePrefersReducedMotion } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

interface AnimatedSpinnerProps extends FlexProps {
  size?: string;
  color?: string;
  text?: string;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const AnimatedSpinner: React.FC<AnimatedSpinnerProps> = ({ 
  size = "50px", 
  color = "brand.500", 
  text,
  ...rest 
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const spinAnimation = prefersReducedMotion
    ? undefined
    : `${spin} 1s linear infinite`;
    
  const pulseAnimation = prefersReducedMotion
    ? undefined
    : `${pulse} 1.5s ease-in-out infinite`;

  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center"
      {...rest}
    >
      <Box
        width={size}
        height={size}
        border="4px solid"
        borderColor="gray.200"
        borderRadius="full"
        position="relative"
        animation={spinAnimation}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          borderRadius="full"
          border="4px solid transparent"
          borderTopColor={color}
        />
      </Box>
      
      {text && (
        <Text 
          mt={3} 
          fontSize="sm" 
          color="gray.500"
          animation={pulseAnimation}
        >
          {text}
        </Text>
      )}
    </Flex>
  );
};

export default AnimatedSpinner; 