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
  Container,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { fetchProjects, deleteProject, resetProjectState } from '../../../features/projects/projectSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { listItemVariants, fadeInVariants } from '../../../utils/animations';
import AnimatedButton from '../../../components/ui/AnimatedButton';
import AnimatedSpinner from '../../../components/ui/AnimatedSpinner';
import FloatingActionButton from '../../../components/ui/FloatingActionButton';
import Navbar from '../../../components/layout/Navbar';
import PageHeader from '../../../components/layout/PageHeader';

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
      case 'Delivered':
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Action buttons for the page header
  const actionButtons = (
    <AnimatedButton
      leftIcon={<FaPlus />}
      colorScheme="brand"
      onClick={handleAddProject}
    >
      Add Project
    </AnimatedButton>
  );
  
  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />
      
      <Container maxW="container.xl" py={6}>
        <Box
          as={motion.div}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <PageHeader 
            title="Projects" 
            backButtonLink="/admin-dashboard"
            actionButtons={actionButtons}
          />
          
          <Box mb={5}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
                boxShadow="sm"
                bg="white"
              />
            </InputGroup>
          </Box>
          
          {loading ? (
            <Box py={10} textAlign="center">
              <AnimatedSpinner text="Loading projects..." />
            </Box>
          ) : filteredProjects.length > 0 ? (
            <Box 
              overflowX="auto" 
              borderRadius="lg" 
              boxShadow="md" 
              bg="white"
              as={motion.div}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
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
                  <AnimatePresence>
                    {filteredProjects.map((project, index) => (
                      <Tr 
                        key={project._id}
                        as={motion.tr}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit="removed"
                        variants={listItemVariants}
                        whileHover={{ backgroundColor: '#F7FAFC' }}
                      >
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
                                as={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
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
                                as={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
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
                                as={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </AnimatePresence>
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Box p={8} textAlign="center" bg="white" borderRadius="lg" boxShadow="md">
              <VStack spacing={4}>
                <Text fontSize="lg">No projects found matching your search.</Text>
                <AnimatedButton onClick={handleAddProject} colorScheme="brand">
                  Create Your First Project
                </AnimatedButton>
              </VStack>
            </Box>
          )}
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent as={motion.div} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Project
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? This action cannot be undone.
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
      </Container>

      {/* Floating Action Button */}
      <FloatingActionButton
        tooltipLabel="Add New Project"
        onClick={handleAddProject}
      />
    </Box>
  );
};

export default ProjectList; 