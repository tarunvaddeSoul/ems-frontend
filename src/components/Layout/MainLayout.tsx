import { AppShell, Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import HeaderContent from "../Header/Header";
import { useState } from "react";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !sidebarOpen } }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderContent sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar sidebarOpen={sidebarOpen} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box p="md">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;