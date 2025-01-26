import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import App from './App';
import store from './redux/store';
import { createAppTheme } from './theme';
import './index.css';

const theme = createAppTheme(true); // Start with dark mode

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff'
              }
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
