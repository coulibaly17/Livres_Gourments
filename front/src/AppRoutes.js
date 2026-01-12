import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import CategoryBooks from './components/CategoryBooks';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Profile from './components/Profile';
import Login from './components/Login';
import RegisterNew from './components/RegisterNew';
import Chatbot from './components/Chatbot';
import { AuthService } from './services/FastApiService';

// Composant pour protéger les routes privées
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      
      try {
        // Vérifier le rôle de l'utilisateur si requis
        if (requiredRoles.length > 0) {
          // Si on n'a pas encore le rôle en mémoire, on le récupère
          const role = userRole || await AuthService.getUserRole();
          setAuthorized(requiredRoles.includes(role));
        } else {
          // Si aucun rôle spécifique n'est requis, on vérifie juste le token
          setAuthorized(true);
        }
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        setAuthorized(false);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [token, userRole, requiredRoles]);
  
  if (loading) {
    return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>;
  }
  
  return authorized ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/books" element={<BookList />} />
      <Route path="/ouvrages" element={<BookList key={location.pathname} />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/book/:id" element={<BookDetail />} />
      <Route path="/category/:categoryId" element={<CategoryBooks />} />
      
      {/* Routes protégées par authentification */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Routes d'authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterNew />} />
      <Route path="/chatbot" element={<Chatbot />} />
      
      {/* Routes du back office protégées par rôle */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRoles={['admin', 'editeur', 'gestionnaire']}>
          <React.Suspense fallback={<div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>}>
            {React.createElement(React.lazy(() => import('./components/backoffice/Dashboard')))}
          </React.Suspense>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;
