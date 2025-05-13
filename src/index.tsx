import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from './store';
import theme from './utils/theme';
import App from './App';
import './index.css';

// Create router with future flags enabled
const router = createBrowserRouter(
  [
    {
      path: "*",
      element: (
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      )
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    } as any, // Type assertion to avoid TypeScript errors with future flags
  }
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
); 