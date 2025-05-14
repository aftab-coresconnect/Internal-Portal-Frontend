import React from 'react';
import { Flex, Heading, HStack, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import AnimatedButton from '../ui/AnimatedButton';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps extends BoxProps {
  title: string;
  showBackButton?: boolean;
  backButtonLink?: string;
  actionButtons?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBackButton = true,
  backButtonLink,
  actionButtons,
  ...rest
}) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const handleBack = () => {
    if (backButtonLink) {
      navigate(backButtonLink);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        bg={bgColor}
        p={5}
        borderRadius="lg"
        boxShadow="sm"
        {...rest}
      >
        <Flex align="center">
          {showBackButton && (
            <AnimatedButton
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              mr={4}
              onClick={handleBack}
              size="sm"
            >
              Back
            </AnimatedButton>
          )}
          <Heading 
            size="lg"
            bgGradient="linear(to-r, brand.500, accent.500)"
            bgClip="text"
          >
            {title}
          </Heading>
        </Flex>
        
        {actionButtons && (
          <HStack spacing={3}>
            {actionButtons}
          </HStack>
        )}
      </Flex>
    </motion.div>
  );
};

export default PageHeader; 