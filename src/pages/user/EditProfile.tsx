import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Container,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  useToast,
  Avatar,
  AvatarBadge,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Select,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';
import { FaPlus, FaArrowLeft, FaEdit, FaCamera, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateProfile } from '../../features/auth/authActions';
import Navbar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';
import { fadeInVariants } from '../../utils/animations';
import api from '../../api/axios';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    department: '',
    avatar: '',
    skills: [] as { name: string; level: number }[],
    password: '',
    confirmPassword: '',
  });

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

  // Skill input state
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);
  
  // Validation state
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        title: user.title || '',
        department: user.department || '',
        avatar: user.avatar || '',
        skills: user.skills || [],
        password: '',
        confirmPassword: '',
      });
      
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors when user types
    if (name === 'password' || name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle adding a skill
  const handleAddSkill = () => {
    if (skillName.trim() === '') {
      return;
    }

    // Check if skill already exists
    const existingSkill = formData.skills.find(
      (skill) => skill.name.toLowerCase() === skillName.toLowerCase()
    );

    if (existingSkill) {
      // Update existing skill level
      const updatedSkills = formData.skills.map((skill) =>
        skill.name.toLowerCase() === skillName.toLowerCase()
          ? { ...skill, level: skillLevel }
          : skill
      );
      setFormData((prev) => ({
        ...prev,
        skills: updatedSkills,
      }));
    } else {
      // Add new skill
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: skillName.trim(), level: skillLevel }],
      }));
    }

    // Reset skill inputs
    setSkillName('');
    setSkillLevel(3);
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillName: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.name !== skillName),
    }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Avatar image must be less than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open file picker when clicking the camera icon
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove avatar
  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setFormData(prev => ({
      ...prev,
      avatar: ''
    }));
    onClose();
  };

  // Upload avatar to server
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return formData.avatar;
    
    try {
      setUploadingAvatar(true);
      
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return response.data.file.url;
      }
      
      return null;
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload avatar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match if either is provided
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match',
        });
        return;
      }

      if (formData.password.length < 6) {
        setErrors({
          ...errors,
          password: 'Password must be at least 6 characters',
        });
        return;
      }
    }

    // Upload avatar if a new one was selected
    let avatarUrl = formData.avatar;
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar();
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      }
    }

    // Prepare data for submission
    const profileData = {
      name: formData.name,
      email: formData.email,
      title: formData.title,
      department: formData.department,
      avatar: avatarUrl,
      skills: formData.skills,
    };

    // Include password only if it's provided
    if (formData.password) {
      Object.assign(profileData, { password: formData.password });
    }

    // Dispatch update profile action
    dispatch(updateProfile(profileData))
      .unwrap()
      .then(() => {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/user-dashboard');
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error || 'Failed to update profile',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  // Get color for skill level
  const getSkillLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'green';
      case 5:
        return 'teal';
      default:
        return 'gray';
    }
  };

  // Get label for skill level
  const getSkillLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Basic';
      case 3:
        return 'Intermediate';
      case 4:
        return 'Advanced';
      case 5:
        return 'Expert';
      default:
        return 'N/A';
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Container maxW="container.lg" py={8}>
        <Box as={motion.div} initial="hidden" animate="visible" variants={fadeInVariants}>
          <PageHeader
            title="Edit Profile"
            backButtonLink="/user-dashboard"
          />

          <Card>
            <CardHeader>
              <Flex align="center" gap={4}>
                <Box position="relative">
                  <Avatar
                    size="xl"
                    name={user?.name}
                    src={avatarPreview || formData.avatar}
                    bg="brand.500"
                  >
                    <AvatarBadge 
                      boxSize="1.25em" 
                      bg="brand.500" 
                      border="2px solid white"
                      as={IconButton}
                      size="xs"
                      isRound
                      aria-label="Upload avatar"
                      icon={<FaCamera />}
                      onClick={triggerFileInput}
                    />
                  </Avatar>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  {(avatarPreview || formData.avatar) && (
                    <IconButton
                      aria-label="Remove avatar"
                      icon={<FaTrash />}
                      size="xs"
                      colorScheme="red"
                      position="absolute"
                      top="0"
                      right="0"
                      onClick={onOpen}
                    />
                  )}
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="md">{user?.name}</Heading>
                  <Text color="gray.600">{user?.email}</Text>
                  <Text color="gray.500">
                    {user?.department ? `${user.department}` : 'No department'} 
                    {user?.title && ` • ${user.title}`}
                  </Text>
                </VStack>
              </Flex>
            </CardHeader>

            <CardBody>
              <Box as="form" onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
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
                          placeholder="Your email address"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Job Title</FormLabel>
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Senior Developer"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Department</FormLabel>
                        <Input
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="e.g. Engineering"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Profile Image URL</FormLabel>
                        <Input
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleChange}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Divider my={2} />

                  <Heading size="sm" mb={2}>Skills</Heading>
                  <Grid templateColumns={{ base: '1fr', md: '3fr 1fr auto' }} gap={2} alignItems="end">
                    <GridItem>
                      <FormControl>
                        <FormLabel>Skill Name</FormLabel>
                        <Input
                          value={skillName}
                          onChange={(e) => setSkillName(e.target.value)}
                          placeholder="e.g. React, Node.js, TypeScript"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Skill Level</FormLabel>
                        <Select
                          value={skillLevel}
                          onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                        >
                          <option value={1}>Beginner</option>
                          <option value={2}>Basic</option>
                          <option value={3}>Intermediate</option>
                          <option value={4}>Advanced</option>
                          <option value={5}>Expert</option>
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <Button
                        leftIcon={<FaPlus />}
                        onClick={handleAddSkill}
                        colorScheme="blue"
                        isDisabled={!skillName.trim()}
                      >
                        Add
                      </Button>
                    </GridItem>
                  </Grid>

                  <Box>
                    <Flex wrap="wrap" gap={2} mt={2}>
                      {formData.skills.map((skill, index) => (
                        <Tag
                          key={index}
                          size="lg"
                          borderRadius="full"
                          variant="solid"
                          colorScheme={getSkillLevelColor(skill.level)}
                        >
                          <TagLabel>
                            {skill.name} • {getSkillLevelLabel(skill.level)}
                          </TagLabel>
                          <TagCloseButton onClick={() => handleRemoveSkill(skill.name)} />
                        </Tag>
                      ))}
                    </Flex>
                  </Box>

                  <Divider my={2} />

                  <Heading size="sm" mb={2}>Change Password (Optional)</Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                    <GridItem>
                      <FormControl isInvalid={!!errors.password}>
                        <FormLabel>New Password</FormLabel>
                        <Input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                        />
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm new password"
                        />
                        <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Flex justify="flex-end" mt={4}>
                    <HStack spacing={4}>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/user-dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="brand"
                        isLoading={isLoading || uploadingAvatar}
                        loadingText={uploadingAvatar ? "Uploading..." : "Saving..."}
                      >
                        Save Changes
                      </Button>
                    </HStack>
                  </Flex>
                </VStack>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Container>

      {/* Confirmation Modal for Avatar Removal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to remove your profile picture?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={removeAvatar}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditProfile; 