import React from 'react';
import { Box, Heading, Text, Container, Button, VStack } from '@chakra-ui/react';

const HomePage: React.FC = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl" textAlign="center">
          Internal Portal
        </Heading>
        <Text fontSize="xl" textAlign="center">
          A comprehensive MERN stack application for managing projects, tracking developer performance, and integrating with external tools
        </Text>
        <Box>
          <Button colorScheme="blue" size="lg">
            Get Started
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default HomePage; 