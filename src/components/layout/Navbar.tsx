import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Button,
  Text,
  Container,
  Collapse,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import AnimatedLogo from '../ui/AnimatedLogo';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../features/auth/authActions';

const MotionBox = motion(Box);

const Navbar: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Define navigation items based on user role
  let navItems = [];
  
  if (user?.role === 'admin') {
    navItems = [
      { name: 'Dashboard', path: '/admin-dashboard' },
      { name: 'Projects', path: '/admin-dashboard/projects' },
      { name: 'Clients', path: '/admin-dashboard/clients' },
      { name: 'Users', path: '/admin-dashboard/users' },
    ];
  } else if (user?.role === 'client') {
    navItems = [
      { name: 'Dashboard', path: '/user-dashboard/clients' },
      { name: 'Profile', path: '/user-dashboard/edit-profile' },
    ];
  } else {
    navItems = [
      { name: 'Dashboard', path: '/user-dashboard' },
      { name: 'My Tasks', path: '/user-dashboard/tasks' },
      { name: 'Projects', path: '/user-dashboard/projects' },
    ];
  }

  // Animation variants
  const navVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.2
      }
    })
  };

  const mobileMenuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.2
      }
    })
  };

  return (
    <Box>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <Flex
          bg={bgColor}
          color="gray.600"
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle="solid"
          borderColor={borderColor}
          align="center"
          boxShadow="sm"
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </Flex>
          
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
            <AnimatedLogo 
              size="md" 
              mr={2} 
              cursor="pointer" 
              onClick={() => navigate(user ? 
                user.role === 'admin' ? '/admin-dashboard' : 
                user.role === 'client' ? '/user-dashboard/clients' : 
                '/user-dashboard' 
                : '/'
              )}
            />
            <Text
              textAlign="left"
              fontFamily="heading"
              fontWeight="bold"
              color="gray.800"
              display={{ base: 'none', md: 'flex' }}
            >
              Internal Portal
            </Text>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <HStack spacing={4} alignItems="center">
                {navItems.map((navItem, index) => (
                  <motion.div
                    key={navItem.name}
                    custom={index}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -2 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => navigate(navItem.path)}
                    >
                      {navItem.name}
                    </Button>
                  </motion.div>
                ))}
              </HStack>
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={6}
            align="center"
          >
            {user && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Avatar
                      size="sm"
                      name={user.name}
                      src={user.avatar}
                      bg="brand.500"
                      color="white"
                    />
                  </motion.div>
                </MenuButton>
                <MenuList>
                  <Flex p={3} alignItems="center" gap={3}>
                    <Avatar
                      size="md"
                      name={user.name}
                      src={user.avatar}
                      bg="brand.500"
                    />
                    <Box>
                      <Text fontWeight="medium">{user.name}</Text>
                      <Text fontSize="sm" color="gray.500">{user.email}</Text>
                      {user.title && (
                        <Text fontSize="xs" color="gray.500">{user.title}</Text>
                      )}
                    </Box>
                  </Flex>
                  <MenuDivider />
                  <MenuItem onClick={() => navigate('/user-dashboard/edit-profile')}>Edit Profile</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Stack>
        </Flex>
      </motion.div>

      <Collapse in={isOpen} animateOpacity>
        <Box
          p={4}
          display={{ md: 'none' }}
          bg={bgColor}
          borderBottom={1}
          borderStyle="solid"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Stack as={motion.div} spacing={4}>
            {navItems.map((navItem, index) => (
              <motion.div
                key={navItem.name}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={mobileMenuItemVariants}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  py={2}
                  as="a"
                  onClick={() => {
                    navigate(navItem.path);
                    onToggle();
                  }}
                  fontWeight={600}
                  color="gray.600"
                  _hover={{
                    textDecoration: 'none',
                    color: 'brand.500',
                  }}
                  cursor="pointer"
                >
                  {navItem.name}
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar; 