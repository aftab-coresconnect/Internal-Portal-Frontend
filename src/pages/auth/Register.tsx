import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Container,
  useToast,
  Link,
  Select,
  HStack,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { registerUser } from '../../features/auth/authActions';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('developer');
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If user is already logged in, redirect based on role
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password must be at least 6 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const userData = await dispatch(registerUser({
        firstName,
        lastName,
        email,
        password,
        role,
      }));
      
      toast({
        title: 'Registration successful',
        description: `Welcome ${userData.firstName}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      // Error is handled by the reducer and displayed below
    }
  };

  return (
    <Container maxW="md" pt={6} pb={10}>
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">Create Your Account</Heading>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <Box as="form" onSubmit={handleSubmit} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
          <VStack spacing={4}>
            <HStack spacing={4}>
              <FormControl id="firstName" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </FormControl>
              
              <FormControl id="lastName" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </FormControl>
            </HStack>
            
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
              />
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
              />
            </FormControl>
            
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </FormControl>
            
            <FormControl id="role">
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="developer">Developer</option>
                <option value="teamLead">Team Lead</option>
                <option value="client">Client</option>
              </Select>
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="blue" 
              width="full" 
              mt={4} 
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </VStack>
        </Box>
        
        <Text textAlign="center">
          Already have an account? <Link as={RouterLink} to="/login" color="blue.500">Login here</Link>
        </Text>
        
        <Text textAlign="center" fontSize="sm" color="gray.500">
          Admin login: aftab@coresconnect.com | Password: 123456
        </Text>
      </VStack>
    </Container>
  );
};

export default Register; 