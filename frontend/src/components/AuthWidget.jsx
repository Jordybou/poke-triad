import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { login, register, logout, selectUser } from '../redux/slices/authSlice';
import styles from '../styles/AuthWidget.module.css';

export default function AuthWidget() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    return (
      <div className={styles.authBar}>
        <span className={styles.badge}>
          👤 {user.email}
        </span>
        <button className={styles.gbaButton} onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>
    );
  }

  async function handle(kind) {
    if (!email || !password) return;
    if (kind === 'login') await dispatch(login({ email, password }));
    if (kind === 'register') await dispatch(register({ email, password }));
    setPassword(''); // petite hygiène
  }

  return (
    <div className={styles.authBar}>
      <input
        className={styles.input}
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        autoComplete="email"
      />
      <input
        className={styles.input}
        placeholder="mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        autoComplete="current-password"
      />
      <button className={styles.gbaButton} onClick={() => handle('login')}>
        Connexion
      </button>
      <button className={styles.gbaButtonAlt} onClick={() => handle('register')}>
        Enregistrer
      </button>
    </div>
  );
}