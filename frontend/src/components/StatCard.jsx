import React from 'react';

const StatCard = ({ title, value, color }) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg bg-gray-800 border-l-4 ${color}`}>
      <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
