import React from 'react';
import { Home, Video, MessageSquareText, BookOpen, CircleHelp } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'sign-to-english', label: 'Sign to English', icon: <Video size={18} /> },
    { id: 'english-to-sign', label: 'English to Sign', icon: <MessageSquareText size={18} /> },
    { id: 'learn', label: 'Learn ISL', icon: <BookOpen size={18} /> },
    { id: 'help', label: 'Help', icon: <CircleHelp size={18} /> },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-container" onClick={() => setActivePage('home')}>
          <div className="brand-logo-badge">ISL</div>
          <div className="brand-text">
            <h1>Smart ISL</h1>
            <span>Communication Assistant</span>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                  id={`nav-btn-${item.id}`}
                  aria-label={item.label}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button className="nav-logout" onClick={onLogout} title={`Log out ${currentUser?.name || ''}`}>
          Log out
        </button>

      </div>
    </header>
  );
}
