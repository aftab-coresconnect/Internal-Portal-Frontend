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
} from '@chakra-ui/react';
import { FaProjectDiagram, FaTasks, FaUsers } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../features/auth/authActions';
import { fetchUserProjects } from '../../features/projects/projectSlice';
import { fetchUserMilestones } from '../../features/milestones/milestoneSlice';
import Navbar from '../../components/layout/Navbar';
import { motion } from 'framer-motion';
import { fadeInVariants } from '../../utils/animations';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAppSelector((state) => state.auth);
  const { userProjects, loading: projectsLoading } = useAppSelector((state) => state.projects);
  const { userMilestones, loading: milestonesLoading } = useAppSelector((state) => state.milestones);

  // Fetch user data on component mount
  useEffect(() => {
    dispatch(fetchUserProjects());
    dispatch(fetchUserMilestones());
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Get status color for display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'In Progress':
        return 'green';
      case 'Paused':
        return 'yellow';
      case 'Not Started':
        return 'blue';
      case 'Completed':
        return 'teal';
      case 'Delivered':
        return 'purple';
      case 'Delayed':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Format date for display without external library
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
                  <Badge colorScheme="teal">{userProjects.length} Assigned</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                {projectsLoading ? (
                  <Center py={4}>
                    <Spinner color="brand.500" size="md" />
                  </Center>
                ) : userProjects.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No projects assigned yet.
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
                            onClick={() => navigate('/user-dashboard/projects')}
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
                        <Icon as={FaTasks} color="white" fontSize="xs" />
                      </Box>
                      <Text>My Tasks</Text>
                    </HStack>
                  </Heading>
                  <Badge colorScheme="purple">{userMilestones.length} Assigned</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                {milestonesLoading ? (
                  <Center py={4}>
                    <Spinner color="brand.500" size="md" />
                  </Center>
                ) : userMilestones.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No tasks assigned yet.
                  </Text>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {userMilestones.slice(0, 4).map((milestone) => (
                      <Box key={milestone._id}>
                        <Flex justify="space-between">
                          <Text fontWeight="bold">{milestone.title}</Text>
                          <Badge colorScheme={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                        </Flex>
                        <Text fontSize="sm" color="gray.500">
                          {milestone.project && 
                           typeof milestone.project === 'object' && 
                           milestone.project !== null &&
                           'title' in milestone.project
                             ? String((milestone.project as {title: string}).title) 
                             : 'Unknown Project'}
                        </Text>
                      </Box>
                    ))}
                    {userMilestones.length > 4 && (
                      <>
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
                      </>
                    )}
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
                    <Icon as={FaUsers} color="white" fontSize="xs" />
                  </Box>
                  <Text>Team Activity</Text>
                </HStack>
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>You have {userProjects.length} active projects and {userMilestones.length} assigned tasks.</Text>
                <Text>
                  {userMilestones.filter(m => m.status === 'Not Started').length} tasks waiting to start, {' '}
                  {userMilestones.filter(m => m.status === 'In Progress').length} in progress,
                  and {userMilestones.filter(m => m.status === 'Completed').length} completed.
                </Text>
                <Text>
                  Upcoming deadline: {userMilestones.length > 0 
                    ? formatDate(userMilestones.sort((a, b) => 
                        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                      )[0].dueDate) 
                    : 'None'
                  }
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 