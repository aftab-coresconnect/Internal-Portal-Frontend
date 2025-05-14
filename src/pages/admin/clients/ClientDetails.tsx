import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Divider,
  Badge,
  Tag,
  Wrap,
  WrapItem,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  VStack,
  HStack,
  IconButton,
  useToast,
  Spinner,
  Link,
  Code,
} from '@chakra-ui/react';
import { FaEdit, FaArrowLeft, FaExternalLinkAlt, FaLink, FaBug } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
  fetchClientById,
  clearSelectedClient,
  resetClientState,
} from '../../../features/clients/clientSlice';
import { fetchProjects } from '../../../features/projects/projectSlice';
import { Project } from '../../../features/projects/projectSlice';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [linkedProjects, setLinkedProjects] = useState<Project[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  const { selectedClient, loading, error } = useAppSelector((state) => state.clients);
  const { projects } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (id) {
      dispatch(fetchClientById(id));
      dispatch(fetchProjects());
    }

    return () => {
      dispatch(clearSelectedClient());
      dispatch(resetClientState());
    };
  }, [dispatch, id]);

  // Process linked projects when we have both client and projects data
  useEffect(() => {
    if (selectedClient && projects.length > 0) {
      if (debugMode) {
        console.log('Selected Client:', selectedClient);
        console.log('Projects from Redux:', projects);
        
        // Log the raw linkedProjects array
        console.log('Raw linkedProjects:', selectedClient.linkedProjects);
      }
      
      // Check what type of data we're receiving
      if (selectedClient.linkedProjects) {
        // Try to detect if linkedProjects are populated objects or just IDs
        const linkedProjectsData = selectedClient.linkedProjects;
        const isPopulated = linkedProjectsData.length > 0 && typeof linkedProjectsData[0] === 'object' && 'title' in linkedProjectsData[0];
        
        if (debugMode) {
          console.log('linkedProjects is populated with objects?', isPopulated);
        }
        
        if (isPopulated) {
          // The backend already populated the data, use it directly
          setLinkedProjects(linkedProjectsData as Project[]);
        } else {
          // We need to match IDs with projects from Redux store
          const matchedProjects = projects.filter(project => {
            return selectedClient.linkedProjects?.some(linkedId => {
              // Handle different types of IDs (string vs object)
              const linkedIdStr = typeof linkedId === 'object' && linkedId !== null 
                ? String(linkedId) 
                : String(linkedId);
              
              // Cast to any to avoid TypeScript error about toString on never type
              const projectIdObj = project._id as any;
              const projectIdStr = typeof projectIdObj === 'object' && projectIdObj !== null
                ? String(projectIdObj) 
                : String(projectIdObj);
              
              if (debugMode) {
                console.log(`Comparing: "${linkedIdStr}" === "${projectIdStr}"`, linkedIdStr === projectIdStr);
              }
              
              return linkedIdStr === projectIdStr;
            });
          });
          
          if (debugMode) {
            console.log('Matched projects:', matchedProjects);
          }
          
          setLinkedProjects(matchedProjects);
        }
      } else {
        setLinkedProjects([]);
      }
    } else {
      setLinkedProjects([]);
    }
  }, [selectedClient, projects, debugMode]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      dispatch(resetClientState());
    }
  }, [error, toast, dispatch]);

  const handleEditClient = () => {
    navigate(`/admin-dashboard/clients/edit/${id}`);
  };

  if (loading) {
    return (
      <Box textAlign="center" p={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading client details...</Text>
      </Box>
    );
  }

  if (!selectedClient) {
    return (
      <Box textAlign="center" p={10}>
        <Text fontSize="xl">Client not found</Text>
        <Button
          mt={4}
          leftIcon={<FaArrowLeft />}
          onClick={() => navigate('/admin-dashboard/clients')}
        >
          Back to Clients
        </Button>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg">Client Details</Heading>
        <HStack>
          <IconButton
            aria-label="Toggle debug mode"
            icon={<FaBug />}
            size="sm"
            variant={debugMode ? "solid" : "outline"}
            colorScheme={debugMode ? "red" : "gray"}
            onClick={() => setDebugMode(!debugMode)}
          />
          <Button
            leftIcon={<FaArrowLeft />}
            variant="outline"
            onClick={() => navigate('/admin-dashboard/clients')}
          >
            Back to Clients
          </Button>
          <Button
            leftIcon={<FaEdit />}
            colorScheme="blue"
            onClick={handleEditClient}
          >
            Edit Client
          </Button>
        </HStack>
      </Flex>

      {debugMode && (
        <Card mb={5}>
          <CardHeader bg="red.50">
            <Heading size="md">Debug Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Type of linkedProjects:</Text>
              <Code>
                {selectedClient.linkedProjects 
                  ? `Array of ${selectedClient.linkedProjects.length} items` 
                  : 'undefined or null'
                }
              </Code>
              
              {selectedClient.linkedProjects && selectedClient.linkedProjects.length > 0 && (
                <>
                  <Text fontWeight="bold">First item type:</Text>
                  <Code>{typeof selectedClient.linkedProjects[0]}</Code>
                  
                  <Text fontWeight="bold">First item preview:</Text>
                  <Code display="block" whiteSpace="pre-wrap" p={2} bg="gray.100" borderRadius="md" width="100%">
                    {JSON.stringify(selectedClient.linkedProjects[0], null, 2)}
                  </Code>
                </>
              )}
              
              <Text fontWeight="bold">All linked project IDs:</Text>
              <Code display="block" whiteSpace="pre-wrap" p={2} bg="gray.100" borderRadius="md" width="100%">
                {selectedClient.linkedProjects
                  ? JSON.stringify(selectedClient.linkedProjects.map(lp => 
                      typeof lp === 'object' && lp !== null && '_id' in lp 
                        ? lp._id 
                        : lp
                    ), null, 2)
                  : 'None'
                }
              </Code>
            </VStack>
          </CardBody>
        </Card>
      )}

      <Card mb={6}>
        <CardHeader bg="blue.50" borderBottom="1px" borderColor="blue.100">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="md">{selectedClient.name}</Heading>
            {selectedClient.companyName && (
              <Badge colorScheme="blue" fontSize="sm">
                {selectedClient.companyName}
              </Badge>
            )}
          </Flex>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontWeight="bold">Email:</Text>
              <Text>{selectedClient.email}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Phone:</Text>
              <Text>{selectedClient.phone || 'Not provided'}</Text>
            </Box>
            {selectedClient.website && (
              <Box>
                <Text fontWeight="bold">Website:</Text>
                <Link href={selectedClient.website} isExternal color="blue.500">
                  {selectedClient.website} <FaExternalLinkAlt size="0.8em" style={{ display: 'inline' }} />
                </Link>
              </Box>
            )}
          </SimpleGrid>
        </CardBody>
      </Card>

      {selectedClient.address && (Object.values(selectedClient.address).some(val => val)) && (
        <Card mb={6}>
          <CardHeader bg="gray.50" borderBottom="1px" borderColor="gray.200">
            <Heading size="md">Address Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={1}>
              {selectedClient.address.street && <Text>{selectedClient.address.street}</Text>}
              <Text>
                {[
                  selectedClient.address.city,
                  selectedClient.address.state,
                  selectedClient.address.zipCode
                ].filter(Boolean).join(', ')}
              </Text>
              {selectedClient.address.country && <Text>{selectedClient.address.country}</Text>}
            </VStack>
          </CardBody>
        </Card>
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        {selectedClient.painPoints && selectedClient.painPoints.length > 0 && (
          <Card>
            <CardHeader bg="red.50" borderBottom="1px" borderColor="red.100">
              <Heading size="md">Pain Points</Heading>
            </CardHeader>
            <CardBody>
              <Wrap spacing={2}>
                {selectedClient.painPoints.map((point, index) => (
                  <WrapItem key={index}>
                    <Tag colorScheme="red" borderRadius="full">
                      {point}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </CardBody>
          </Card>
        )}

        {selectedClient.notes && selectedClient.notes.length > 0 && (
          <Card>
            <CardHeader bg="blue.50" borderBottom="1px" borderColor="blue.100">
              <Heading size="md">Notes</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={2}>
                {selectedClient.notes.map((note, index) => (
                  <Text key={index}>• {note}</Text>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}
      </SimpleGrid>

      <Card>
        <CardHeader bg="green.50" borderBottom="1px" borderColor="green.100">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="md">Linked Projects</Heading>
            <Badge colorScheme="green">{linkedProjects.length} projects</Badge>
          </Flex>
        </CardHeader>
        <CardBody>
          {linkedProjects.length === 0 ? (
            <Text>No projects linked to this client yet.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {linkedProjects.map((project) => (
                <Box 
                  key={String((project._id as any) || '')} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md" 
                  borderColor="gray.200"
                  _hover={{ shadow: 'md', borderColor: 'blue.300' }}
                >
                  <Flex justifyContent="space-between" mb={2}>
                    <Heading size="sm">{project.title}</Heading>
                    <HStack>
                      <Badge colorScheme={
                        project.status === 'Active' ? 'green' : 
                        project.status === 'Paused' ? 'yellow' : 'blue'
                      }>
                        {project.status}
                      </Badge>
                      <IconButton
                        aria-label="View project"
                        icon={<FaLink />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => navigate(`/admin-dashboard/projects/${project._id}`)}
                      />
                    </HStack>
                  </Flex>
                  <Text fontSize="sm" noOfLines={2}>
                    {project.description}
                  </Text>
                  <HStack mt={2} fontSize="xs" color="gray.500">
                    <Text>Start: {new Date(project.startDate).toLocaleDateString()}</Text>
                    <Text>Deadline: {new Date(project.deadline).toLocaleDateString()}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default ClientDetails; 