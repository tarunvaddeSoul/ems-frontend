import React from 'react';
import { Group } from '@mantine/core';
import UserMenu from './UserMenu';
import '@mantine/core/styles.css';

const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200">
      <Group style={{ gap: '2.5rem' }}>
      </Group>
      <Group style={{ gap: '1.5rem' }}>
        <UserMenu />
      </Group>
    </header>
  );
};

export default Header;