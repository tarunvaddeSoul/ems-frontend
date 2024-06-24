import React from 'react';
import { AppShell } from '@mantine/core';
import AppHeader from '../Header/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;