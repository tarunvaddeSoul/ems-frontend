import { useMantineColorScheme, AppShell, Box } from "@mantine/core";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarContent } from "../Sidebar/Navbar";
import { Header } from "../Header/Header";

export function MainLayout() {
  const [opened, setOpened] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor:
            colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <SidebarContent />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box p="md">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}