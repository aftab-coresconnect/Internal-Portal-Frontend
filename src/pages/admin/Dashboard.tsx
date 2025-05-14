import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Container,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../features/auth/authActions';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navigateToProjects = () => {
    navigate('/admin-dashboard/projects');
  };
  
  const navigateToClients = () => {
    navigate('/admin-dashboard/clients');
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Flex
        as="header"
        bg="blue.600"
        color="white"
        p={4}
        alignItems="center"
        justifyContent="space-between"
        boxShadow="md"
      >
        <Heading size="md">Internal Portal - Admin Dashboard</Heading>
        <HStack spacing={4}>
          <Text>Welcome, {user?.name || 'Admin'}</Text>
          <Button
            variant="outline"
            _hover={{ bg: 'blue.500' }}
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </HStack>
      </Flex>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>
              Welcome to Admin Dashboard
            </Heading>
            <Text color="gray.600">
              Manage your organization, users, and resources from this central interface.
            </Text>
          </Box>

          <Divider />

          <StatGroup>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>25</StatNumber>
              <Text color="gray.500">Active developers</Text>
            </Stat>
            <Stat>
              <StatLabel>Active Projects</StatLabel>
              <StatNumber>12</StatNumber>
              <Text color="gray.500">In progress</Text>
            </Stat>
            <Stat>
              <StatLabel>Clients</StatLabel>
              <StatNumber>8</StatNumber>
              <Text color="gray.500">Active accounts</Text>
            </Stat>
          </StatGroup>

          <Divider />

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <GridItem 
              w="100%" 
              bg="white" 
              p={5} 
              borderRadius="md" 
              boxShadow="sm" 
              _hover={{ boxShadow: "md" }}
              cursor="pointer"
            >
              <VStack spacing={3} align="center">
                <Box boxSize={10} bg="blue.500" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                  <Text color="white" fontWeight="bold">U</Text>
                </Box>
                <Heading size="md">Manage Users</Heading>
                <Text textAlign="center">
                  Add, edit, or remove users and manage their permissions.
                </Text>
              </VStack>
            </GridItem>
            <GridItem 
              w="100%" 
              bg="white" 
              p={5} 
              borderRadius="md" 
              boxShadow="sm" 
              _hover={{ boxShadow: "md" }}
              cursor="pointer"
              onClick={navigateToProjects}
            >
              <VStack spacing={3} align="center">
                <Box boxSize={10} bg="green.500" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                  <Text color="white" fontWeight="bold">P</Text>
                </Box>
                <Heading size="md">Projects</Heading>
                <Text textAlign="center">
                  Create and assign projects to teams and track their progress.
                </Text>
              </VStack>
            </GridItem>
            <GridItem 
              w="100%" 
              bg="white" 
              p={5} 
              borderRadius="md" 
              boxShadow="sm" 
              _hover={{ boxShadow: "md" }}
              cursor="pointer"
              onClick={navigateToClients}
            >
              <VStack spacing={3} align="center">
                <Box boxSize={10} bg="orange.500" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                  <Text color="white" fontWeight="bold">C</Text>
                </Box>
                <Heading size="md">Clients</Heading>
                <Text textAlign="center">
                  Manage clients, contact information, and linked projects.
                </Text>
              </VStack>
            </GridItem>
            <GridItem 
              w="100%" 
              bg="white" 
              p={5} 
              borderRadius="md" 
              boxShadow="sm" 
              _hover={{ boxShadow: "md" }}
              cursor="pointer"
            >
              <VStack spacing={3} align="center">
                <Box boxSize={10} bg="purple.500" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                  <Text color="white" fontWeight="bold">R</Text>
                </Box>
                <Heading size="md">Reports</Heading>
                <Text textAlign="center">
                  View analytics and generate reports on performance and activities.
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 