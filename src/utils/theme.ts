import { extendTheme } from '@chakra-ui/theme-utils';
import { ThemeConfig } from '@chakra-ui/react';

// Define theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Define your custom theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db4ff',
      400: '#1a9eff',
      500: '#0088e6',
      600: '#006bb4',
      700: '#004e82',
      800: '#003251',
      900: '#00151f',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  config,
});

export default theme; 