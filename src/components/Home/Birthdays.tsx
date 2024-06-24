import React from 'react';

const Birthdays = () => {
  const birthdays = [
    { date: '25 July', name: 'Raktim Chakravartty' },
    { date: '30 July', name: 'Anuj' },
    { date: '15 August', name: 'Swatantra Goswami' },
  ];

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Upcoming Birthdays</h3>
      <ul className="space-y-2">
        {birthdays.map((birthday, index) => (
          <li key={index} className="text-gray-700">
            {birthday.date} • {birthday.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Birthdays;
