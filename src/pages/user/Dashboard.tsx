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
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Progress,
  Badge,
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
        <Heading size="md">Internal Portal - Developer Dashboard</Heading>
        <HStack spacing={4}>
          <Text>Welcome, {user?.name || 'Developer'}</Text>
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
              Welcome to Your Dashboard
            </Heading>
            <Text color="gray.600">
              View your projects, tasks, and team activities in one place.
            </Text>
          </Box>

          <Divider />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">
                    <HStack>
                      <Box bg="teal.500" w={6} h={6} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                        <Text fontSize="xs" color="white" fontWeight="bold">P</Text>
                      </Box>
                      <Text>My Projects</Text>
                    </HStack>
                  </Heading>
                  <Badge colorScheme="teal">3 Active</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Internal Portal App</Text>
                      <Badge colorScheme="green">In Progress</Badge>
                    </Flex>
                    <Progress value={65} colorScheme="teal" mt={2} />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Due: 15 June 2023
                    </Text>
                  </Box>
                  <Box>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">API Integration</Text>
                      <Badge colorScheme="yellow">Planning</Badge>
                    </Flex>
                    <Progress value={25} colorScheme="yellow" mt={2} />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Due: 30 June 2023
                    </Text>
                  </Box>
                  <Box>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Performance Optimization</Text>
                      <Badge colorScheme="blue">Starting</Badge>
                    </Flex>
                    <Progress value={10} colorScheme="blue" mt={2} />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Due: 10 July 2023
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">
                    <HStack>
                      <Box bg="purple.500" w={6} h={6} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                        <Text fontSize="xs" color="white" fontWeight="bold">T</Text>
                      </Box>
                      <Text>My Tasks</Text>
                    </HStack>
                  </Heading>
                  <Badge colorScheme="purple">7 Pending</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Implement Authentication</Text>
                      <Badge colorScheme="green">Completed</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Internal Portal App
                    </Text>
                  </Box>
                  <Box>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Create Dashboard UI</Text>
                      <Badge colorScheme="green">Completed</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Internal Portal App
                    </Text>
                  </Box>
                  <Box>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Add Role Based Access</Text>
                      <Badge colorScheme="orange">In Progress</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Internal Portal App
                    </Text>
                  </Box>
                  <Box>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Design API Structure</Text>
                      <Badge colorScheme="red">Pending</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      API Integration
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardHeader>
              <Heading size="md">
                <HStack>
                  <Box bg="blue.500" w={6} h={6} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="xs" color="white" fontWeight="bold">T</Text>
                  </Box>
                  <Text>Team Activity</Text>
                </HStack>
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>Your team has 3 active projects and 15 pending tasks.</Text>
                <Text>Team performance is on track for Q2 goals.</Text>
                <Text>Next team meeting: Monday at 10:00 AM.</Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 