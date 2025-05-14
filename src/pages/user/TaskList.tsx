import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
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
  Divider,
} from '@chakra-ui/react';
import { FaSearch, FaCheck, FaHourglass, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../hooks/reduxHooks';
import Navbar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';
import { fadeInVariants, listItemVariants } from '../../utils/animations';

// Mock data for tasks - would be fetched from API in real app
const mockTasks = [
  {
    id: '1',
    title: 'Implement Authentication',
    project: 'Internal Portal App',
    priority: 'High',
    status: 'Completed',
    dueDate: '2023-05-10',
  },
  {
    id: '2',
    title: 'Create Dashboard UI',
    project: 'Internal Portal App',
    priority: 'High',
    status: 'Completed',
    dueDate: '2023-05-15',
  },
  {
    id: '3',
    title: 'Add Role Based Access',
    project: 'Internal Portal App',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2023-05-20',
  },
  {
    id: '4',
    title: 'Design API Structure',
    project: 'API Integration',
    priority: 'High',
    status: 'Pending',
    dueDate: '2023-05-25',
  },
  {
    id: '5',
    title: 'Implement Frontend Components',
    project: 'Internal Portal App',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2023-05-30',
  },
  {
    id: '6',
    title: 'Setup Database Schema',
    project: 'API Integration',
    priority: 'High',
    status: 'Pending',
    dueDate: '2023-06-05',
  },
  {
    id: '7',
    title: 'Write Unit Tests',
    project: 'Internal Portal App',
    priority: 'Low',
    status: 'Pending',
    dueDate: '2023-06-10',
  },
];

const TaskList: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');

  // Filter tasks based on search term and status filter
  const filteredTasks = mockTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === '' || task.status === filterStatus)
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'In Progress':
        return 'orange';
      case 'Pending':
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                  <option value="Pending">Pending</option>
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
                        key={task.id}
                        as={motion.tr}
                        custom={index}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ backgroundColor: '#F7FAFC' }}
                      >
                        <Td fontWeight="medium">{task.title}</Td>
                        <Td>{task.project}</Td>
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
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default TaskList; 