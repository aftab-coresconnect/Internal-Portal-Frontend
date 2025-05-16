import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  VStack,
  Progress,
  Badge,
  Flex,
  Icon,
  Button,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaProjectDiagram, FaUsers, FaClock, FaChartLine } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchProjects, Project } from '../../features/projects/projectSlice';
import Navbar from '../../components/layout/Navbar';
import { motion } from 'framer-motion';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const ProjectManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { projects, loading } = useAppSelector((state) => state.projects as ProjectState);
  
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  
  // Filter projects managed by this project manager
  const managedProjects = projects.filter(
    project => project.projectManager?._id === user?._id || project.projectManager === user?._id
  );
  
  // Calculate some metrics
  const activeProjects = managedProjects.filter(p => p.status === 'Active');
  const completedProjects = managedProjects.filter(p => p.status === 'Completed' || p.status === 'Delivered');
  const onTrackProjects = managedProjects.filter(p => {
    const deadline = new Date(p.deadline);
    const now = new Date();
    const daysRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return daysRemaining > 0 && (p.progressPercent || 0) >= (100 - (daysRemaining * 5));
  });
  
  const overallProgress = managedProjects.length > 0 
    ? Math.round(managedProjects.reduce((sum, p) => sum + (p.progressPercent || 0), 0) / managedProjects.length) 
    : 0;

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
  
  // Get priority color for display
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={2} bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text">
              Project Manager Dashboard
            </Heading>
            <Text color="gray.600">
              {user?.name} - Manage your projects and team efficiently
            </Text>
          </Box>
          
          <Divider />
          
          {/* Key Metrics */}
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
                  <StatNumber fontSize="3xl">{managedProjects.length}</StatNumber>
                  <StatHelpText>Assigned to you</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="green.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaUsers} color="white" />
                    </Box>
                    <StatLabel>Active Projects</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{activeProjects.length}</StatNumber>
                  <StatHelpText>Currently in progress</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="teal.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaClock} color="white" />
                    </Box>
                    <StatLabel>On Track</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{onTrackProjects.length}</StatNumber>
                  <StatHelpText>Projects on schedule</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="purple.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaChartLine} color="white" />
                    </Box>
                    <StatLabel>Completed</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{completedProjects.length}</StatNumber>
                  <StatHelpText>Successfully delivered</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
          
          {/* Projects Overview */}
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Active Projects</Heading>
                <Button 
                  colorScheme="brand" 
                  size="sm"
                  onClick={() => navigate('/user-dashboard/projects')}
                >
                  View All Projects
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Center py={6}>
                  <Spinner color="brand.500" size="lg" />
                </Center>
              ) : activeProjects.length === 0 ? (
                <Center py={6}>
                  <Text color="gray.500">No active projects found</Text>
                </Center>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Project</Th>
                      <Th>Client</Th>
                      <Th>Deadline</Th>
                      <Th>Priority</Th>
                      <Th>Progress</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {activeProjects.map(project => (
                      <Tr key={project._id} 
                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                        onClick={() => navigate(`/admin-dashboard/projects/${project._id}`)}
                      >
                        <Td fontWeight="medium">{project.title}</Td>
                        <Td>{project.clientName || '-'}</Td>
                        <Td>{formatDate(project.deadline)}</Td>
                        <Td>
                          <Badge colorScheme={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </Td>
                        <Td>
                          <Box w="100px">
                            <Progress 
                              value={project.progressPercent || 0} 
                              colorScheme={getStatusColor(project.status)} 
                              size="sm"
                              borderRadius="full"
                            />
                          </Box>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
          
          {/* Team Management */}
          <Card>
            <CardHeader>
              <Heading size="md">Team Management</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Heading size="sm" mb={4}>Resource Allocation</Heading>
                  <VStack spacing={4} align="stretch">
                    <Button colorScheme="blue" onClick={() => navigate('/user-dashboard/team')}>
                      Manage Team Members
                    </Button>
                    <Button colorScheme="teal" onClick={() => navigate('/user-dashboard/assignments')}>
                      Task Assignments
                    </Button>
                  </VStack>
                </Box>
                
                <Box>
                  <Heading size="sm" mb={4}>Communication Hub</Heading>
                  <VStack spacing={4} align="stretch">
                    <Button colorScheme="purple" onClick={() => navigate('/user-dashboard/messages')}>
                      Team Messages
                    </Button>
                    <Button colorScheme="orange" onClick={() => navigate('/user-dashboard/meetings')}>
                      Schedule Meeting
                    </Button>
                  </VStack>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default ProjectManagerDashboard; 