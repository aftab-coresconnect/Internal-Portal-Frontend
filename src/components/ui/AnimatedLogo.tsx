import React from 'react';
import { Box, Text, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

interface AnimatedLogoProps extends BoxProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'md', 
  color,
  ...rest 
}) => {
  // Size mapping for responsive sizes
  const sizeMap = {
    sm: { boxSize: '32px', fontSize: 'lg' },
    md: { boxSize: '40px', fontSize: 'xl' },
    lg: { boxSize: '48px', fontSize: '2xl' },
    xl: { boxSize: '56px', fontSize: '3xl' },
  };

  const { boxSize, fontSize } = sizeMap[size];
  const logoColor = useColorModeValue('brand.500', 'brand.300');
  const finalColor = color || logoColor;
  const pulseAnimation = `${pulse} 3s ease-in-out infinite`;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.1)' }}
      _active={{ transform: 'scale(0.95)' }}
      {...rest}
    >
      <Box
        width={boxSize}
        height={boxSize}
        borderRadius="lg"
        overflow="hidden"
        bg={finalColor}
        boxShadow="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        animation={pulseAnimation}
      >
        <Text
          color="white"
          fontWeight="bold"
          fontSize={fontSize}
        >
          IP
        </Text>
      </Box>
    </Box>
  );
};

export default AnimatedLogo; 