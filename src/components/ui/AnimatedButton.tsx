import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@chakra-ui/react';
import { buttonVariants } from '../../utils/animations';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  ...rest 
}) => {
  return (
    <Button
      as={motion.button}
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default AnimatedButton; 