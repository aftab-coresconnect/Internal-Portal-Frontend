import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Divider,
  Link,
  SimpleGrid,
  Flex,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FaEdit, FaArrowLeft, FaGithub, FaFigma, FaJira, FaCalendarAlt, FaCalendarCheck, FaPlus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { fetchProjectById, clearSelectedProject } from '../../../features/projects/projectSlice';
import { createMilestone, MilestoneFormData, resetMilestoneState } from '../../../features/milestones/milestoneSlice';
import MilestoneList from '../../../components/milestones/MilestoneList';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { selectedProject, loading, error } = useAppSelector((state) => state.projects);
  const { success: milestoneSuccess, loading: milestoneLoading, error: milestoneError } = 
    useAppSelector((state) => state.milestones);
  
  const [milestoneFormData, setMilestoneFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    project: id || '',
    status: 'Not Started',
    startDate: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: [],
    progressPercentage: 0
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMilestoneFormData({
      ...milestoneFormData,
      [name]: value
    });
  };

  // Reset form data
  const resetForm = () => {
    setMilestoneFormData({
      title: '',
      description: '',
      project: id || '',
      status: 'Not Started',
      startDate: '',
      dueDate: '',
      priority: 'Medium',
      assignedTo: [],
      progressPercentage: 0
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!milestoneFormData.title || !milestoneFormData.description || !milestoneFormData.startDate || !milestoneFormData.dueDate) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Ensure proper data formatting
    const formattedData = {
      ...milestoneFormData,
      project: id || '',
      assignedTo: milestoneFormData.assignedTo || [],
      progressPercentage: milestoneFormData.progressPercentage || 0,
      dependencies: []
    };

    // Fix any date issues
    try {
      // Validate dates are proper format
      new Date(formattedData.startDate).toISOString();
      new Date(formattedData.dueDate).toISOString();
    } catch (error) {
      toast({
        title: 'Invalid date format',
        description: 'Please make sure all dates are in a valid format',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    console.log('Submitting milestone data:', formattedData);
    dispatch(createMilestone(formattedData));
  };
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
    
    return () => {
      dispatch(clearSelectedProject());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching project',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  // Handle milestone success
  useEffect(() => {
    if (milestoneSuccess) {
      toast({
        title: 'Milestone created',
        description: 'The milestone has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onClose();
      resetForm();
      
      // Reset milestone state to avoid duplicate notifications
      dispatch(resetMilestoneState());
      
      // Refresh project data to show new milestone
      if (id) {
        dispatch(fetchProjectById(id));
      }
    }
  }, [milestoneSuccess, dispatch, id, onClose, toast]);

  // Handle milestone error
  useEffect(() => {
    if (milestoneError) {
      toast({
        title: 'Error creating milestone',
        description: milestoneError,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }, [milestoneError, toast]);
  
  // Reset milestone state when component unmounts
  useEffect(() => {
    return () => {
      // Reset milestone state to avoid duplicate notifications on next visit
      dispatch(resetMilestoneState());
    };
  }, [dispatch]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Paused':
        return 'orange';
      case 'Completed':
        return 'blue';
      default:
        return 'gray';
    }
  };
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="300px">
        <Spinner size="xl" />
      </Flex>
    );
  }
  
  if (!selectedProject) {
    return <Box>Project not found</Box>;
  }
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <HStack>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            onClick={() => navigate('/admin-dashboard/projects')}
            size="sm"
          >
            Back
          </Button>
          <Heading size="lg" ml={2}>{selectedProject.title}</Heading>
        </HStack>
        <Button 
          leftIcon={<FaEdit />} 
          colorScheme="blue" 
          onClick={() => navigate(`/admin-dashboard/projects/edit/${id}`)}
        >
          Edit Project
        </Button>
      </Flex>
      
      <Box bg="white" p={6} borderRadius="md" boxShadow="md" mb={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box>
            <HStack mb={3}>
              <Badge colorScheme={getStatusColor(selectedProject.status)} fontSize="md" px={2} py={1} borderRadius="md">
                {selectedProject.status}
              </Badge>
              {selectedProject.clientName && (
                <Text fontWeight="medium">Client: {selectedProject.clientName}</Text>
              )}
            </HStack>
            
            <Text fontSize="lg" mb={4}>
              {selectedProject.description}
            </Text>
            
            <HStack spacing={6} mb={4}>
              <HStack>
                <FaCalendarAlt />
                <Text>Start: {new Date(selectedProject.startDate).toLocaleDateString()}</Text>
              </HStack>
              <HStack>
                <FaCalendarCheck />
                <Text>Deadline: {new Date(selectedProject.deadline).toLocaleDateString()}</Text>
              </HStack>
            </HStack>
          </Box>
          
          <Box>
            <VStack align="stretch" spacing={4}>
              {selectedProject.figmaLink && (
                <HStack>
                  <FaFigma size={20} />
                  <Link href={selectedProject.figmaLink} isExternal color="blue.500">
                    Figma Design
                  </Link>
                </HStack>
              )}
              
              {selectedProject.repoLink && (
                <HStack>
                  <FaGithub size={20} />
                  <Link href={selectedProject.repoLink} isExternal color="blue.500">
                    Repository
                  </Link>
                </HStack>
              )}
              
              {selectedProject.jiraLink && (
                <HStack>
                  <FaJira size={20} />
                  <Link href={selectedProject.jiraLink} isExternal color="blue.500">
                    Jira Board
                  </Link>
                </HStack>
              )}
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box bg="white" p={6} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4}>Tech Stack</Heading>
          <Divider mb={4} />
          
          <Wrap spacing={3}>
            {selectedProject.techStack.map((tech, index) => (
              <WrapItem key={index}>
                <Tag size="lg" colorScheme="cyan" borderRadius="full">
                  <TagLabel>{tech}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
            {selectedProject.techStack.length === 0 && (
              <Text color="gray.500">No technologies specified</Text>
            )}
          </Wrap>
        </Box>
        
        <Box bg="white" p={6} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4}>Assigned Developers</Heading>
          <Divider mb={4} />
          
          {selectedProject.assignedDevelopers.length > 0 ? (
            <VStack align="stretch" spacing={3}>
              {selectedProject.assignedDevelopers.map((developer) => (
                <HStack key={developer._id}>
                  <Avatar size="sm" name={developer.name} />
                  <Box>
                    <Text fontWeight="medium">{developer.name}</Text>
                    <Text fontSize="sm" color="gray.600">{developer.role}</Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">No developers assigned</Text>
          )}
        </Box>
      </SimpleGrid>
      
      {/* Milestones Section */}
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="md">Project Milestones</Heading>
          <Button 
            leftIcon={<FaPlus />} 
            colorScheme="blue" 
            size="sm"
            onClick={onOpen}
          >
            Add Milestone
          </Button>
        </Flex>
        {id && <MilestoneList projectId={id} />}
      </Box>

      {/* Add Milestone Dialog */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Milestone</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} width="100%">
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input 
                      name="title" 
                      value={milestoneFormData.title} 
                      onChange={handleChange} 
                      placeholder="Milestone title" 
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      name="status" 
                      value={milestoneFormData.status} 
                      onChange={handleChange}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
              
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  name="description" 
                  value={milestoneFormData.description} 
                  onChange={handleChange} 
                  placeholder="Milestone description" 
                  rows={3}
                />
              </FormControl>
              
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} width="100%">
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input 
                      name="startDate" 
                      type="date" 
                      value={milestoneFormData.startDate} 
                      onChange={handleChange} 
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Due Date</FormLabel>
                    <Input 
                      name="dueDate" 
                      type="date" 
                      value={milestoneFormData.dueDate} 
                      onChange={handleChange} 
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      name="priority" 
                      value={milestoneFormData.priority} 
                      onChange={handleChange}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isLoading={milestoneLoading}
            >
              Save Milestone
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProjectDetails;