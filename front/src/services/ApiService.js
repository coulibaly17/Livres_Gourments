/**
 * Service centralisant les appels API vers le back office Laravel
 */

// URL de l'API Laravel - Modifiez cette URL si votre serveur est sur un autre chemin
const API_URL = 'http://localhost/projet/monprojet - Copie/monprojet - Copie/public/api';

// Fonction utilitaire pour les appels fetch
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, config);
    
    // Vu00e9rifier si la ru00e9ponse est un JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw { status: response.status, data };
      }
      
      return data;
    } else {
      const text = await response.text();
      
      if (!response.ok) {
        throw { status: response.status, data: text };
      }
      
      return text;
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Service pour les Ouvrages (livres)
export const OuvragesService = {
  getAll: () => fetchWithAuth('ouvrages'),
  getById: (id) => fetchWithAuth(`ouvrages/${id}`),
  getByCategory: (categoryId) => fetchWithAuth(`categories/${categoryId}/ouvrages`),
  create: (data) => fetchWithAuth('ouvrages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`ouvrages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithAuth(`ouvrages/${id}`, { method: 'DELETE' }),
};

// Service pour les Catu00e9gories
export const CategoriesService = {
  getAll: () => fetchWithAuth('categories'),
  getById: (id) => fetchWithAuth(`categories/${id}`),
  getWithBooks: () => fetchWithAuth('categories/with-books'),
  create: (data) => fetchWithAuth('categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithAuth(`categories/${id}`, { method: 'DELETE' }),
};

// Service pour les Stocks
export const StocksService = {
  getAll: () => fetchWithAuth('stocks'),
  getByOuvrage: (ouvrageId) => fetchWithAuth(`ouvrages/${ouvrageId}/stock`),
  update: (id, data) => fetchWithAuth(`stocks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Service pour les Ventes
export const VentesService = {
  getAll: () => fetchWithAuth('ventes'),
  getById: (id) => fetchWithAuth(`ventes/${id}`),
  getByPeriod: (start, end) => fetchWithAuth(`ventes/period/${start}/${end}`),
  create: (data) => fetchWithAuth('ventes', { method: 'POST', body: JSON.stringify(data) }),
};

// Service pour les Commentaires
export const CommentairesService = {
  getByOuvrage: (ouvrageId) => fetchWithAuth(`ouvrages/${ouvrageId}/commentaires`),
  create: (data) => fetchWithAuth('commentaires', { method: 'POST', body: JSON.stringify(data) }),
  approve: (id) => fetchWithAuth(`commentaires/${id}/approve`, { method: 'PUT' }),
  reject: (id) => fetchWithAuth(`commentaires/${id}/reject`, { method: 'PUT' }),
};

// Service pour les utilisateurs et authentification
export const AuthService = {
  login: (credentials) => fetchWithAuth('login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchWithAuth('register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => fetchWithAuth('user/profile'),
  updateProfile: (data) => fetchWithAuth('user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getUserRole: async () => {
    try {
      const userData = await fetchWithAuth('user/profile');
      // Stocker le ru00f4le dans localStorage pour l'accu00e8s global
      if (userData && userData.role) {
        localStorage.setItem('userRole', userData.role);
        return userData.role;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  },
};

// Service pour les fonctions d'administration
export const AdminService = {
  getAllUsers: () => fetchWithAuth('admin/users'),
  getUserById: (id) => fetchWithAuth(`admin/users/${id}`),
  updateUser: (id, data) => fetchWithAuth(`admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => fetchWithAuth(`admin/users/${id}`, { method: 'DELETE' }),
  getDashboardStats: () => fetchWithAuth('admin/dashboard/stats'),
};

// Exporter tous les services ensemble
const ApiService = {
  OuvragesService,
  CategoriesService,
  StocksService,
  VentesService,
  CommentairesService,
  AuthService,
  AdminService
};

export default ApiService;
