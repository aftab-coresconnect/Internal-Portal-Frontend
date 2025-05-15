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
import { getClientById } from '../../../features/clients/clientActions';
import { clearSelectedClient, clearClientError, clearClientMessage } from '../../../features/clients/clientSlice';
import { fetchProjects } from '../../../features/projects/projectSlice';
import { Project } from '../../../features/projects/projectSlice';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [linkedProjects, setLinkedProjects] = useState<Project[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  const { selectedClient, isLoading, error } = useAppSelector((state) => state.clients);
  const { projects } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (id) {
      dispatch(getClientById(id));
      dispatch(fetchProjects());
    }

    return () => {
      dispatch(clearSelectedClient());
      dispatch(clearClientError());
      dispatch(clearClientMessage());
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
      if (selectedClient.linkedProjects && Array.isArray(selectedClient.linkedProjects)) {
        // Type assertion to help TypeScript
        const linkedProjectsData = selectedClient.linkedProjects as any[];
        
        // Try to detect if linkedProjects are populated objects or just IDs
        const isPopulated = linkedProjectsData.length > 0 && 
          typeof linkedProjectsData[0] === 'object' && 
          linkedProjectsData[0] !== null && 
          'title' in linkedProjectsData[0];
        
        if (debugMode) {
          console.log('linkedProjects is populated with objects?', isPopulated);
        }
        
        if (isPopulated) {
          // The backend already populated the data, use it directly
          setLinkedProjects(linkedProjectsData as unknown as Project[]);
        } else {
          // We need to match IDs with projects from Redux store
          const matchedProjects = projects.filter(project => {
            return linkedProjectsData.some(linkedId => {
              // Handle different types of IDs (string vs object)
              const linkedIdStr = typeof linkedId === 'object' && linkedId !== null 
                ? String(linkedId) 
                : String(linkedId);
              
              const projectIdStr = String(project._id);
              
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
      dispatch(clearClientError());
    }
  }, [error, toast, dispatch]);

  const handleEditClient = () => {
    navigate(`/admin-dashboard/clients/edit/${id}`);
  };

  if (isLoading) {
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
                  ? typeof selectedClient.linkedProjects === 'object' 
                    ? 'Array' + (Array.isArray(selectedClient.linkedProjects) && selectedClient.linkedProjects.length > 0 
                      ? ` of ${typeof selectedClient.linkedProjects[0]}` 
                      : ' (empty)')
                    : typeof selectedClient.linkedProjects
                  : 'null/undefined'}
              </Code>
              <Text fontWeight="bold">Raw linkedProjects data:</Text>
              <Code>
                {selectedClient.linkedProjects
                  ? JSON.stringify((selectedClient.linkedProjects as any[]).map((lp: any) =>
                      typeof lp === 'object' && lp !== null && '_id' in lp
                        ? lp._id
                        : lp
                    ), null, 2)
                  : 'None'}
              </Code>
            </VStack>
          </CardBody>
        </Card>
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>
        <Card>
          <CardHeader bg="blue.50">
            <Heading size="md">Client Information</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={2} spacingY={2}>
              <Text fontWeight="bold">Name:</Text>
              <Text>{selectedClient.name}</Text>
              
              <Text fontWeight="bold">Email:</Text>
              <Text>{selectedClient.email}</Text>
              
              <Text fontWeight="bold">Phone:</Text>
              <Text>{selectedClient.phone || 'Not provided'}</Text>
              
              <Text fontWeight="bold">Company:</Text>
              <Text>{selectedClient.companyName || 'Not provided'}</Text>
              
              <Text fontWeight="bold">Website:</Text>
              <Box>
                {selectedClient.website ? (
                  <Link href={selectedClient.website} isExternal>
                    {selectedClient.website} <FaExternalLinkAlt size="0.8em" />
                  </Link>
                ) : (
                  <Text>Not provided</Text>
                )}
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader bg="blue.50">
            <Heading size="md">Address</Heading>
          </CardHeader>
          <CardBody>
            {selectedClient.address && Object.values(selectedClient.address).some(value => value) ? (
              <VStack align="start" spacing={1}>
                {selectedClient.address.street && <Text>{selectedClient.address.street}</Text>}
                {(selectedClient.address.city || selectedClient.address.state || selectedClient.address.zipCode) && (
                  <Text>
                    {[
                      selectedClient.address.city,
                      selectedClient.address.state,
                      selectedClient.address.zipCode
                    ].filter(Boolean).join(', ')}
                  </Text>
                )}
                {selectedClient.address.country && <Text>{selectedClient.address.country}</Text>}
              </VStack>
            ) : (
              <Text>No address information provided</Text>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>
        <Card>
          <CardHeader bg="blue.50">
            <Heading size="md">Pain Points</Heading>
          </CardHeader>
          <CardBody>
            {selectedClient.painPoints && selectedClient.painPoints.length > 0 ? (
              <Wrap spacing={2}>
                {selectedClient.painPoints.map((point, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" colorScheme="red" borderRadius="full">
                      {point}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            ) : (
              <Text>No pain points recorded</Text>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader bg="blue.50">
            <Heading size="md">Notes</Heading>
          </CardHeader>
          <CardBody>
            {selectedClient.notes && selectedClient.notes.length > 0 ? (
              <VStack align="start" spacing={2}>
                {selectedClient.notes.map((note, index) => (
                  <Text key={index}>• {note}</Text>
                ))}
              </VStack>
            ) : (
              <Text>No notes recorded</Text>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Card mb={5}>
        <CardHeader bg="blue.50">
          <Heading size="md">Projects</Heading>
        </CardHeader>
        <CardBody>
          {linkedProjects.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {linkedProjects.map((project) => (
                <Card key={project._id} variant="outline">
                  <CardHeader bg={`${getBadgeColor(project.status)}.50`} p={3}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading size="sm">{project.title}</Heading>
                      <Badge colorScheme={getBadgeColor(project.status)}>
                        {project.status}
                      </Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody p={3}>
                    <Text noOfLines={2} fontSize="sm" mb={2}>
                      {project.description}
                    </Text>
                    <Button 
                      size="sm" 
                      leftIcon={<FaLink />} 
                      variant="outline"
                      onClick={() => navigate(`/admin-dashboard/projects/${project._id}`)}
                    >
                      View Project
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text>No projects linked to this client</Text>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

// Helper function to get badge color based on status
const getBadgeColor = (status: string): string => {
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

export default ClientDetails; 