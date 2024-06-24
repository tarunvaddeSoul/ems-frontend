import React from 'react';

const Anniversaries = () => {
  const anniversaries = [
    { date: '19 June', name: 'Name', years: 1 },
    { date: '3 July', name: 'Name', years: 1 },
    { date: '1 August', name: 'Tarun Vadde', years: 1 },
  ];

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Upcoming Work Anniversaries</h3>
      <ul className="space-y-2">
        {anniversaries.map((anniversary, index) => (
          <li key={index} className="text-gray-700">
            {anniversary.date} • {anniversary.name} • {anniversary.years} year
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Anniversaries;
