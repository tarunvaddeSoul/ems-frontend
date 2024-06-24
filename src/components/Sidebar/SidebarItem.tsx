import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box } from '@mantine/core';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded transition duration-200 ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
      }
    >
      <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div className="mr-3">{icon}</div>
        <span>{label}</span>
      </Box>
    </NavLink>
  );
};
