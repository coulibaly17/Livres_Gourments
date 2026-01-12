/**
 * Service centralisant les appels API vers le backend FastAPI
 */

// URL de l'API FastAPI - Modifiez cette URL si votre serveur est sur un autre port
const API_URL = 'http://localhost:8000';

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
    console.log(`📡 Appel API: ${API_URL}/${endpoint}`, config.method || 'GET');
    const response = await fetch(`${API_URL}/${endpoint}`, config);
    
    // Pour les méthodes DELETE qui peuvent ne pas renvoyer de contenu
    if (response.status === 204) {
      console.log(`✅ API ${endpoint}: Succès (pas de contenu)`);
      return { success: true };
    }
    
    // Si c'est un 404, c'est peut-être normal (par ex: pas de commentaires)
    if (response.status === 404) {
      console.log(`⚠️ API ${endpoint}: Ressource non trouvée`);
      if (endpoint.includes('commentaires/ouvrage/')) {
        // Pour les commentaires, un 404 signifie juste qu'il n'y a pas de commentaires
        return [];
      }
      throw { 
        status: response.status, 
        message: 'Ressource non trouvée',
        response: response 
      };
    }
    
    if (!response.ok) {
      // Si la réponse n'est pas OK, on essaie de récupérer les détails d'erreur
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API ${endpoint}: Erreur ${response.status}`, errorData);
      throw { 
        status: response.status, 
        data: errorData, 
        message: response.statusText,
        response: response 
      };
    }
    
    const data = await response.json();
    console.log(`✅ API ${endpoint}: Succès`, data);
    return data;
    
  } catch (error) {
    if (!error.status) {
      // C'est une erreur de réseau ou autre non liée à la réponse HTTP
      console.error(`❌ API ${endpoint}: Erreur réseau`, error);
    }
    throw error;
  }
};

// Service pour les livres/ouvrages
export const OuvragesService = {
  getAll: () => fetchWithAuth('ouvrages/'),
  getById: (id) => fetchWithAuth(`ouvrages/${id}`),
  create: (data) => fetchWithAuth('ouvrages/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`ouvrages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithAuth(`ouvrages/${id}`, { method: 'DELETE' }),
  getOuvrageStock: (id) => fetchWithAuth(`ouvrages/${id}/stock/`),
};

// Service pour les catégories
export const CategoriesService = {
  getAll: () => fetchWithAuth('categories/'),
  getById: (id) => fetchWithAuth(`categories/${id}`),
  create: (data) => fetchWithAuth('categories/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithAuth(`categories/${id}`, { method: 'DELETE' }),
};

// Service pour les commentaires
export const CommentairesService = {
  // Récupérer les commentaires d'un livre
  getByOuvrage: async (ouvrageId) => {
    try {
      if (!ouvrageId) {
        console.error("ID de l'ouvrage manquant");
        return [];
      }
      
      // Assurer que l'ID est au bon format
      const numericId = parseInt(ouvrageId, 10);
      
      // Essayer de récupérer les commentaires
      const result = await fetchWithAuth(`commentaires/ouvrage/${numericId}`)
        .catch(err => {
          // Si l'erreur est un 404, on considère qu'il n'y a pas de commentaires
          if (err.status === 404) {
            console.log(`Pas de commentaires trouvés pour le livre ${numericId}`);
            return [];
          }
          throw err;
        });
      
      // S'assurer que le résultat est toujours un tableau
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des commentaires pour le livre ${ouvrageId}:`, error);
      return [];
    }
  },
  
  // Créer un nouveau commentaire
  create: async (data) => {
    try {
      // Vérifier que les données sont complètes
      if (!data.utilisateur_id || !data.ouvrage_id) {
        throw new Error("Données de commentaire incomplètes");
      }
      
      // Assurer la conversion des IDs en nombres
      const commentData = {
        ...data,
        utilisateur_id: parseInt(data.utilisateur_id, 10),
        ouvrage_id: parseInt(data.ouvrage_id, 10),
        note: parseInt(data.note || 5, 10),
        // S'assurer que tous les champs requis sont présents
        contenu: data.contenu.trim(),
        statut: data.statut || 'en_attente'
      };
      
      return await fetchWithAuth('commentaires/', { 
        method: 'POST', 
        body: JSON.stringify(commentData) 
      });
    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
      throw error;
    }
  },
  
  // Mettre à jour un commentaire existant
  update: (id, data) => fetchWithAuth(`commentaires/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  // Supprimer un commentaire
  delete: (id) => fetchWithAuth(`commentaires/${id}`, { method: 'DELETE' }),
};

// Service pour les utilisateurs et authentification
export const AuthService = {
  login: (credentials) => fetchWithAuth('token', { 
    method: 'POST', 
    body: new URLSearchParams({
      'username': credentials.email,
      'password': credentials.password
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }),
  register: (userData) => fetchWithAuth('users/', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => fetchWithAuth('users/me'),
  updateProfile: (userData) => fetchWithAuth('users/me', { method: 'PUT', body: JSON.stringify(userData) }),
  updatePassword: (passwordData) => fetchWithAuth('users/me/password', { method: 'PUT', body: JSON.stringify(passwordData) }),
  // Méthodes pour la réinitialisation de mot de passe
  requestPasswordReset: (email) => fetchWithAuth('password-reset/request', { 
    method: 'POST', 
    body: JSON.stringify({ email }) 
  }),
  verifyResetCode: (email, code) => fetchWithAuth('password-reset/verify', { 
    method: 'POST', 
    body: JSON.stringify({ email, code }) 
  }),
  resetPassword: (email, code, newPassword) => fetchWithAuth('password-reset/reset', { 
    method: 'POST', 
    body: JSON.stringify({ email, code, new_password: newPassword }) 
  }),
  getUserRole: async () => {
    try {
      const userData = await fetchWithAuth('users/me');
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

// Service pour le panier
export const CartService = {
  // Routes corrigées pour correspondre aux endpoints réels de l'API
  getCart: () => fetchWithAuth('panier/'),  // Changement de 'cart/' à 'panier/'
  addItem: (item) => fetchWithAuth('panier/ajouter', { method: 'POST', body: JSON.stringify(item) }),  // Changement de 'cart/add' à 'panier/ajouter'
  removeItem: (itemId) => fetchWithAuth(`panier/supprimer/${itemId}`, { method: 'DELETE' }),  // Changement de 'cart/remove/' à 'panier/supprimer/'
  updateQuantity: (itemId, quantity) => fetchWithAuth(`panier/modifier/${itemId}`, { 
    method: 'PUT', 
    body: JSON.stringify({ quantity }) 
  }),  // Changement de 'cart/update/' à 'panier/modifier/'
  checkout: () => fetchWithAuth('commandes/', { method: 'POST' }),  // Changement de 'orders/' à 'commandes/'
};

// Service pour les commandes
export const OrdersService = {
  getAll: () => fetchWithAuth('commandes/'),  // Changement de 'orders/' à 'commandes/'
  getById: (id) => fetchWithAuth(`commandes/${id}`),  // Changement de 'orders/' à 'commandes/'
};

// Service pour le chatbot
export const ChatbotService = {
  getAnswer: (question) => fetchWithAuth(`chatbot/?question=${encodeURIComponent(question)}`),
};

// Exporter tous les services ensemble
const FastApiService = {
  OuvragesService,
  CategoriesService,
  AuthService,
  CartService,
  OrdersService,
  ChatbotService
};

export default FastApiService;
