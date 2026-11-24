import React from 'react';
import { Link } from 'react-router-dom';

export default function SectionHeader({ title, subtitle, to, actions = null }) {
  return (
    <header className="hf-section-head">
      <div className="hf-section-title-group">
        <h2>
          {to ? (
            <Link to={to} className="hf-section-title">
              {title}
            </Link>
          ) : (
            <span className="hf-section-title">{title}</span>
          )}
        </h2>
        {subtitle && <p className="hf-section-sub">{subtitle}</p>}
      </div>
      {actions && <div className="hf-section-actions">{actions}</div>}
    </header>
  );
}
