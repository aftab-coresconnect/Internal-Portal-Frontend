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
  useToast,
  Text,
  Link,
  Flex,
  Image,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { login } from '../../features/auth/authActions';
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { formVariants, formItemVariants, scaleVariants } from '../../utils/animations';
import AnimatedButton from '../../components/ui/AnimatedButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'client') {
        navigate('/user-dashboard/clients');
      } else if (user.role === 'projectManager') {
        navigate('/user-dashboard/project-manager');
      } else if (user.role === 'designer') {
        navigate('/user-dashboard/designer');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    dispatch(login({ email, password }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bg="gray.50" 
      bgGradient="linear(to-b, brand.50, gray.50)"
    >
      <Container 
        maxW="md" 
        p={8} 
        bg="white" 
        borderRadius="xl" 
        boxShadow="xl"
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={scaleVariants}
      >
        <VStack spacing={8} w={{ base: "100%", md: "100%" }}>
          <Box 
            as={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heading 
              bgGradient="linear(to-r, brand.400, accent.400)" 
              bgClip="text"
            >
              Internal Portal
            </Heading>
          </Box>
          
          <Box w="100%" textAlign="left">
            <AnimatedButton
              leftIcon={<FaArrowLeft />} 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/home')}
            >
              Back to Home
            </AnimatedButton>
          </Box>
          
          {error && (
            <Alert 
              status="error" 
              borderRadius="md"
              as={motion.div}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          {formError && (
            <Alert 
              status="error" 
              borderRadius="md"
              as={motion.div}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertIcon />
              {formError}
            </Alert>
          )}
          
          <Box 
            as={motion.form}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            w="100%" 
            onSubmit={handleSubmit}
          >
            <Stack spacing={5}>
              <FormControl 
                id="email" 
                isRequired
                as={motion.div}
                variants={formItemVariants}
              >
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    pr="4.5rem"
                    borderColor="gray.300"
                    _focus={{ 
                      borderColor: 'brand.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)'
                    }}
                  />
                  <InputRightElement color="gray.400">
                    <Icon as={FaEnvelope} />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl 
                id="password" 
                isRequired
                as={motion.div}
                variants={formItemVariants}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    borderColor="gray.300"
                    _focus={{ 
                      borderColor: 'brand.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)'
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      variant="ghost"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Box 
                as={motion.div}
                variants={formItemVariants}
                pt={2}
              >
                <AnimatedButton
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  isLoading={isLoading}
                  w="100%"
                  boxShadow="md"
                >
                  Sign In
                </AnimatedButton>
                <Text 
                  textAlign="center" 
                  mt={4}
                  color="gray.600"
                >
                  Admin users manage all accounts in this system
                </Text>
              </Box>
            </Stack>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
};

export default Login; 