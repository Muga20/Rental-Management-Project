import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { AuthContextProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { CartContextProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <CartContextProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </CartContextProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
);
