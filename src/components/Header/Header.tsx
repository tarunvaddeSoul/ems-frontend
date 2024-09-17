import React from "react";
import {
  Group,
  Burger,
  Box,
  useMantineTheme,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import UserMenu from "./UserMenu";
import "@mantine/core/styles.css";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      component="header"
      style={(theme) => ({
        height: 70,
        padding: theme.spacing.md,
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.violet[1],
        borderBottom: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.violet[3]
        }`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
      })}
    >
      <Group>
        <Burger
          opened={sidebarOpen}
          onClick={toggleSidebar}
          color={theme.colors.gray[6]}
          mr="xl"
          style={{
            "@media (minWidth: 768px)": {
              display: "none",
            },
          }}
        />
        {/* You can add logo or other left-side content here */}
        <img
        src="/brave-icon-1745x2048-qdldx4dz.png"
        alt="Logo"
        style={{ height: '40px', marginLeft: '16px' }} // Adjust size and margin as needed
      />
      </Group>

      <Group>
        <ActionIcon
          variant="outline"
          color={colorScheme === "dark" ? "yellow" : "blue"}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {colorScheme === "dark" ? (
            <IconSun size={18} />
          ) : (
            <IconMoonStars size={18} />
          )}
        </ActionIcon>
        <UserMenu />
      </Group>
    </Box>
  );
};

export default Header;
