import React from 'react';

export default function Card({ children, title, subtitle, icon, extraHeader, interactive = false, onClick, className = '' }) {
  return (
    <div 
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || icon || extraHeader) && (
        <div className="card-header">
          <div>
            <div className="card-title">
              {icon && <span style={{ display: 'flex', color: 'var(--accent-primary)' }}>{icon}</span>}
              <span>{title}</span>
            </div>
            {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{subtitle}</p>}
          </div>
          {extraHeader && <div>{extraHeader}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
