import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  Button, 
  Flex, 
  useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { RootState } from '../../store';
import { fetchUsers, getUsersByRole } from '../../features/auth/authActions';
import { clearError, clearMessage } from '../../features/auth/authSlice';
import UserList from './users/UserList';
import UserForm from './users/UserForm';
import { fetchClients } from '../../features/clients/clientActions';
import { Client } from '../../features/clients/clientSlice';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, usersByRole, isLoading, error, message } = useSelector(
    (state: RootState) => state.auth
  );
  const { clients, isLoading: clientsLoading } = useSelector(
    (state: RootState) => state.clients
  );
  
  const toast = useToast();
  
  // State variables
  const [tabIndex, setTabIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any>(null);
  
  // Role tabs - these map to the roles in the User model + clients
  const roles = ['admin', 'developer', 'teamLead', 'client'];
  
  // Initial data fetch
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchClients());
  }, [dispatch]);
  
  // Handle role tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    const selectedRole = roles[index];
    
    // For clients tab, we don't need to fetch from users
    if (selectedRole !== 'client') {
      // Fetch users for the selected role if not already loaded
      if (!usersByRole[selectedRole]) {
        dispatch(getUsersByRole(selectedRole));
      }
    }
  };
  
  // Open user form for creating a new user
  const handleAddUser = () => {
    setUserToEdit(null);
    setShowForm(true);
  };
  
  // Open user form for editing an existing user
  const handleEditUser = (user: any) => {
    setUserToEdit(user);
    setShowForm(true);
  };
  
  // Close the user form
  const handleCloseForm = () => {
    setShowForm(false);
    setUserToEdit(null);
  };
  
  // Show toasts for errors and success messages
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => dispatch(clearError())
      });
    }
    
    if (message) {
      toast({
        title: 'Success',
        description: message,
        status: 'success',
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => dispatch(clearMessage())
      });
    }
  }, [error, message, toast, dispatch]);
  
  // Get the appropriate data for the current tab
  const getCurrentData = () => {
    const currentRole = roles[tabIndex];
    
    // For clients tab, return clients from client state
    if (currentRole === 'client') {
      // Map clients to a format compatible with UserList
      return clients.map((client: Client) => ({
        _id: client._id,
        name: client.name,
        email: client.email,
        role: 'client',
        isActive: true,
        companyName: client.companyName || ''
      }));
    }
    
    // For other user types, return filtered users
    return usersByRole[currentRole] || 
      users.filter(user => user.role === currentRole);
  };
  
  // Handle add button click based on current tab
  const handleAddButtonClick = () => {
    if (roles[tabIndex] === 'client') {
      // Navigate to client creation page - use React Router
      navigate('/admin-dashboard/clients/add');
    } else {
      // Open user form for other user types
      handleAddUser();
    }
  };
  
  // Handle edit action based on current tab
  const handleEditItem = (item: any) => {
    if (roles[tabIndex] === 'client') {
      // Navigate to client edit page - use React Router
      navigate(`/admin-dashboard/clients/edit/${item._id}`);
    } else {
      // Open user form for other user types
      handleEditUser(item);
    }
  };
  
  return (
    <Container maxW="container.lg">
      <Box mb={4}>
        <Heading as="h1" size="xl" mb={2}>
          User Management
        </Heading>
        <Text color="gray.600">
          Manage users by role. Create, update, or delete users.
        </Text>
      </Box>
      
      <Box bg="white" shadow="md" borderRadius="md" mb={4}>
        <Tabs index={tabIndex} onChange={handleTabChange} variant="enclosed">
          <Flex borderBottom="1px" borderColor="gray.200" justifyContent="space-between" alignItems="center">
            <TabList>
              {roles.map((role) => (
                <Tab key={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1) + 's'}
                </Tab>
              ))}
            </TabList>
            <Button
              colorScheme="brand"
              leftIcon={<AddIcon />}
              onClick={handleAddButtonClick}
              m={2}
            >
              {roles[tabIndex] === 'client' ? 'Add Client' : 'Add User'}
            </Button>
          </Flex>
          
          <TabPanels>
            {roles.map((role, index) => (
              <TabPanel key={role} p={4}>
                <UserList 
                  users={getCurrentData()}
                  isLoading={role === 'client' ? clientsLoading : isLoading}
                  onEditUser={handleEditItem}
                  isClientTab={role === 'client'}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* User form dialog - don't show for clients */}
      {showForm && roles[tabIndex] !== 'client' && (
        <UserForm 
          isOpen={showForm}
          user={userToEdit}
          onClose={handleCloseForm}
          defaultRole={roles[tabIndex]}
        />
      )}
    </Container>
  );
};

export default UserManagement; 