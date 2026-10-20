import React from 'react';
import { Video, MessageSquareText, BookOpen, ArrowRight } from 'lucide-react';
import Card from '../components/Card';

export default function Dashboard({ setActivePage }) {
  const cards = [
    {
      id: 'sign-to-english',
      title: 'Sign to English',
      icon: <Video size={28} />,
      buttonText: 'Start'
    },
    {
      id: 'english-to-sign',
      title: 'English to Sign',
      icon: <MessageSquareText size={28} />,
      buttonText: 'Start'
    },
    {
      id: 'learn',
      title: 'Learn ISL',
      icon: <BookOpen size={28} />,
      buttonText: 'Start'
    }
  ];

  return (
    <div className="page-shell">
      <section className="hero-section">
        <h1>Smart ISL<br />Communication Assistant</h1>
        <p className="hero-subtitle">Communicate using ISL and English.</p>
      </section>

      <section className="feature-grid">
        {cards.map((card) => (
          <Card key={card.id} interactive onClick={() => setActivePage(card.id)} className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon">{card.icon}</div>
            </div>

            <h2>{card.title}</h2>

            <button className="btn btn-primary feature-btn" onClick={() => setActivePage(card.id)}>
              <span>{card.buttonText}</span>
              <ArrowRight size={16} />
            </button>
          </Card>
        ))}
      </section>
    </div>
  );
}
