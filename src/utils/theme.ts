import { extendTheme } from '@chakra-ui/theme-utils';
import { ThemeConfig } from '@chakra-ui/react';

// Define theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Animation styles for components
const animationStyles = {
  transitionProperty: 'common',
  transitionDuration: 'normal',
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
    accent: {
      50: '#f0f4fe',
      100: '#d9e2fc',
      200: '#b6c8fa',
      300: '#8ea9f7',
      400: '#6687f3',
      500: '#4361ef',
      600: '#283ad0',
      700: '#222caa',
      800: '#1d2484',
      900: '#171e5c',
    },
    success: {
      50: '#e4f8eb',
      100: '#c3efd2',
      200: '#a1e6b7',
      300: '#7edc9c',
      400: '#5cd382',
      500: '#3bc968',
      600: '#2ca057',
      700: '#1d7645',
      800: '#144d34',
      900: '#0a2b1e',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  shadows: {
    outline: '0 0 0 3px rgba(0, 136, 230, 0.3)',
    card: '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08)',
    raised: '0 8px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
        ...animationStyles,
      },
      variants: {
        solid: {
          _hover: {
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
        outline: {
          _hover: {
            transform: 'translateY(-1px)',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'card',
          ...animationStyles,
          _hover: {
            boxShadow: 'raised',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        ...animationStyles,
      },
    },
    FormLabel: {
      baseStyle: {
        fontWeight: 'medium',
        fontSize: 'sm',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  config,
});

export default theme; 