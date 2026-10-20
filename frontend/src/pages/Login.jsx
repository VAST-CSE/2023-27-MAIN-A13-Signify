import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { authService } from '../services/auth';

export default function Login({ onLogin, onShowSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    try {
      onLogin(authService.login({ email, password }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleForgotPassword = () => {
    const value = window.prompt('Enter your email address');
    if (!value) return;
    try {
      authService.resetPassword(value);
      setMessage('Your account is ready to use.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-mark">ISL</div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to Smart ISL</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <div className="auth-input-wrap"><Mail size={18} /><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          {message && <p className="auth-message" role="alert">{message}</p>}
          <button className="btn btn-primary auth-submit" type="submit">Login <ArrowRight size={18} /></button>
        </form>
        <button className="auth-link-button" type="button" onClick={handleForgotPassword}>Forgot Password?</button>
        <p className="auth-switch">New here? <button type="button" onClick={onShowSignUp}>Sign Up</button></p>
      </div>
    </main>
  );
}
