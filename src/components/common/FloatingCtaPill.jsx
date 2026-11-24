import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function FloatingCtaPill({ label, to }) {
  return (
    <div className="hf-gallery-fade">
      <Link to={to} className="hf-floating-pill">
        <span>{label}</span>
        <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}
