import React from 'react';
import { IconButton, IconButtonProps, Tooltip, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

interface FloatingActionButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  tooltipLabel?: string;
  icon?: React.ReactElement;
  size?: string;
  bottom?: string | number;
  right?: string | number;
  zIndex?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  tooltipLabel = 'Add New',
  icon = <FaPlus />,
  size = 'lg',
  colorScheme = 'brand',
  bottom = '6',
  right = '6',
  zIndex = 10,
  ...rest
}) => {
  return (
    <Tooltip label={tooltipLabel} placement="left">
      <Box
        position="fixed"
        bottom={bottom}
        right={right}
        zIndex={zIndex}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 260,
            damping: 20
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 } 
          }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            size={size}
            icon={icon}
            isRound
            colorScheme={colorScheme}
            boxShadow="lg"
            aria-label={tooltipLabel}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'xl',
            }}
            {...rest}
          />
        </motion.div>
      </Box>
    </Tooltip>
  );
};

export default FloatingActionButton; 