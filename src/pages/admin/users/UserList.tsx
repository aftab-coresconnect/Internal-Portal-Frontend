import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Spinner,
  Text,
  Center,
  TableContainer,
  Tooltip
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { User } from '../../../features/auth/authSlice';
import { deleteUser } from '../../../features/auth/authActions';
import { deleteClient } from '../../../features/clients/clientActions';

interface UserListProps {
  users: User[] | any[]; // Make it more flexible for client data
  isLoading: boolean;
  onEditUser: (user: User | any) => void;
  isClientTab?: boolean; // Flag to indicate if we're in the client tab
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  isLoading, 
  onEditUser, 
  isClientTab = false
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (userId: string) => {
    if (isClientTab) {
      if (window.confirm('Are you sure you want to delete this client?')) {
        dispatch(deleteClient(userId));
      }
    } else {
      if (window.confirm('Are you sure you want to delete this user?')) {
        dispatch(deleteUser(userId));
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner />
      </Center>
    );
  }

  // No users state
  if (users.length === 0) {
    return (
      <Center h="200px">
        <Text color="gray.500">
          {isClientTab ? 'No clients found' : 'No users found'}
        </Text>
      </Center>
    );
  }

  // Get badge color based on role
  const getBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'teamLead':
        return 'orange';
      case 'developer':
        return 'blue';
      case 'client':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Render user list
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>{isClientTab ? 'Company' : 'Department'}</Th>
            <Th>Status</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Badge 
                  colorScheme={getBadgeColor(user.role)}
                >
                  {user.role}
                </Badge>
              </Td>
              <Td>
                {isClientTab 
                  ? user.companyName || '-'
                  : user.department || '-'}
              </Td>
              <Td>
                <Badge 
                  colorScheme={user.isActive ? 'green' : 'gray'}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Td>
              <Td isNumeric>
                <Tooltip label={isClientTab ? "Edit client" : "Edit user"}>
                  <IconButton
                    aria-label={isClientTab ? "Edit client" : "Edit user"}
                    icon={<EditIcon />}
                    size="sm"
                    mr={2}
                    onClick={() => onEditUser(user)}
                  />
                </Tooltip>
                <Tooltip label={isClientTab ? "Delete client" : "Delete user"}>
                  <IconButton
                    aria-label={isClientTab ? "Delete client" : "Delete user"}
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(user._id)}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default UserList; 