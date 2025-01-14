// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "./styles/index.css";
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID} from './utils/constants';


ReactDOM.createRoot(document.getElementById('root')).render(
  
  <Provider store={store}>
    <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>
);
