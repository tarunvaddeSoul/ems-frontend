import { useMantineColorScheme, AppShell, Box, ScrollArea } from "@mantine/core";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarContent } from "../Sidebar/Navbar";
import { Header } from "../Header/Header";

export function MainLayout() {
  const [opened] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const HEADER_HEIGHT = 70;
  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
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
          <SidebarContent headerHeight={HEADER_HEIGHT} />
      </AppShell.Navbar>

      <AppShell.Main style={{overflow: 'auto'}}>
          <Box p="md">
            <Outlet />
          </Box>
      </AppShell.Main>
    </AppShell>
  );
}