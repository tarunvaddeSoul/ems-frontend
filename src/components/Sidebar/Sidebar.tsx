import React, { useState } from "react";
import {
  Box,
  Collapse,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { SidebarItem } from "./SidebarItem";
import {
  IconDashboard,
  IconUsers,
  IconCalendar,
  IconBuilding,
  IconWallet,
  IconChevronDown,
  IconChevronUp,
  IconUserPlus,
  IconSearch,
  IconUpload,
  IconReportAnalytics,
} from "@tabler/icons-react";

const Sidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [employeesOpen, setEmployeesOpen] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(false);

  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    fontWeight: 500,
    color: colorScheme === "dark" ? theme.colors.dark[1] : theme.black,
    cursor: "pointer", // Add cursor style for better UX
    transition: "background-color 0.3s, color 0.3s", // Smooth transition
    "&:hover": {
      backgroundColor:
        colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2],
      color: colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[9],
    },
  };
  

  return (
    <Box
      style={{
        width: sidebarOpen ? 250 : 0,
        transition: "width 0.3s ease",
        overflow: "hidden",
        height: "100%",
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      }}
    >
      <SidebarItem
        to="/"
        icon={<IconDashboard size={20} />}
        label="Dashboard"
        styles={linkStyle}
      />
  
      <SidebarItem
        to="#"
        icon={<IconUsers size={20} />}
        label="Employees"
        rightSection={
          employeesOpen ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )
        }
        onClick={() => toggleSection(setEmployeesOpen)}
        styles={linkStyle}
      />
      <Collapse in={employeesOpen}>
        <SidebarItem
          to="/employees"
          icon={<IconUsers size={20} />}
          label="List Employees"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
        <SidebarItem
          to="/employees/add"
          icon={<IconUserPlus size={20} />}
          label="Add Employee"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
        <SidebarItem
          to="/employees/search"
          icon={<IconSearch size={20} />}
          label="Advanced Search"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
                {/* <SidebarItem
          to="/employees/edit"
          icon={<IconSearch size={20} />}
          label="Edit"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        /> */}
      </Collapse>

      <SidebarItem
        to="#"
        icon={<IconCalendar size={20} />}
        label="Attendance"
        rightSection={
          attendanceOpen ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )
        }
        onClick={() => toggleSection(setAttendanceOpen)}
        styles={linkStyle}
      />
      <Collapse in={attendanceOpen}>
        <SidebarItem
          to="/attendance/mark"
          icon={<IconCalendar size={20} />}
          label="Attendance By Site"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
        <SidebarItem
          to="/attendance/upload"
          icon={<IconUpload size={20} />}
          label="Upload Attendance"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
        <SidebarItem
          to="/attendance/reports"
          icon={<IconReportAnalytics size={20} />}
          label="Reports"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
      </Collapse>

      <SidebarItem
        to="#"
        icon={<IconBuilding size={20} />}
        label="Companies"
        rightSection={
          companiesOpen ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )
        }
        onClick={() => toggleSection(setCompaniesOpen)}
        styles={linkStyle}
      />
      <Collapse in={companiesOpen}>
        <SidebarItem
          to="/companies"
          icon={<IconBuilding size={20} />}
          label="List Companies"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
        <SidebarItem
          to="/companies/add"
          icon={<IconUserPlus size={20} />}
          label="Add Company"
          styles={{ ...linkStyle, paddingLeft: 40 }}
        />
      </Collapse>

      <SidebarItem
        to="/salary"
        icon={<IconWallet size={20} />}
        label="Salary"
        styles={linkStyle}
      />
    </Box>
  );
};

export default Sidebar;
