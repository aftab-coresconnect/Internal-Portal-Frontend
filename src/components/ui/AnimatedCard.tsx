import React from 'react';
import { motion } from 'framer-motion';
import { Box, BoxProps } from '@chakra-ui/react';
import { cardVariants } from '../../utils/animations';

interface AnimatedCardProps extends BoxProps {
  children: React.ReactNode;
  delay?: number;
  animate?: boolean;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0,
  animate = true,
  onClick,
  ...rest 
}) => {
  return (
    <Box
      as={motion.div}
      initial={animate ? "initial" : false}
      animate={animate ? "visible" : false}
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      custom={delay}
      borderRadius="lg"
      boxShadow="card"
      overflow="hidden"
      bg="white"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default AnimatedCard; 