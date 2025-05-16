import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  VStack,
  Badge,
  Flex,
  Icon,
  Button,
  Divider,
  Image,
  Grid,
  GridItem,
  Spinner,
  Center,
  Link,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaFigma, FaPalette, FaLightbulb, FaTasks, FaRegClock, FaExternalLinkAlt } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import Navbar from '../../components/layout/Navbar';
import { motion } from 'framer-motion';

const DesignerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Mock data for demonstration
  const designProjects = [
    {
      id: '1',
      title: 'E-commerce App Redesign',
      client: 'Fashion Forward',
      status: 'In Progress',
      deadline: '2023-12-15',
      figmaLink: 'https://figma.com/file/123',
      thumbnailUrl: 'https://via.placeholder.com/300x200?text=E-commerce+Redesign',
      completionPercent: 65,
      tags: ['Mobile App', 'UI/UX', 'E-commerce']
    },
    {
      id: '2',
      title: 'Corporate Website',
      client: 'TechGlobal Inc.',
      status: 'Review',
      deadline: '2023-11-30',
      figmaLink: 'https://figma.com/file/456',
      thumbnailUrl: 'https://via.placeholder.com/300x200?text=Corporate+Website',
      completionPercent: 90,
      tags: ['Website', 'Corporate', 'Responsive']
    },
    {
      id: '3',
      title: 'Mobile Banking App',
      client: 'SecureBank',
      status: 'Completed',
      deadline: '2023-10-20',
      figmaLink: 'https://figma.com/file/789',
      thumbnailUrl: 'https://via.placeholder.com/300x200?text=Banking+App',
      completionPercent: 100,
      tags: ['Mobile App', 'Fintech', 'Security']
    }
  ];
  
  // Get status color for display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'blue';
      case 'Review':
        return 'orange';
      case 'Completed':
        return 'green';
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
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Calculate metrics
  const activeProjects = designProjects.filter(p => p.status !== 'Completed').length;
  const completedProjects = designProjects.filter(p => p.status === 'Completed').length;
  const averageCompletion = Math.round(
    designProjects.reduce((sum, p) => sum + p.completionPercent, 0) / designProjects.length
  );

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={2} bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text">
              Designer Dashboard
            </Heading>
            <Text color="gray.600">
              {user?.name} - Design Tools: {user?.toolsUsed?.join(', ') || 'Adobe XD, Figma, Sketch'}
            </Text>
          </Box>
          
          <Divider />
          
          {/* Key Metrics */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="purple.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaPalette} color="white" />
                    </Box>
                    <StatLabel>Total Projects</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{designProjects.length}</StatNumber>
                  <StatHelpText>Design projects</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="blue.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaTasks} color="white" />
                    </Box>
                    <StatLabel>Active Designs</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{activeProjects}</StatNumber>
                  <StatHelpText>In progress & reviews</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="green.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaLightbulb} color="white" />
                    </Box>
                    <StatLabel>Completed</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{completedProjects}</StatNumber>
                  <StatHelpText>Approved designs</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <HStack>
                    <Box bg="orange.500" w={8} h={8} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FaRegClock} color="white" />
                    </Box>
                    <StatLabel>Avg. Completion</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{averageCompletion}%</StatNumber>
                  <StatHelpText>Across all projects</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
          
          {/* Design Projects */}
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Recent Design Projects</Heading>
                <Button 
                  colorScheme="brand" 
                  size="sm"
                  onClick={() => navigate('/user-dashboard/designs')}
                >
                  View All Designs
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {designProjects.map(project => (
                  <Card key={project.id} overflow="hidden" variant="outline" _hover={{ shadow: 'md' }}>
                    <Image 
                      src={project.thumbnailUrl} 
                      alt={project.title}
                      objectFit="cover"
                      height="150px"
                    />
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Heading size="md">{project.title}</Heading>
                        <Text color="gray.600">Client: {project.client}</Text>
                        
                        <HStack justify="space-between" width="100%">
                          <Badge colorScheme={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Text fontSize="sm" color="gray.500">
                            Due: {formatDate(project.deadline)}
                          </Text>
                        </HStack>
                        
                        <Wrap spacing={2} mt={2}>
                          {project.tags.map((tag, index) => (
                            <WrapItem key={index}>
                              <Tag size="sm" colorScheme="brand" borderRadius="full">
                                <TagLabel>{tag}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                        
                        <Link 
                          href={project.figmaLink} 
                          isExternal 
                          color="brand.500"
                          display="flex"
                          alignItems="center"
                          mt={2}
                        >
                          <Icon as={FaFigma} mr={1} />
                          Open in Figma
                          <Icon as={FaExternalLinkAlt} boxSize={3} ml={1} />
                        </Link>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
          
          {/* Design Tools & Resources */}
          <Card>
            <CardHeader>
              <Heading size="md">Design Tools & Resources</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Heading size="sm" mb={4}>Quick Actions</Heading>
                  <VStack spacing={4} align="stretch">
                    <Button leftIcon={<Icon as={FaFigma} />} colorScheme="purple" onClick={() => window.open('https://figma.com', '_blank')}>
                      Open Figma
                    </Button>
                    <Button colorScheme="blue" onClick={() => navigate('/user-dashboard/design-system')}>
                      Company Design System
                    </Button>
                    <Button colorScheme="teal" onClick={() => navigate('/user-dashboard/assets')}>
                      Asset Library
                    </Button>
                  </VStack>
                </Box>
                
                <Box>
                  <Heading size="sm" mb={4}>Team Collaboration</Heading>
                  <VStack spacing={4} align="stretch">
                    <Button colorScheme="green" onClick={() => navigate('/user-dashboard/feedback')}>
                      Design Feedback
                    </Button>
                    <Button colorScheme="orange" onClick={() => navigate('/user-dashboard/handoff')}>
                      Developer Handoff
                    </Button>
                  </VStack>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default DesignerDashboard; 