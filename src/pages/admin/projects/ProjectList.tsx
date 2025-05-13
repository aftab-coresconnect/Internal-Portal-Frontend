import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tooltip,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { fetchProjects, deleteProject, resetProjectState } from '../../../features/projects/projectSlice';

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  const { projects, loading, error, success } = useAppSelector((state) => state.projects);
  
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  
  useEffect(() => {
    if (success && projectToDelete) {
      toast({
        title: 'Project deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setProjectToDelete(null);
      dispatch(resetProjectState());
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
  }, [success, error, projectToDelete, toast, dispatch]);
  
  const handleViewProject = (id: string) => {
    navigate(`/admin-dashboard/projects/${id}`);
  };
  
  const handleEditProject = (id: string) => {
    navigate(`/admin-dashboard/projects/edit/${id}`);
  };
  
  const handleConfirmDelete = (id: string) => {
    setProjectToDelete(id);
    onOpen();
  };
  
  const handleDelete = () => {
    if (projectToDelete) {
      dispatch(deleteProject(projectToDelete));
      onClose();
    }
  };
  
  const handleAddProject = () => {
    navigate('/admin-dashboard/projects/add');
  };
  
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.clientName && project.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg">Projects</Heading>
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="blue" 
          onClick={handleAddProject}
        >
          Add Project
        </Button>
      </Flex>
      
      <Box mb={5}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Box>
      
      {loading ? (
        <Text>Loading projects...</Text>
      ) : filteredProjects.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Client</Th>
                <Th>Status</Th>
                <Th>Start Date</Th>
                <Th>Deadline</Th>
                <Th>Tech Stack</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProjects.map((project) => (
                <Tr key={project._id}>
                  <Td fontWeight="medium">{project.title}</Td>
                  <Td>{project.clientName || '-'}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </Td>
                  <Td>{new Date(project.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(project.deadline).toLocaleDateString()}</Td>
                  <Td>
                    <Wrap spacing={1}>
                      {project.techStack.slice(0, 3).map((tech, index) => (
                        <WrapItem key={index}>
                          <Tag size="sm" colorScheme="cyan" borderRadius="full">
                            <TagLabel>{tech}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                      {project.techStack.length > 3 && (
                        <WrapItem>
                          <Tag size="sm" colorScheme="gray" borderRadius="full">
                            <TagLabel>+{project.techStack.length - 3}</TagLabel>
                          </Tag>
                        </WrapItem>
                      )}
                    </Wrap>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="View Details">
                        <IconButton
                          aria-label="View project"
                          icon={<FaEye />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => handleViewProject(project._id)}
                        />
                      </Tooltip>
                      <Tooltip label="Edit Project">
                        <IconButton
                          aria-label="Edit project"
                          icon={<FaEdit />}
                          size="sm"
                          colorScheme="green"
                          variant="outline"
                          onClick={() => handleEditProject(project._id)}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Project">
                        <IconButton
                          aria-label="Delete project"
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleConfirmDelete(project._id)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box p={5} textAlign="center">
          <Text fontSize="lg">No projects found.</Text>
        </Box>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProjectList; 