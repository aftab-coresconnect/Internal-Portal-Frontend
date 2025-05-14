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
  Icon,
} from '@chakra-ui/react';
import { FaProjectDiagram, FaTasks, FaUsers } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../features/auth/authActions';
import Navbar from '../../components/layout/Navbar';
import { motion } from 'framer-motion';
import { fadeInVariants } from '../../utils/animations';

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
      <Navbar />
      
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch" as={motion.div} initial="hidden" animate="visible" variants={fadeInVariants}>
          <Box>
            <Heading size="lg" mb={2} bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text">
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
                        <Icon as={FaProjectDiagram} color="white" fontSize="xs" />
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
                        <Icon as={FaTasks} color="white" fontSize="xs" />
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
                  <Divider my={2} />
                  <Box display="flex" justifyContent="center">
                    <Button 
                      size="sm" 
                      colorScheme="purple" 
                      variant="outline"
                      onClick={() => navigate('/user-dashboard/tasks')}
                    >
                      View All Tasks
                    </Button>
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
                    <Icon as={FaUsers} color="white" fontSize="xs" />
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