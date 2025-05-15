import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  FormHelperText,
  Stack,
  Heading,
  VStack,
  HStack,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  InputGroup,
  InputRightElement,
  Flex,
  Grid,
  GridItem,
  Checkbox,
} from '@chakra-ui/react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
  fetchProjectById,
  createProject,
  updateProject,
  clearSelectedProject,
  resetProjectState,
  ProjectFormData
} from '../../../features/projects/projectSlice';
import { fetchUsers } from '../../../features/auth/authActions';
import { fetchClients } from '../../../features/clients/clientActions';
import { Client } from '../../../features/clients/clientSlice';
import { RootState } from '../../../store';

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { selectedProject, loading: isLoading, error, success: message } = useAppSelector((state) => state.projects);
  const { users } = useAppSelector((state) => state.auth);
  const { clients } = useAppSelector((state) => (state as RootState).clients);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    clientName: '',
    status: 'Active' as 'Active' | 'Paused' | 'Completed' | 'Delivered',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    figmaLink: '',
    repoLink: '',
    jiraLink: '',
    startDate: '',
    deadline: '',
    techStack: [] as string[],
    assignedDevelopers: [] as string[],
    projectManager: '',
    budget: 0,
    tags: [] as string[],
    satisfaction: {
      quality: 0,
      communication: 0,
      timeliness: 0,
      overall: 0,
      reviewNote: '',
    }
  });
  
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  // Load project data if editing
  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProjectById(id));
    }
    
    // Load users for selection
    dispatch(fetchUsers());
    
    // Load clients for selection
    dispatch(fetchClients());
    
    // Cleanup
    return () => {
      dispatch(clearSelectedProject());
      dispatch(resetProjectState());
    };
  }, [dispatch, isEdit, id]);
  
  // Populate form with project data
  useEffect(() => {
    if (isEdit && selectedProject) {
      setFormData({
        title: selectedProject.title,
        description: selectedProject.description,
        clientId: selectedProject.clientId || '',
        clientName: selectedProject.clientName,
        status: selectedProject.status,
        priority: selectedProject.priority || 'Medium',
        figmaLink: selectedProject.figmaLink || '',
        repoLink: selectedProject.repoLink || '',
        jiraLink: selectedProject.jiraLink || '',
        startDate: new Date(selectedProject.startDate).toISOString().split('T')[0],
        deadline: new Date(selectedProject.deadline).toISOString().split('T')[0],
        techStack: selectedProject.techStack,
        assignedDevelopers: selectedProject.assignedDevelopers.map((dev) => dev._id),
        projectManager: selectedProject.projectManager?._id || '',
        budget: selectedProject.budget || 0,
        tags: selectedProject.tags || [],
        satisfaction: {
          quality: selectedProject.satisfaction?.quality || 0,
          communication: selectedProject.satisfaction?.communication || 0,
          timeliness: selectedProject.satisfaction?.timeliness || 0,
          overall: selectedProject.satisfaction?.overall || 0,
          reviewNote: selectedProject.satisfaction?.reviewNote || '',
        }
      });
    }
  }, [selectedProject, isEdit]);
  
  // Handle success/error states
  useEffect(() => {
    if (message) {
      toast({
        title: isEdit ? 'Project updated' : 'Project created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      dispatch(resetProjectState());
      navigate('/admin-dashboard/projects');
    }
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      dispatch(resetProjectState());
    }
  }, [message, error, toast, dispatch, navigate, isEdit]);
  
  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setFormData({
        ...formData,
        [name]: value as 'Active' | 'Paused' | 'Completed' | 'Delivered',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDeveloperChange = (developerId: string) => {
    setFormData((prev) => {
      if (prev.assignedDevelopers.includes(developerId)) {
        return {
          ...prev,
          assignedDevelopers: prev.assignedDevelopers.filter((id) => id !== developerId),
        };
      } else {
        return {
          ...prev,
          assignedDevelopers: [...prev.assignedDevelopers, developerId],
        };
      }
    });
  };
  
  const handleAddTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput('');
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleProjectManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      projectManager: e.target.value
    });
  };
  
  const handleSatisfactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      satisfaction: {
        ...formData.satisfaction,
        [name]: name === 'reviewNote' ? value : Number(value)
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDate || !formData.deadline || 
        !formData.clientId || !formData.clientName) {
      toast({
        title: 'Missing required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (new Date(formData.deadline) < new Date(formData.startDate)) {
      toast({
        title: 'Invalid date range',
        description: 'Deadline cannot be before start date',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create a properly typed project data object
    const projectData: ProjectFormData = {
      title: formData.title,
      description: formData.description,
      clientId: formData.clientId,
      clientName: formData.clientName,
      status: formData.status,
      priority: formData.priority,
      figmaLink: formData.figmaLink || '',
      repoLink: formData.repoLink || '',
      jiraLink: formData.jiraLink || '',
      startDate: formData.startDate,
      deadline: formData.deadline,
      techStack: formData.techStack,
      assignedDevelopers: formData.assignedDevelopers,
      projectManager: formData.projectManager || undefined,
      budget: typeof formData.budget === 'string' ? parseFloat(formData.budget) || 0 : formData.budget || 0,
      tags: formData.tags,
      satisfaction: formData.status === 'Delivered' ? formData.satisfaction : undefined,
    };
    
    console.log('Form submission:', isEdit ? 'UPDATE' : 'CREATE');
    console.log('Project data:', projectData);
    
    if (isEdit && id) {
      console.log(`Updating project with ID: ${id}`);
      dispatch(updateProject({ id, projectData }))
        .unwrap()
        .then(() => {
          console.log('Project update succeeded');
          toast({
            title: 'Project updated',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          navigate('/admin-dashboard/projects');
        })
        .catch((err) => {
          console.error('Project update failed:', err);
          toast({
            title: 'Update failed',
            description: typeof err === 'string' ? err : 'Could not update project. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      console.log('Creating new project');
      dispatch(createProject(projectData))
        .unwrap()
        .then(() => {
          console.log('Project creation succeeded');
          toast({
            title: 'Project created',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          navigate('/admin-dashboard/projects');
        })
        .catch((err) => {
          console.error('Project creation failed:', err);
          toast({
            title: 'Creation failed',
            description: typeof err === 'string' ? err : 'Could not create project. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg">{isEdit ? 'Edit Project' : 'Add New Project'}</Heading>
        <Button 
          leftIcon={<FaArrowLeft />} 
          variant="outline" 
          onClick={() => navigate('/admin-dashboard/projects')}
        >
          Back to Projects
        </Button>
      </Flex>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Project Title</FormLabel>
                <Input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Enter project title" 
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Client</FormLabel>
                <Select
                  name="clientId"
                  value={formData.clientId}
                  onChange={(e) => {
                    const selectedClient = clients.find((client: Client) => client._id === e.target.value);
                    setFormData({
                      ...formData,
                      clientId: e.target.value,
                      clientName: selectedClient ? selectedClient.name : ''
                    });
                  }}
                >
                  <option value="">Select a Client</option>
                  {clients && clients.map((client: Client) => (
                    <option key={client._id} value={client._id}>
                      {client.name} - {client.companyName || 'No Company'} ({client.email})
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Client Name (Display)</FormLabel>
                <Input 
                  name="clientName" 
                  value={formData.clientName} 
                  onChange={handleChange} 
                  placeholder="Enter client name" 
                  readOnly={!!formData.clientId}
                />
                <FormHelperText>Auto-populated from client selection</FormHelperText>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
          
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Enter project description" 
              rows={4}
            />
          </FormControl>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select 
                  name="priority" 
                  value={formData.priority} 
                  onChange={handleChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Tech Stack</FormLabel>
                <InputGroup>
                  <Input 
                    value={techInput} 
                    onChange={(e) => setTechInput(e.target.value)} 
                    placeholder="Add technology" 
                    onKeyDown={handleKeyDown}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleAddTech}>
                      <FaPlus />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>Press Enter or click + to add</FormHelperText>
              </FormControl>
              
              <Box mt={2}>
                <Wrap spacing={2}>
                  {formData.techStack.map((tech, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                        <TagLabel>{tech}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveTech(tech)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Tags</FormLabel>
                <InputGroup>
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)} 
                    placeholder="Add tag" 
                    onKeyDown={handleTagKeyDown}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleAddTag}>
                      <FaPlus />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>Press Enter or click + to add</FormHelperText>
              </FormControl>
              
              <Box mt={2}>
                <Wrap spacing={2}>
                  {formData.tags.map((tag, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" borderRadius="full" variant="solid" colorScheme="green">
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </GridItem>
            
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Deadline</FormLabel>
                <Input 
                  name="deadline" 
                  type="date" 
                  value={formData.deadline} 
                  onChange={handleChange} 
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Budget</FormLabel>
                <Input 
                  name="budget" 
                  type="number" 
                  value={formData.budget} 
                  onChange={handleChange} 
                  placeholder="Enter project budget"
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Project Manager</FormLabel>
                <Select
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleProjectManagerChange}
                >
                  <option value="">Select a Project Manager</option>
                  {users && users
                    .filter((user: any) => user.role === 'teamLead' || user.role === 'admin')
                    .map((manager: any) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name} ({manager.role})
                      </option>
                    ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
          
          <FormControl>
            <FormLabel>Figma Link</FormLabel>
            <Input 
              name="figmaLink" 
              value={formData.figmaLink} 
              onChange={handleChange} 
              placeholder="https://figma.com/file/..." 
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Repository Link</FormLabel>
            <Input 
              name="repoLink" 
              value={formData.repoLink} 
              onChange={handleChange} 
              placeholder="https://github.com/..." 
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Jira Board Link</FormLabel>
            <Input 
              name="jiraLink" 
              value={formData.jiraLink} 
              onChange={handleChange} 
              placeholder="https://jira.com/board/..." 
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Assigned Developers</FormLabel>
            <Stack spacing={2} mt={2} maxH="200px" overflowY="auto" p={2} border="1px solid" borderColor="gray.200" borderRadius="md">
              {users && users.filter((user: any) => user.role === 'developer' || user.role === 'teamLead').map((developer: any) => (
                <Checkbox 
                  key={developer._id}
                  isChecked={formData.assignedDevelopers.includes(developer._id)}
                  onChange={() => handleDeveloperChange(developer._id)}
                >
                  {developer.name} ({developer.email}) - {developer.role}
                </Checkbox>
              ))}
            </Stack>
          </FormControl>
          
          {/* Satisfaction Rating Section - Only visible when status is Delivered */}
          {formData.status === 'Delivered' && (
            <Box bg="gray.50" p={4} borderRadius="md" border="1px" borderColor="gray.200">
              <Heading size="md" mb={4}>Project Satisfaction Rating</Heading>
              
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                <GridItem>
                  <FormControl>
                    <FormLabel>Quality Rating (1-5)</FormLabel>
                    <Select
                      name="quality"
                      value={formData.satisfaction.quality}
                      onChange={handleSatisfactionChange}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={3}>3 - Average</option>
                      <option value={4}>4 - Good</option>
                      <option value={5}>5 - Excellent</option>
                    </Select>
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl>
                    <FormLabel>Communication Rating (1-5)</FormLabel>
                    <Select
                      name="communication"
                      value={formData.satisfaction.communication}
                      onChange={handleSatisfactionChange}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={3}>3 - Average</option>
                      <option value={4}>4 - Good</option>
                      <option value={5}>5 - Excellent</option>
                    </Select>
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl>
                    <FormLabel>Timeliness Rating (1-5)</FormLabel>
                    <Select
                      name="timeliness"
                      value={formData.satisfaction.timeliness}
                      onChange={handleSatisfactionChange}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={3}>3 - Average</option>
                      <option value={4}>4 - Good</option>
                      <option value={5}>5 - Excellent</option>
                    </Select>
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl>
                    <FormLabel>Overall Rating (1-5)</FormLabel>
                    <Select
                      name="overall"
                      value={formData.satisfaction.overall}
                      onChange={handleSatisfactionChange}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={3}>3 - Average</option>
                      <option value={4}>4 - Good</option>
                      <option value={5}>5 - Excellent</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
              
              <FormControl mt={4}>
                <FormLabel>Review Notes</FormLabel>
                <Textarea
                  name="reviewNote"
                  value={formData.satisfaction.reviewNote}
                  onChange={handleSatisfactionChange}
                  placeholder="Enter review notes about the project"
                  rows={3}
                />
              </FormControl>
            </Box>
          )}
          
          <HStack spacing={4} mt={5} justify="flex-end">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin-dashboard/projects')}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              type="submit" 
              isLoading={isLoading}
            >
              {isEdit ? 'Update Project' : 'Create Project'}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default ProjectForm; 