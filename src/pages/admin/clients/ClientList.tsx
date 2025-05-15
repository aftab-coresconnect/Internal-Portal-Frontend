import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { fetchClients, deleteClient } from '../../../features/clients/clientActions';
import { Client, clearClientError, clearClientMessage } from '../../../features/clients/clientSlice';

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const { clients, isLoading, error, message } = useAppSelector((state) => state.clients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchClients());

    return () => {
      // Cleanup
      dispatch(clearClientError());
      dispatch(clearClientMessage());
    };
  }, [dispatch]);

  // Handle success/error notifications
  useEffect(() => {
    if (message) {
      toast({
        title: 'Success',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      dispatch(clearClientMessage());
    }

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
  }, [message, error, toast, dispatch]);

  // Navigate to different pages  
  // handleAddClient is not used - using inline navigation instead  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars  
  const handleAddClient = () => {    
    navigate('/admin-dashboard/clients/add');  
  };

  const handleEditClient = (id: string) => {
    navigate(`/admin-dashboard/clients/edit/${id}`);
  };

  const handleViewClient = (id: string) => {
    navigate(`/admin-dashboard/clients/${id}`);
  };

  // Handle delete confirmation
  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    onOpen();
  };

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      dispatch(deleteClient(selectedClient._id));
      onClose();
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Clients</Heading>
        <HStack>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="outline"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={() => navigate('/admin-dashboard/clients/add')}
          >
            Add Client
          </Button>
        </HStack>
      </Flex>

      <Box mb={5}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Box>

      {isLoading ? (
        <Text>Loading clients...</Text>
      ) : clients.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl">No clients found.</Text>
          <Text color="gray.500">Click "Add New Client" to create your first client.</Text>
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Projects</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredClients.map((client) => (
                <Tr key={client._id}>
                  <Td fontWeight="medium">{client.name}</Td>
                  <Td>{client.companyName || '-'}</Td>
                  <Td>{client.email}</Td>
                  <Td>{client.phone || '-'}</Td>
                  <Td>{client.linkedProjects?.length || 0}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="View client"
                        icon={<FaEye />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleViewClient(client._id)}
                      />
                      <IconButton
                        aria-label="Edit client"
                        icon={<FaEdit />}
                        size="sm"
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => handleEditClient(client._id)}
                      />
                      <IconButton
                        aria-label="Delete client"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(client)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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
              Delete Client
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedClient?.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ClientList; 