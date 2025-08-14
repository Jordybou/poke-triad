import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { login, register, logout, selectUser } from '../redux/slices/authSlice';
import { ProgressAPI } from '../api';

export default function AuthWidget() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span>Connecté : {user.email}</span>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    );
  }

  async function handleAuth(kind) {
    // Au moment où l'utilisateur se connecte/s'inscrit, on peut "monter" la progression locale vers le serveur
    if (kind === 'login') await dispatch(login({ email, password }));
    if (kind === 'register') await dispatch(register({ email, password }));

    // Après succès : si une progression locale existe, l'envoyer au serveur
    const local = JSON.parse(localStorage.getItem('triad_progress') || 'null');
    if (local) {
      try { await ProgressAPI.put(local); } catch {}
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleAuth('login')}>Login</button>
      <button onClick={() => handleAuth('register')}>Register</button>
    </div>
  );
}