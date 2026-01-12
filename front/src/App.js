import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router>
      <CartProvider>
        <Navbar />
        <div className="container mt-4">
          <AppRoutes />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
