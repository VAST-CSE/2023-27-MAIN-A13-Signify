import React from 'react';

export default function StatusBadge({ status, label, className = '' }) {
  let badgeType = 'badge-pending';
  let dotColor = 'var(--status-pending)';

  if (status === 'ready' || status === 'connected' || status === true || status === 'active') {
    badgeType = 'badge-ready';
    dotColor = 'var(--status-ready)';
  } else if (status === 'error' || status === 'disconnected' || status === 'offline') {
    badgeType = 'badge-error';
    dotColor = 'var(--status-error)';
  } else if (status === 'info') {
    badgeType = 'badge-info';
    dotColor = 'var(--status-info)';
  }

  return (
    <span className={`badge ${badgeType} ${className}`}>
      <span className="status-dot" style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
      {label}
    </span>
  );
}
