import React, { useEffect } from 'react';
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
  Spinner,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FaProjectDiagram, FaRegStar, FaFileInvoiceDollar, FaComments } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { fetchUserProjects, Project } from '../../../features/projects/projectSlice';
import Navbar from '../../../components/layout/Navbar';
import { motion } from 'framer-motion';
import { fadeInVariants } from '../../../utils/animations';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userProjects, loading: projectsLoading } = useAppSelector((state) => state.projects);
  
  // Filter for delivered projects that can be rated
  const deliveredProjects = userProjects.filter(project => project.status === 'Delivered');
  const activeProjects = userProjects.filter(project => project.status === 'Active');

  // Fetch client's projects on component mount
  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);

  // Get status color for display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Paused':
        return 'yellow';
      case 'Completed':
        return 'teal';
      case 'Delivered':
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch" as={motion.div} initial="hidden" animate="visible" variants={fadeInVariants}>
          <Box>
            <Heading size="lg" mb={2} bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text">
              Client Portal
            </Heading>
            <Text color="gray.600">
              {user?.title ? user.title : 'Welcome to your client dashboard'} - View your projects, invoices, and provide feedback.
            </Text>
          </Box>

          <Divider />

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="blue.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaProjectDiagram} color="white" />
                    </Box>
                    <StatLabel>Total Projects</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{userProjects.length}</StatNumber>
                  <StatHelpText>All time</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="green.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaProjectDiagram} color="white" />
                    </Box>
                    <StatLabel>Active Projects</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">
                    {activeProjects.length}
                  </StatNumber>
                  <StatHelpText>Currently in progress</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="purple.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaRegStar} color="white" />
                    </Box>
                    <StatLabel>Feedback Needed</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{deliveredProjects.length}</StatNumber>
                  <StatHelpText>Projects awaiting feedback</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="orange.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaFileInvoiceDollar} color="white" />
                    </Box>
                    <StatLabel>Invoices</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">0</StatNumber>
                  <StatHelpText>Current due</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content */}
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
                  <Badge colorScheme="teal">{userProjects.length} Total</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                {projectsLoading ? (
                  <Center py={4}>
                    <Spinner color="brand.500" size="md" />
                  </Center>
                ) : userProjects.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No projects found.
                  </Text>
                ) : (
                <VStack spacing={4} align="stretch">
                    {userProjects.slice(0, 3).map((project) => (
                      <Box key={project._id}>
                        <Flex justify="space-between">
                          <Text fontWeight="bold">{project.title}</Text>
                          <Badge colorScheme={getStatusColor(project.status)}>{project.status}</Badge>
                        </Flex>
                        <Progress 
                          value={project.progressPercent || 0} 
                          colorScheme={getStatusColor(project.status)} 
                          mt={2} 
                        />
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          Due: {formatDate(project.deadline)}
                        </Text>
                      </Box>
                    ))}
                    {userProjects.length > 3 && (
                      <Box mt={2}>
                        <Divider my={2} />
                        <Center>
                          <Button 
                            size="sm" 
                            colorScheme="teal" 
                            variant="outline"
                            onClick={() => navigate('/projects')}
                          >
                            View All Projects
                          </Button>
                        </Center>
                      </Box>
                    )}
                </VStack>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">
                    <HStack>
                      <Box bg="purple.500" w={6} h={6} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                        <Icon as={FaRegStar} color="white" fontSize="xs" />
                      </Box>
                      <Text>Awaiting Feedback</Text>
                    </HStack>
                  </Heading>
                  <Badge colorScheme="purple">{deliveredProjects.length}</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                {projectsLoading ? (
                  <Center py={4}>
                    <Spinner color="brand.500" size="md" />
                  </Center>
                ) : deliveredProjects.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No projects awaiting feedback.
                  </Text>
                ) : (
                <VStack spacing={4} align="stretch">
                    {deliveredProjects.map((project) => (
                      <Box key={project._id}>
                        <Flex justify="space-between">
                          <Text fontWeight="bold">{project.title}</Text>
                          <Badge colorScheme="purple">Delivered</Badge>
                        </Flex>
                        <Text fontSize="sm" color="gray.500">
                          Delivered on: {formatDate(project.updatedAt || '')}
                        </Text>
                        <Button 
                          size="sm" 
                          colorScheme="purple" 
                          mt={2}
                          onClick={() => navigate(`/projects/${project._id}`)}
                        >
                          Rate Project
                        </Button>
                      </Box>
                    ))}
                </VStack>
                )}
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardHeader>
              <Heading size="md">
                <HStack>
                  <Box bg="blue.500" w={6} h={6} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                    <Icon as={FaComments} color="white" fontSize="xs" />
                  </Box>
                  <Text>Communication Hub</Text>
                </HStack>
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>Have questions about your projects? Need to request changes or updates?</Text>
                <Button 
                  colorScheme="blue" 
                  leftIcon={<FaComments />}
                  onClick={() => navigate('/contact')}
                >
                  Contact Your Project Manager
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default ClientDashboard; 