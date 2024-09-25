import React, { useState } from "react";
import {
  Group,
  ScrollArea,
  UnstyledButton,
  Collapse,
  ThemeIcon,
  Text,
  Box,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBuilding,
  IconCalendar,
  IconChevronRight,
  IconDashboard,
  IconReportAnalytics,
  IconSearch,
  IconUpload,
  IconUserPlus,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { useLocation, Link } from "react-router-dom";
import "./NavbarLink.css";
import clsx from "clsx";

interface LinkProps {
  icon: React.ElementType;
  color?: string;
  label: string;
  link?: string;
  subLinks?: string;
}

const links = [
  { icon: IconDashboard, label: "Dashboard", link: "/" },
  { icon: IconUsers, label: "Employees", subLinks: "employees" },
  { icon: IconCalendar, label: "Attendance", subLinks: "attendance" },
  { icon: IconBuilding, label: "Companies", subLinks: "companies" },
  { icon: IconWallet, label: "Salary", link: "/salary" },
  { icon: IconWallet, label: "Payroll", link: "/payroll" },
];

const subLinksData = {
  employees: [
    { icon: IconUsers, label: "List Employees", link: "/employees" },
    { icon: IconUserPlus, label: "Add Employee", link: "/employees/add" },
    { icon: IconSearch, label: "Advanced Search", link: "/employees/search" },
  ],
  attendance: [
    {
      icon: IconCalendar,
      label: "Attendance By Site",
      link: "/attendance/mark",
    },
    {
      icon: IconUpload,
      label: "Upload Attendance",
      link: "/attendance/upload",
    },
    {
      icon: IconReportAnalytics,
      label: "Reports",
      link: "/attendance/reports",
    },
  ],
  companies: [
    { icon: IconBuilding, label: "List Companies", link: "/companies" },
    { icon: IconUserPlus, label: "Add Company", link: "/companies/add" },
  ],
};

function NavbarLink({ icon: Icon, label, link, subLinks }: LinkProps) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const location = useLocation();
  const [opened, setOpened] = useState(false);
  const hasSubLinks = !!subLinks;
  const isActive = link
    ? location.pathname === link
    : location.pathname.startsWith(`/${subLinks}`);

  const handleClick = () => {
    if (hasSubLinks) {
      setOpened((o) => !o);
    }
  };

  const linkProps = link ? { component: Link, to: link } : ({} as any);

  return (
    <>
      <UnstyledButton
        onClick={handleClick}
        className={clsx("navbar-link", { active: isActive })}
        style={{
          display: "block",
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          color: colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          fontSize: "16px",
          fontWeight: 500,
          backgroundColor: isActive
            ? colorScheme === "dark"
              ? theme.colors.grape[7] // Active state (dark mode)
              : theme.colors.grape[1] // Active state (light mode)
            : "",
          transition: "background-color 0.3s ease",
        }}
        {...linkProps}
      >
        <Group style={{ flexWrap: "nowrap" }}>
          <ThemeIcon variant="light" size={34}>
            <Icon size="1.4rem" />
          </ThemeIcon>
          <Text size="md" fw={500}>
            {label}
          </Text>
          {hasSubLinks && (
            <IconChevronRight
              size="1rem"
              stroke={1.5}
              style={{
                transition: "transform 0.3s ease",
                transform: opened ? "rotate(90deg)" : "none",
                marginLeft: "auto",
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {hasSubLinks && (
        <Collapse in={opened}>
          <Box ml={40} mt={5}>
            {subLinksData[subLinks].map((subLink) => (
              <NavbarLink key={subLink.label} {...subLink} />
            ))}
          </Box>
        </Collapse>
      )}
    </>
  );
}

export function SidebarContent() {
  return (
    <ScrollArea h="100%">
      <Box p="md">
        {links.map((link) => (
          <NavbarLink {...link} key={link.label} />
        ))}
      </Box>
    </ScrollArea>
  );
}



