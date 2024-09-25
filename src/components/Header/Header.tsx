import { useMantineColorScheme, Box, Group, ActionIcon, Image } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import UserMenu from "./UserMenu";

export function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      style={(theme) => ({
        height: "100%",
        padding: theme.spacing.md,
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <Group fw={1000}>
        ROSE
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
}