import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Container,
  VStack,
  Alert,
  AlertIcon,
  Select,
  useToast,
  Text,
  Link,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { register } from '../../features/auth/authActions';
import { FaArrowLeft } from 'react-icons/fa';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('developer');
  const [formError, setFormError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [user, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    
    dispatch(register({ name, email, password, role }));
  };
  
  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="md" p={8} bg="white" borderRadius="lg" boxShadow="lg">
        <VStack spacing={8} w={{ base: "90%", md: "400px" }}>
          <Heading>Register</Heading>
          
          <HStack w="100%" justifyContent="space-between">
            <Button 
              leftIcon={<FaArrowLeft />} 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/home')}
            >
              Back to Home
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              colorScheme="blue" 
              onClick={() => navigate('/login')}
            >
              Already have an account? Login
            </Button>
          </HStack>
          
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          {formError && (
            <Alert status="error">
              <AlertIcon />
              {formError}
            </Alert>
          )}
          
          <Box as="form" w="100%" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </FormControl>
              
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>
              
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
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
                <Select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="developer">Developer</option>
                  <option value="teamLead">Team Lead</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isLoading}
                mt={2}
              >
                Register
              </Button>
            </Stack>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
};

export default Register; 