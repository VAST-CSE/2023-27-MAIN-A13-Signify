import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ISLToEnglish from './pages/ISLToEnglish';
import EnglishToISL from './pages/EnglishToISL';
import ISLLearning from './pages/ISLLearning';
import AboutHelp from './pages/AboutHelp';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { apiService } from './services/api';
import { authService } from './services/auth';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [backendHealth, setBackendHealth] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [authPage, setAuthPage] = useState('login');

  useEffect(() => {
    if (!currentUser) return undefined;

    async function checkHealth() {
      const data = await apiService.getHealth();
      setBackendHealth(data);
    }

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Dashboard setActivePage={setActivePage} backendHealth={backendHealth} />;
      case 'sign-to-english':
        return <ISLToEnglish backendHealth={backendHealth} />;
      case 'english-to-sign':
        return <EnglishToISL backendHealth={backendHealth} />;
      case 'learn':
        return <ISLLearning backendHealth={backendHealth} />;
      case 'help':
        return <AboutHelp backendHealth={backendHealth} />;
      default:
        return <Dashboard setActivePage={setActivePage} backendHealth={backendHealth} />;
    }
  };

  if (!currentUser) {
    return authPage === 'login' ? (
      <Login onLogin={setCurrentUser} onShowSignUp={() => setAuthPage('signup')} />
    ) : (
      <SignUp onSignUp={setCurrentUser} onShowLogin={() => setAuthPage('login')} />
    );
  }

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        backendHealth={backendHealth}
        currentUser={currentUser}
        onLogout={() => {
          authService.logout();
          setCurrentUser(null);
          setAuthPage('login');
        }}
      />

      <main className="main-content">{renderActivePage()}</main>

      <Footer backendHealth={backendHealth} />
    </div>
  );
}
