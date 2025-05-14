import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Container,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaUsers, FaProjectDiagram, FaBuilding, FaChartBar, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../features/auth/authActions';
import { motion } from 'framer-motion';
import AnimatedCard from '../../components/ui/AnimatedCard';
import AnimatedNumberInput from '../../components/ui/AnimatedNumberInput';
import Navbar from '../../components/layout/Navbar';
import { fadeInVariants } from '../../utils/animations';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navigateToProjects = () => {
    navigate('/admin-dashboard/projects');
  };
  
  const navigateToClients = () => {
    navigate('/admin-dashboard/clients');
  };

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5 
      } 
    }
  };

  // Stats animation variants
  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        delay: 0.2 
      } 
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box>
              <Heading 
                size="lg" 
                mb={2}
                bgGradient="linear(to-r, brand.500, accent.500)"
                bgClip="text"
              >
                Welcome to Admin Dashboard
              </Heading>
              <Text color="gray.600">
                Manage your organization, users, and resources from this central interface.
              </Text>
            </Box>
          </motion.div>

          <Divider />

          <motion.div
            variants={statsVariants}
            initial="hidden"
            animate="visible"
          >
            <StatGroup>
              <Stat
                bg={cardBg}
                p={5}
                borderRadius="lg"
                boxShadow="md"
              >
                <StatLabel>Total Users</StatLabel>
                <StatNumber>
                  <AnimatedNumberInput value={25} duration={1500} />
                </StatNumber>
                <Text color="gray.500">Active developers</Text>
              </Stat>
              <Stat
                bg={cardBg}
                p={5}
                borderRadius="lg"
                boxShadow="md"
              >
                <StatLabel>Active Projects</StatLabel>
                <StatNumber>
                  <AnimatedNumberInput value={12} duration={1500} />
                </StatNumber>
                <Text color="gray.500">In progress</Text>
              </Stat>
              <Stat
                bg={cardBg}
                p={5}
                borderRadius="lg"
                boxShadow="md"
              >
                <StatLabel>Clients</StatLabel>
                <StatNumber>
                  <AnimatedNumberInput value={8} duration={1500} />
                </StatNumber>
                <Text color="gray.500">Active accounts</Text>
              </Stat>
            </StatGroup>
          </motion.div>

          <Divider />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid 
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} 
              gap={6}
            >
              <GridItem>
                <motion.div variants={cardVariants}>
                  <AnimatedCard onClick={() => {}} delay={0.1}>
                    <VStack spacing={3} align="center" p={5}>
                      <Flex
                        boxSize={10}
                        bg="brand.500"
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaUsers} color="white" />
                      </Flex>
                      <Heading size="md">Manage Users</Heading>
                      <Text textAlign="center">
                        Add, edit, or remove users and manage their permissions.
                      </Text>
                    </VStack>
                  </AnimatedCard>
                </motion.div>
              </GridItem>
              
              <GridItem>
                <motion.div variants={cardVariants}>
                  <AnimatedCard onClick={navigateToProjects} delay={0.2}>
                    <VStack spacing={3} align="center" p={5}>
                      <Flex
                        boxSize={10}
                        bg="success.500"
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaProjectDiagram} color="white" />
                      </Flex>
                      <Heading size="md">Projects</Heading>
                      <Text textAlign="center">
                        Create and assign projects to teams and track their progress.
                      </Text>
                    </VStack>
                  </AnimatedCard>
                </motion.div>
              </GridItem>
              
              <GridItem>
                <motion.div variants={cardVariants}>
                  <AnimatedCard onClick={navigateToClients} delay={0.3}>
                    <VStack spacing={3} align="center" p={5}>
                      <Flex
                        boxSize={10}
                        bg="accent.500"
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBuilding} color="white" />
                      </Flex>
                      <Heading size="md">Clients</Heading>
                      <Text textAlign="center">
                        Manage clients, contact information, and linked projects.
                      </Text>
                    </VStack>
                  </AnimatedCard>
                </motion.div>
              </GridItem>
              
              <GridItem>
                <motion.div variants={cardVariants}>
                  <AnimatedCard onClick={() => {}} delay={0.4}>
                    <VStack spacing={3} align="center" p={5}>
                      <Flex
                        boxSize={10}
                        bg="purple.500"
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaChartBar} color="white" />
                      </Flex>
                      <Heading size="md">Reports</Heading>
                      <Text textAlign="center">
                        View analytics and generate reports on performance and activities.
                      </Text>
                    </VStack>
                  </AnimatedCard>
                </motion.div>
              </GridItem>
              
              <GridItem>
                <motion.div variants={cardVariants}>
                  <AnimatedCard onClick={() => {}} delay={0.5}>
                    <VStack spacing={3} align="center" p={5}>
                      <Flex
                        boxSize={10}
                        bg="orange.500"
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaCalendarAlt} color="white" />
                      </Flex>
                      <Heading size="md">Schedule</Heading>
                      <Text textAlign="center">
                        Manage timelines, deadlines, and project schedules.
                      </Text>
                    </VStack>
                  </AnimatedCard>
                </motion.div>
              </GridItem>
              
              <GridItem>
                <motion.div variants={cardVariants}>
                  <AnimatedCard onClick={() => {}} delay={0.6}>
                    <VStack spacing={3} align="center" p={5}>
                      <Flex
                        boxSize={10}
                        bg="cyan.500"
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaRocket} color="white" />
                      </Flex>
                      <Heading size="md">Deployment</Heading>
                      <Text textAlign="center">
                        Track project deployments and production releases.
                      </Text>
                    </VStack>
                  </AnimatedCard>
                </motion.div>
              </GridItem>
            </Grid>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 