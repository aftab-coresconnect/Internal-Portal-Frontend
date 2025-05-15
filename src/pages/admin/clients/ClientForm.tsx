import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Heading,
  VStack,
  HStack,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  InputGroup,
  InputRightElement,
  Flex,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
  getClientById as fetchClientById,
  createClient,
  updateClient
} from '../../../features/clients/clientActions';
import {
  clearSelectedClient,
  clearClientError,
  clearClientMessage,
  ClientFormData,
  Address
} from '../../../features/clients/clientSlice';

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { selectedClient, isLoading, error, message } = useAppSelector((state) => state.clients);

  // Form state
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    notes: [],
    painPoints: [],
  });
  
  const [note, setNote] = useState('');
  const [painPoint, setPainPoint] = useState('');
  
  // Load client data if editing
  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchClientById(id));
    }
    
    // Cleanup
    return () => {
      dispatch(clearSelectedClient());
      dispatch(clearClientError());
      dispatch(clearClientMessage());
    };
  }, [dispatch, isEdit, id]);
  
  // Populate form with client data
  useEffect(() => {
    if (isEdit && selectedClient) {
      setFormData({
        name: selectedClient.name,
        email: selectedClient.email,
        phone: selectedClient.phone || '',
        companyName: selectedClient.companyName || '',
        website: selectedClient.website || '',
        address: {
          street: selectedClient.address?.street || '',
          city: selectedClient.address?.city || '',
          state: selectedClient.address?.state || '',
          zipCode: selectedClient.address?.zipCode || '',
          country: selectedClient.address?.country || '',
        },
        notes: selectedClient.notes || [],
        painPoints: selectedClient.painPoints || [],
      });
    }
  }, [selectedClient, isEdit]);
  
  // Handle success/error states
  useEffect(() => {
    if (message) {
      toast({
        title: isEdit ? 'Client updated' : 'Client created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      dispatch(clearClientMessage());
      navigate('/admin-dashboard/clients');
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
  }, [message, error, toast, dispatch, navigate, isEdit]);
  
  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address as Address,
        [name]: value,
      },
    });
  };
  
  const handleAddNote = () => {
    if (note.trim()) {
      setFormData({
        ...formData,
        notes: [...(formData.notes || []), note.trim()],
      });
      setNote('');
    }
  };
  
  const handleRemoveNote = (index: number) => {
    const updatedNotes = [...(formData.notes || [])];
    updatedNotes.splice(index, 1);
    setFormData({
      ...formData,
      notes: updatedNotes,
    });
  };
  
  const handleAddPainPoint = () => {
    if (painPoint.trim()) {
      setFormData({
        ...formData,
        painPoints: [...(formData.painPoints || []), painPoint.trim()],
      });
      setPainPoint('');
    }
  };
  
  const handleRemovePainPoint = (index: number) => {
    const updatedPainPoints = [...(formData.painPoints || [])];
    updatedPainPoints.splice(index, 1);
    setFormData({
      ...formData,
      painPoints: updatedPainPoints,
    });
  };
  
  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNote();
    }
  };
  
  const handlePainPointKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPainPoint();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: 'Missing required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (isEdit && id) {
      dispatch(updateClient({ clientId: id, clientData: formData }));
    } else {
      dispatch(createClient(formData));
    }
  };
  
  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg">{isEdit ? 'Edit Client' : 'Add New Client'}</Heading>
        <Button 
          leftIcon={<FaArrowLeft />} 
          variant="outline" 
          onClick={() => navigate('/admin-dashboard/clients')}
        >
          Back to Clients
        </Button>
      </Flex>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Client Name</FormLabel>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter client name" 
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter client email" 
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Enter client phone number" 
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Company Name</FormLabel>
                <Input 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  placeholder="Enter company name" 
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              placeholder="Enter company website" 
            />
          </FormControl>
          
          <Heading size="md" pt={2}>Address Information</Heading>
          <Divider />
          
          <FormControl>
            <FormLabel>Street Address</FormLabel>
            <Input 
              name="street" 
              value={formData.address?.street} 
              onChange={handleAddressChange} 
              placeholder="Enter street address" 
            />
          </FormControl>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input 
                  name="city" 
                  value={formData.address?.city} 
                  onChange={handleAddressChange} 
                  placeholder="Enter city" 
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>State/Province</FormLabel>
                <Input 
                  name="state" 
                  value={formData.address?.state} 
                  onChange={handleAddressChange} 
                  placeholder="Enter state or province" 
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Postal/ZIP Code</FormLabel>
                <Input 
                  name="zipCode" 
                  value={formData.address?.zipCode} 
                  onChange={handleAddressChange} 
                  placeholder="Enter postal or ZIP code" 
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Input 
                  name="country" 
                  value={formData.address?.country} 
                  onChange={handleAddressChange} 
                  placeholder="Enter country" 
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <Heading size="md" pt={2}>Additional Information</Heading>
          <Divider />
          
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <InputGroup>
              <Input 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="Add a note about this client" 
                onKeyDown={handleNoteKeyDown}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleAddNote}>
                  <FaPlus />
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText>Press Enter or click + to add</FormHelperText>
          </FormControl>
          
          <Box>
            <Wrap spacing={2}>
              {formData.notes?.map((noteItem, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>{noteItem}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveNote(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
          
          <FormControl>
            <FormLabel>Pain Points</FormLabel>
            <InputGroup>
              <Input 
                value={painPoint} 
                onChange={(e) => setPainPoint(e.target.value)} 
                placeholder="Add a client pain point or need" 
                onKeyDown={handlePainPointKeyDown}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleAddPainPoint}>
                  <FaPlus />
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText>Specific challenges or needs that the client has mentioned</FormHelperText>
          </FormControl>
          
          <Box>
            <Wrap spacing={2}>
              {formData.painPoints?.map((point, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="red">
                    <TagLabel>{point}</TagLabel>
                    <TagCloseButton onClick={() => handleRemovePainPoint(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
          
          <HStack spacing={4} mt={5} justify="flex-end">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin-dashboard/clients')}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              type="submit" 
              isLoading={isLoading}
            >
              {isEdit ? 'Update Client' : 'Create Client'}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default ClientForm; 