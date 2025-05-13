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
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { loginUser } from '../../features/auth/authActions';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
    
    if (!email || !password) {
      toast({
        title: 'Please fill all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const userData = await dispatch(loginUser(email, password));
      
      toast({
        title: 'Login successful',
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
    <Container maxW="md" pt={10}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Internal Portal Login</Heading>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <Box as="form" onSubmit={handleSubmit} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
          <VStack spacing={4}>
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
                placeholder="Enter your password"
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="blue" 
              width="full" 
              mt={4} 
              isLoading={isLoading}
            >
              Login
            </Button>
          </VStack>
        </Box>
        
        <Text textAlign="center">
          Don't have an account? <Link as={RouterLink} to="/register" color="blue.500">Sign up here</Link>
        </Text>
        
        <Text textAlign="center" fontSize="sm" color="gray.500">
          Admin login: aftab@coresconnect.com | Password: 123456
        </Text>
      </VStack>
    </Container>
  );
};

export default Login; 