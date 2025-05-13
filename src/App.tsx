import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Box>
  );
};

export default App; 