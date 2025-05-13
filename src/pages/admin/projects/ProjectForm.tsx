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

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { selectedProject, loading, error, success } = useAppSelector((state) => state.projects);
  const { users } = useAppSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    status: 'Active' as 'Active' | 'Paused' | 'Completed',
    figmaLink: '',
    repoLink: '',
    jiraLink: '',
    startDate: '',
    deadline: '',
    techStack: [] as string[],
    assignedDevelopers: [] as string[],
  });
  
  const [techInput, setTechInput] = useState('');
  
  // Load project data if editing
  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProjectById(id));
    }
    
    // Load users for selection
    dispatch(fetchUsers());
    
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
        clientName: selectedProject.clientName || '',
        status: selectedProject.status,
        figmaLink: selectedProject.figmaLink || '',
        repoLink: selectedProject.repoLink || '',
        jiraLink: selectedProject.jiraLink || '',
        startDate: new Date(selectedProject.startDate).toISOString().split('T')[0],
        deadline: new Date(selectedProject.deadline).toISOString().split('T')[0],
        techStack: selectedProject.techStack,
        assignedDevelopers: selectedProject.assignedDevelopers.map((dev) => dev._id),
      });
    }
  }, [selectedProject, isEdit]);
  
  // Handle success/error states
  useEffect(() => {
    if (success) {
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
  }, [success, error, toast, dispatch, navigate, isEdit]);
  
  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setFormData({
        ...formData,
        [name]: value as 'Active' | 'Paused' | 'Completed',
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDate || !formData.deadline) {
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
      clientName: formData.clientName,
      status: formData.status as 'Active' | 'Paused' | 'Completed',
      figmaLink: formData.figmaLink,
      repoLink: formData.repoLink,
      jiraLink: formData.jiraLink,
      startDate: formData.startDate,
      deadline: formData.deadline,
      techStack: formData.techStack,
      assignedDevelopers: formData.assignedDevelopers,
    };
    
    if (isEdit && id) {
      dispatch(updateProject({ id, projectData }));
    } else {
      dispatch(createProject(projectData));
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
                <FormLabel>Client Name (Optional)</FormLabel>
                <Input 
                  name="clientName" 
                  value={formData.clientName} 
                  onChange={handleChange} 
                  placeholder="Enter client name" 
                />
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
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
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
              isLoading={loading}
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