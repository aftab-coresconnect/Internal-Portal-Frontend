import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Flex,
  Text,
  Heading,
  Spinner,
  Progress,
  IconButton,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { AppDispatch, RootState } from '../../store';
import { 
  fetchProjectMilestones, 
  deleteMilestone,
  Milestone,
  resetMilestoneState
} from '../../features/milestones/milestoneSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

interface MilestoneListProps {
  projectId: string;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ projectId }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  const [selectedMilestoneId, setSelectedMilestoneId] = React.useState<string>('');
  
  const { projectMilestones, loading, error, success } = useAppSelector(
    (state: RootState) => state.milestones
  );

  useEffect(() => {
    dispatch(fetchProjectMilestones(projectId));

    return () => {
      dispatch(resetMilestoneState());
    };
  }, [dispatch, projectId]);

  const handleDelete = (id: string) => {
    setSelectedMilestoneId(id);
    onOpen();
  };

  const confirmDelete = () => {
    dispatch(deleteMilestone(selectedMilestoneId));
    onClose();
  };

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
  const formatDate = (dateString: string) => {
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

  return (
    <Box>

      {projectMilestones.length === 0 ? (
        <Box textAlign="center" py={6} bg="gray.50" borderRadius="md">
          <Text color="gray.500">No milestones found for this project</Text>
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                <Th>Due Date</Th>
                <Th>Progress</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projectMilestones.map((milestone: Milestone) => (
                <Tr key={milestone._id}>
                  <Td fontWeight="bold">
                    <RouterLink to={`/projects/${projectId}/milestones/${milestone._id}`}>
                      {milestone.title}
                    </RouterLink>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getPriorityColor(milestone.priority)}>
                      {milestone.priority}
                    </Badge>
                  </Td>
                  <Td>{formatDate(milestone.dueDate)}</Td>
                  <Td>
                    <Flex alignItems="center">
                      <Progress
                        value={milestone.progressPercentage}
                        size="sm"
                        width="100px"
                        colorScheme="blue"
                        mr={2}
                      />
                      <Text fontSize="sm">{milestone.progressPercentage}%</Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Flex>
                      <IconButton
                        as={RouterLink}
                        to={`/projects/${projectId}/milestones/${milestone._id}/edit`}
                        icon={<EditIcon />}
                        aria-label="Edit"
                        size="sm"
                        mr={2}
                        colorScheme="blue"
                        variant="ghost"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete"
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(milestone._id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Milestone
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this milestone? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default MilestoneList; 