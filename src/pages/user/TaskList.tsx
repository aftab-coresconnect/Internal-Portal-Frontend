import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Flex,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaSearch, FaCheck, FaHourglass } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { fetchUserMilestones, updateMilestone } from '../../features/milestones/milestoneSlice';
import Navbar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';
import { fadeInVariants, listItemVariants } from '../../utils/animations';

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userMilestones, loading } = useAppSelector((state) => state.milestones);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch user milestones on component mount
  useEffect(() => {
    dispatch(fetchUserMilestones());
  }, [dispatch]);

  // Filter tasks based on search term and status filter
  const filteredTasks = userMilestones.filter(
    (milestone) =>
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === '' || milestone.status === filterStatus)
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'In Progress':
        return 'orange';
      case 'Not Started':
        return 'blue';
      case 'Delayed':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
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

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Update milestone status
  const handleUpdateStatus = (id: string, newStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed') => {
    dispatch(updateMilestone({
      id,
      milestoneData: {
        status: newStatus,
        completedDate: newStatus === 'Completed' ? new Date().toISOString() : undefined
      }
    }));
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Container maxW="container.xl" py={8}>
        <Box
          as={motion.div}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <PageHeader title="My Tasks" backButtonLink="/user-dashboard" />

          <Card mb={6}>
            <CardBody>
              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <InputGroup flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <FaSearch color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select
                  placeholder="Filter by status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  maxW={{ base: '100%', md: '200px' }}
                >
                  <option value="">All Tasks</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Delayed">Delayed</option>
                </Select>
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">
                <HStack>
                  <Box
                    bg="purple.500"
                    w={6}
                    h={6}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xs" color="white" fontWeight="bold">
                      T
                    </Text>
                  </Box>
                  <Text>Task List</Text>
                </HStack>
              </Heading>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Center py={6}>
                  <Spinner color="brand.500" size="xl" />
                </Center>
              ) : filteredTasks.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <Text color="gray.500">
                    {searchTerm || filterStatus 
                      ? "No tasks match your search criteria" 
                      : "You have no assigned tasks at the moment"}
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Task</Th>
                        <Th>Project</Th>
                        <Th>Priority</Th>
                        <Th>Status</Th>
                        <Th>Due Date</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredTasks.map((task, index) => (
                        <Tr
                          key={task._id}
                          as={motion.tr}
                          custom={index}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ backgroundColor: '#F7FAFC' }}
                        >
                          <Td fontWeight="medium">{task.title}</Td>
                          <Td>
                            {task.project && 
                             typeof task.project === 'object' && 
                             task.project !== null &&
                             'title' in task.project
                              ? String((task.project as {title: string}).title) 
                              : 'Unknown Project'}
                          </Td>
                          <Td>
                            <Badge colorScheme={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </Td>
                          <Td>{formatDate(task.dueDate)}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <Tooltip
                                label={
                                  task.status === 'Completed'
                                    ? 'Completed'
                                    : 'Mark as Complete'
                                }
                              >
                                <IconButton
                                  aria-label="Mark as complete"
                                  icon={<FaCheck />}
                                  size="sm"
                                  colorScheme={
                                    task.status === 'Completed' ? 'green' : 'gray'
                                  }
                                  isDisabled={task.status === 'Completed'}
                                  onClick={() => handleUpdateStatus(task._id, 'Completed')}
                                />
                              </Tooltip>
                              <Tooltip
                                label={
                                  task.status === 'In Progress'
                                    ? 'In Progress'
                                    : 'Mark as In Progress'
                                }
                              >
                                <IconButton
                                  aria-label="Mark as in progress"
                                  icon={<FaHourglass />}
                                  size="sm"
                                  colorScheme={
                                    task.status === 'In Progress'
                                      ? 'orange'
                                      : 'gray'
                                  }
                                  isDisabled={task.status === 'In Progress'}
                                  onClick={() => handleUpdateStatus(task._id, 'In Progress')}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default TaskList; 