import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';
import { listItemVariants } from '../../utils/animations';

interface AnimatedListProps {
  children: ReactNode[];
  staggerDelay?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({ 
  children, 
  staggerDelay = 0.05 
}) => {
  return (
    <Box>
      <AnimatePresence>
        {children.map((child, index) => (
          <Box
            key={index}
            as={motion.div}
            custom={index}
            initial="hidden"
            animate="visible"
            exit="removed"
            variants={listItemVariants}
          >
            {child}
          </Box>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default AnimatedList; 