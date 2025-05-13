import React, { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Badge,
  Grid,
  GridItem,
  Progress,
  Divider,
  List,
  ListItem,
  Spinner,
  IconButton,
  useToast,
  Avatar,
  AvatarGroup,
  Tag,
  TagLabel,
  HStack,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import { AppDispatch, RootState } from '../../store';
import { fetchMilestoneById } from '../../features/milestones/milestoneSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

const MilestoneDetail: React.FC = () => {
  const { projectId, milestoneId } = useParams<{ projectId: string; milestoneId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { selectedMilestone, loading, error } = useAppSelector(
    (state: RootState) => state.milestones
  );

  useEffect(() => {
    if (milestoneId) {
      dispatch(fetchMilestoneById(milestoneId));
    }
  }, [dispatch, milestoneId]);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started':
        return 'gray';
      case 'In Progress':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Delayed':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'yellow';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10} color="red.500">
        <Text>Error: {error}</Text>
      </Box>
    );
  }

  if (!selectedMilestone) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Milestone not found</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header with buttons */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Text color="gray.500" fontSize="sm">
            <RouterLink to={`/projects/${projectId}`}>Back to Project</RouterLink>
          </Text>
          <Heading as="h2" size="lg">
            {selectedMilestone.title}
          </Heading>
        </Box>
        <Flex gap={3}>
          <Button
            as={RouterLink}
            to={`/projects/${projectId}/milestones/${milestoneId}/edit`}
            colorScheme="blue"
            variant="outline"
          >
            Edit Milestone
          </Button>
        </Flex>
      </Flex>

      {/* Progress section */}
      <Card mb={6}>
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Heading size="md" mb={2}>
                Progress
              </Heading>
              <Progress
                value={selectedMilestone.progressPercentage}
                size="lg"
                width="300px"
                colorScheme="blue"
                borderRadius="md"
                mb={2}
              />
              <Text fontWeight="bold">{selectedMilestone.progressPercentage}% Complete</Text>
            </Box>
            <Flex direction="column" align="flex-end">
              <Badge
                colorScheme={getStatusColor(selectedMilestone.status)}
                fontSize="md"
                p={2}
                borderRadius="md"
                mb={2}
              >
                {selectedMilestone.status}
              </Badge>
              <Badge
                colorScheme={getPriorityColor(selectedMilestone.priority)}
                fontSize="md"
                p={2}
                borderRadius="md"
              >
                {selectedMilestone.priority} Priority
              </Badge>
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* Main content grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Left column */}
        <Box>
          {/* Details card */}
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Details</Heading>
            </CardHeader>
            <CardBody>
              <Grid templateColumns="1fr 2fr" gap={4}>
                <GridItem>
                  <Text fontWeight="bold" color="gray.600">
                    Description
                  </Text>
                </GridItem>
                <GridItem>
                  <Text>{selectedMilestone.description}</Text>
                </GridItem>

                <GridItem>
                  <Text fontWeight="bold" color="gray.600">
                    Start Date
                  </Text>
                </GridItem>
                <GridItem>
                  <Text>{formatDate(selectedMilestone.startDate)}</Text>
                </GridItem>

                <GridItem>
                  <Text fontWeight="bold" color="gray.600">
                    Due Date
                  </Text>
                </GridItem>
                <GridItem>
                  <Text>{formatDate(selectedMilestone.dueDate)}</Text>
                </GridItem>

                {selectedMilestone.completedDate && (
                  <>
                    <GridItem>
                      <Text fontWeight="bold" color="gray.600">
                        Completed Date
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text>{formatDate(selectedMilestone.completedDate)}</Text>
                    </GridItem>
                  </>
                )}
              </Grid>
            </CardBody>
          </Card>

          {/* Assigned Team Members */}
          <Card>
            <CardHeader>
              <Heading size="md">Assigned Team Members</Heading>
            </CardHeader>
            <CardBody>
              {selectedMilestone.assignedTo && selectedMilestone.assignedTo.length > 0 ? (
                <List spacing={3}>
                  {selectedMilestone.assignedTo.map((member) => (
                    <ListItem key={member._id}>
                      <Flex alignItems="center">
                        <Avatar size="sm" name={member.name} mr={3} />
                        <Box>
                          <Text fontWeight="bold">{member.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {member.role}
                          </Text>
                        </Box>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text color="gray.500">No team members assigned</Text>
              )}
            </CardBody>
          </Card>
        </Box>

        {/* Right column */}
        <Box>
          {/* Dependencies */}
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Dependencies</Heading>
            </CardHeader>
            <CardBody>
              {selectedMilestone.dependencies && selectedMilestone.dependencies.length > 0 ? (
                <List spacing={3}>
                  {selectedMilestone.dependencies.map((dependency) => (
                    <ListItem key={dependency._id}>
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="medium">
                          <RouterLink
                            to={`/projects/${projectId}/milestones/${dependency._id}`}
                          >
                            {dependency.title}
                          </RouterLink>
                        </Text>
                        <Badge colorScheme={getStatusColor(dependency.status)}>
                          {dependency.status}
                        </Badge>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text color="gray.500">No dependencies</Text>
              )}
            </CardBody>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <Heading size="md">Notes</Heading>
            </CardHeader>
            <CardBody>
              {selectedMilestone.notes && selectedMilestone.notes.length > 0 ? (
                <VStack align="stretch" spacing={2}>
                  {selectedMilestone.notes.map((note, index) => (
                    <Box
                      key={index}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor="gray.200"
                    >
                      <Text>{note}</Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">No notes added</Text>
              )}
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default MilestoneDetail; 