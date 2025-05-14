import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';
import { pageVariants } from '../../utils/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <Box 
      as={motion.div}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      width="100%"
    >
      {children}
    </Box>
  );
};

export default PageTransition; 