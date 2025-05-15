import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Badge,
  HStack,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Container,
  VStack,
  Progress,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchUserProjects } from '../../features/projects/projectSlice';
import { motion } from 'framer-motion';
import { listItemVariants, fadeInVariants } from '../../utils/animations';
import AnimatedSpinner from '../../components/ui/AnimatedSpinner';
import Navbar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { userProjects, loading } = useAppSelector((state) => state.projects);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);
  
  const handleViewProject = (id: string) => {
    navigate(`/user-dashboard/projects/${id}`);
  };
  
  const filteredProjects = userProjects.filter(project => 
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
            title="My Projects" 
            backButtonLink="/user-dashboard"
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
            <VStack spacing={4} align="stretch">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project._id}
                  as={motion.div}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={listItemVariants}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  cursor="pointer"
                  onClick={() => handleViewProject(project._id)}
                  shadow="md"
                >
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">{project.title}</Heading>
                      <Badge colorScheme={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={3}>
                      <Text color="gray.600" mb={{ base: 2, md: 0 }}>
                        Client: {project.clientName || 'N/A'}
                      </Text>
                      <HStack spacing={4}>
                        <Text color="gray.600">Start: {formatDate(project.startDate)}</Text>
                        <Text color="gray.600">Due: {formatDate(project.deadline)}</Text>
                      </HStack>
                    </Flex>
                    
                    <Box mb={4}>
                      <Text fontWeight="medium" mb={1}>Progress ({project.progressPercent || 0}%)</Text>
                      <Progress 
                        value={project.progressPercent || 0} 
                        colorScheme={getStatusColor(project.status)} 
                        borderRadius="full"
                      />
                    </Box>
                    
                    <Wrap spacing={2} mb={2}>
                      {project.techStack.map((tech, index) => (
                        <WrapItem key={index}>
                          <Tag size="sm" colorScheme="cyan" borderRadius="full">
                            <TagLabel>{tech}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                    
                    <Text color="gray.700" noOfLines={2}>
                      {project.description}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          ) : (
            <Box p={8} textAlign="center" bg="white" borderRadius="lg" boxShadow="md">
              <Heading size="md" mb={4} color="gray.600">No projects found</Heading>
              <Text color="gray.500">
                {searchTerm 
                  ? "No projects match your search criteria"
                  : "You currently don't have any projects assigned to you."}
              </Text>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Projects; 