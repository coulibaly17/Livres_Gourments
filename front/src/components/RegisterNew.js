import React, { useState } from 'react';
import { AuthService } from '../services/FastApiService';
import { useNavigate, Link } from 'react-router-dom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

function Register() {
  const [form, setForm] = useState({
    nom: '', prenom: '', adresse: '', telephone: '', email: '', password: '', role: 'client'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      // Adaptation pour utiliser notre service FastAPI
      const userData = {
        // Format adapté aux attentes du schéma UtilisateurCreateSchema de l'API FastAPI
        nom: form.nom,
        prenom: form.prenom,
        adresse: form.adresse,
        telephone: form.telephone,
        email: form.email,
        password: form.password,
        role: form.role
      };
      
      // Appel au service d'inscription avec FastApiService
      const response = await AuthService.register(userData);
      
      setSuccess('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
      setForm({ nom: '', prenom: '', adresse: '', telephone: '', email: '', password: '', role: 'client' });
      
      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.data?.detail || "Erreur lors de l'inscription. Vérifiez que l'email n'est pas déjà utilisé.");
    }
    setLoading(false);
  };

  return (
    <div className="card p-4 mx-auto shadow" style={{maxWidth:500}}>
      <h2 className="mb-4">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="nom" className="form-label">Nom</label>
            <input id="nom" name="nom" value={form.nom} onChange={handleChange} className="form-control" placeholder="Votre nom de famille" required disabled={loading} />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="prenom" className="form-label">Prénom</label>
            <input id="prenom" name="prenom" value={form.prenom} onChange={handleChange} className="form-control" placeholder="Votre prénom" required disabled={loading} />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="adresse" className="form-label">Adresse</label>
          <input id="adresse" name="adresse" value={form.adresse} onChange={handleChange} className="form-control" placeholder="Votre adresse complète" required disabled={loading} />
        </div>
        <div className="mb-3">
          <label htmlFor="telephone" className="form-label">Téléphone</label>
          <input id="telephone" name="telephone" value={form.telephone} onChange={handleChange} className="form-control" placeholder="Votre numéro de téléphone" required disabled={loading} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Votre adresse email" required disabled={loading} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Choisissez un mot de passe sécurisé" required disabled={loading} />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rôle</label>
          <select id="role" name="role" value={form.role} onChange={handleChange} className="form-select" required disabled={loading}>
            <option value="client">Client</option>
            <option value="editeur">Editeur</option>
            <option value="gestionnaire">Gestionnaire</option>
          </select>
        </div>
        <button 
          className="btn w-100 d-flex align-items-center justify-content-center" 
          type="submit" 
          disabled={loading}
          style={{
            background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
            color: 'white',
            padding: '10px 0',
            borderRadius: '4px',
            boxShadow: '0 3px 5px 2px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            border: 'none',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> 
              Inscription en cours...
            </> 
          ) : (
            <>
              <AppRegistrationIcon style={{ fontSize: '1.2rem', marginRight: '8px' }} />
              S'inscrire
            </>
          )}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}
      <div className="mt-3 text-center">
        <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
}

export default Register;
