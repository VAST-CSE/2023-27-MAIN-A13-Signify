import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { authService } from '../services/auth';

export default function SignUp({ onSignUp, onShowLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      onSignUp(authService.signUp({ name, email, password }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-mark">ISL</div>
        <h1>Create account</h1>
        <p className="auth-subtitle">Start using Smart ISL</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Name</label>
          <div className="auth-input-wrap"><UserRound size={18} /><input id="signup-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
          <label htmlFor="signup-email">Email</label>
          <div className="auth-input-wrap"><Mail size={18} /><input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <label htmlFor="signup-password">Password</label>
          <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="signup-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /></div>
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="signup-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></div>
          {message && <p className="auth-message" role="alert">{message}</p>}
          <button className="btn btn-primary auth-submit" type="submit">Create Account <ArrowRight size={18} /></button>
        </form>
        <p className="auth-switch">Already have an account? <button type="button" onClick={onShowLogin}>Login</button></p>
      </div>
    </main>
  );
}
