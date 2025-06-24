// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="stat-card">
    <div className="icon-wrapper">
      <Icon size={28} />
    </div>
    <div className="text-wrapper">
      <span className="value">{value}</span>
      <span className="label">{label}</span>
    </div>
  </div>
);

export default StatCard;
