import React from 'react';
import { Box, Heading, Text, Container, Button, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl" textAlign="center">
          Internal Portal
        </Heading>
        <Text fontSize="xl" textAlign="center">
          A comprehensive MERN stack application for managing projects, tracking developer performance, and integrating with external tools
        </Text>
        <Button 
          colorScheme="blue" 
          size="lg" 
          leftIcon={<FaSignInAlt />}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </VStack>
    </Container>
  );
};

export default HomePage; 