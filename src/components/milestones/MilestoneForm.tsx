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
  Stack, 
  Heading, 
  Flex, 
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  Checkbox
} from '@chakra-ui/react';
import { RootState } from '../../store';
import { 
  createMilestone, 
  updateMilestone, 
  fetchMilestoneById, 
  resetMilestoneState,
  MilestoneFormData 
} from '../../features/milestones/milestoneSlice';
import { fetchProjects } from '../../features/projects/projectSlice';
import { fetchProjectMilestones } from '../../features/milestones/milestoneSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

const MilestoneForm: React.FC = () => {
  const { projectId, milestoneId } = useParams<{ projectId: string; milestoneId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { selectedMilestone, loading, error, success } = useAppSelector(
    (state: RootState) => state.milestones
  );
  const { projects } = useAppSelector((state: RootState) => state.projects);
  const { projectMilestones } = useAppSelector((state: RootState) => state.milestones);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    project: projectId || '',
    status: 'Not Started',
    startDate: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: [],
    dependencies: [],
    progressPercentage: 0,
    notes: [],
    attachments: []
  });

  const [note, setNote] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);

  // Fetch milestone data if editing
  useEffect(() => {
    if (milestoneId) {
      dispatch(fetchMilestoneById(milestoneId));
    }
    
    dispatch(fetchProjects());
    
    if (projectId) {
      dispatch(fetchProjectMilestones(projectId));
    }
    
    // Reset state when component unmounts
    return () => {
      dispatch(resetMilestoneState());
    };
  }, [dispatch, milestoneId, projectId]);

  // Populate form if editing
  useEffect(() => {
    if (selectedMilestone && milestoneId) {
      setFormData({
        title: selectedMilestone.title,
        description: selectedMilestone.description,
        project: selectedMilestone.project,
        status: selectedMilestone.status,
        startDate: new Date(selectedMilestone.startDate).toISOString().split('T')[0],
        dueDate: new Date(selectedMilestone.dueDate).toISOString().split('T')[0],
        completedDate: selectedMilestone.completedDate 
          ? new Date(selectedMilestone.completedDate).toISOString().split('T')[0] 
          : undefined,
        priority: selectedMilestone.priority,
        assignedTo: selectedMilestone.assignedTo.map(dev => dev._id),
        dependencies: selectedMilestone.dependencies?.map(dep => dep._id) || [],
        progressPercentage: selectedMilestone.progressPercentage,
        notes: selectedMilestone.notes || [],
        attachments: selectedMilestone.attachments || []
      });
      
      setSelectedUsers(selectedMilestone.assignedTo.map(dev => dev._id));
      setSelectedDependencies(selectedMilestone.dependencies?.map(dep => dep._id) || []);
    }
  }, [selectedMilestone, milestoneId]);

  // Handle success and redirect
  useEffect(() => {
    if (success) {
      toast({
        title: milestoneId ? 'Milestone updated' : 'Milestone created',
        description: milestoneId 
          ? 'The milestone has been updated successfully.' 
          : 'The milestone has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(`/projects/${projectId}`);
    }
  }, [success, navigate, milestoneId, projectId, toast]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProgressChange = (value: string) => {
    setFormData({ ...formData, progressPercentage: parseInt(value) });
  };

  const handleAddNote = () => {
    if (note.trim()) {
      setFormData({
        ...formData,
        notes: [...(formData.notes || []), note.trim()]
      });
      setNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    const updatedNotes = [...(formData.notes || [])];
    updatedNotes.splice(index, 1);
    setFormData({ ...formData, notes: updatedNotes });
  };

  const handleUserSelection = (userId: string) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      // Remove user
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      setFormData({
        ...formData,
        assignedTo: formData.assignedTo.filter(id => id !== userId)
      });
    } else {
      // Add user
      setSelectedUsers([...selectedUsers, userId]);
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, userId]
      });
    }
  };

  const handleDependencySelection = (milestoneId: string) => {
    const isSelected = selectedDependencies.includes(milestoneId);
    if (isSelected) {
      // Remove dependency
      setSelectedDependencies(selectedDependencies.filter(id => id !== milestoneId));
      setFormData({
        ...formData,
        dependencies: formData.dependencies?.filter(id => id !== milestoneId)
      });
    } else {
      // Add dependency
      setSelectedDependencies([...selectedDependencies, milestoneId]);
      setFormData({
        ...formData,
        dependencies: [...(formData.dependencies || []), milestoneId]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (milestoneId) {
      dispatch(updateMilestone({ id: milestoneId, milestoneData: formData }));
    } else {
      dispatch(createMilestone(formData));
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6}>{milestoneId ? 'Edit Milestone' : 'Create New Milestone'}</Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Title */}
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter milestone title"
            />
          </FormControl>
          
          {/* Description */}
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter milestone description"
              rows={4}
            />
          </FormControl>
          
          {/* Project (if not already in a project context) */}
          {!projectId && (
            <FormControl isRequired>
              <FormLabel>Project</FormLabel>
              <Select
                name="project"
                value={formData.project}
                onChange={handleChange}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          
          {/* Status */}
          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
            </Select>
          </FormControl>
          
          {/* Dates */}
          <Flex gap={4}>
            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Due Date</FormLabel>
              <Input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Completed Date</FormLabel>
              <Input
                name="completedDate"
                type="date"
                value={formData.completedDate || ''}
                onChange={handleChange}
              />
            </FormControl>
          </Flex>
          
          {/* Priority */}
          <FormControl isRequired>
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
          
          {/* Progress */}
          <FormControl>
            <FormLabel>Progress ({formData.progressPercentage}%)</FormLabel>
            <NumberInput
              min={0}
              max={100}
              value={formData.progressPercentage}
              onChange={handleProgressChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          {/* Assigned Users */}
          <FormControl>
            <FormLabel>Assigned Users</FormLabel>
            <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} maxH="200px" overflowY="auto">
              {(() => {
                const project = projects.find(p => p._id === (projectId || formData.project));
                return project?.assignedDevelopers?.map(dev => (
                  <Checkbox 
                    key={dev._id} 
                    isChecked={selectedUsers.includes(dev._id)}
                    onChange={() => handleUserSelection(dev._id)}
                    mb={2}
                  >
                    {dev.name} ({dev.role})
                  </Checkbox>
                )) || [];
              })()}
            </Box>
          </FormControl>
          
          {/* Dependencies (other milestones in same project) */}
          <FormControl>
            <FormLabel>Dependencies</FormLabel>
            <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} maxH="200px" overflowY="auto">
              {projectMilestones
                .filter(m => m._id !== milestoneId) // Exclude current milestone
                .map(milestone => (
                  <Checkbox 
                    key={milestone._id} 
                    isChecked={selectedDependencies.includes(milestone._id)}
                    onChange={() => handleDependencySelection(milestone._id)}
                    mb={2}
                  >
                    {milestone.title} ({milestone.status})
                  </Checkbox>
              ))}
            </Box>
          </FormControl>
          
          {/* Notes */}
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Flex>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
                mr={2}
              />
              <Button onClick={handleAddNote}>Add</Button>
            </Flex>
            <Box mt={2}>
              {formData.notes && formData.notes.length > 0 ? (
                <HStack spacing={2} flexWrap="wrap">
                  {formData.notes.map((noteText, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                      mt={1}
                    >
                      <TagLabel>{noteText}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveNote(index)} />
                    </Tag>
                  ))}
                </HStack>
              ) : (
                <Box color="gray.500">No notes added</Box>
              )}
            </Box>
          </FormControl>
          
          <Flex justify="space-between" mt={6}>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/projects/${projectId}`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              colorScheme="blue" 
              isLoading={loading}
            >
              {milestoneId ? 'Update Milestone' : 'Create Milestone'}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default MilestoneForm; 