import React from 'react';
import Birthdays from './Birthdays';
import Anniversaries from './Anniversaries';

const Home = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Home</h2>
      <div className="grid grid-cols-2 gap-6">
        <Birthdays />
        <Anniversaries />
      </div>
    </div>
  );
};

export default Home;
