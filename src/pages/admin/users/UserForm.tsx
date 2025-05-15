import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  FormHelperText,
  VStack,
  HStack,
  useToast
} from '@chakra-ui/react';
import { User } from '../../../features/auth/authSlice';
import { createUser, updateUser } from '../../../features/auth/authActions';

interface UserFormProps {
  isOpen: boolean;
  user?: User | null;
  onClose: () => void;
  defaultRole?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  user,
  onClose,
  defaultRole = 'developer'
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const isEdit = Boolean(user);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
    title: '',
    department: '',
    isActive: true
  });

  // Set initial form data if editing
  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password
        role: user.role || defaultRole,
        title: user.title || '',
        department: user.department || '',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        role: defaultRole,
        title: '',
        department: '',
        isActive: true
      });
    }
  }, [user, isEdit, defaultRole]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch toggle
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || (!isEdit && !formData.password)) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (isEdit && user) {
      // Update existing user
      dispatch(updateUser({
        userId: user._id,
        userData: {
          name: formData.name,
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {}),
          role: formData.role,
          title: formData.title,
          department: formData.department,
          isActive: formData.isActive
        }
      }));
    } else {
      // Create new user
      dispatch(createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        title: formData.title,
        department: formData.department,
        isActive: formData.isActive
      }));
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEdit ? 'Edit User' : 'Create User'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </FormControl>

            <FormControl isRequired={!isEdit}>
              <FormLabel>{isEdit ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEdit ? 'New password (optional)' : 'Password'}
              />
              {isEdit && (
                <FormHelperText>Leave blank to keep current password</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="teamLead">Team Lead</option>
                <option value="developer">Developer</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Job Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Job title"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Department</FormLabel>
              <Input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="isActive">Active Status</FormLabel>
              <Switch
                id="isActive"
                name="isActive"
                isChecked={formData.isActive}
                onChange={handleSwitchChange}
                colorScheme="green"
              />
              <FormHelperText>
                {formData.isActive ? 'User is active' : 'User is inactive'}
              </FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {isEdit ? 'Update User' : 'Create User'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserForm; 