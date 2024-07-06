import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import {
  Home,
  User,
  Calendar,
  Document,
  Building,
  Wallet,
  ChevronDown,
  ChevronUp,
  Add,
  Upload,
  Search,
  Dashboard,
} from "@carbon/icons-react";
import { Collapse, Box, Transition, Tooltip } from "@mantine/core";
import { motion } from "framer-motion";
import { Create } from "@mui/icons-material";

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const ToggleButton = ({ isOpen, toggle }: any) => {
  return (
    <motion.button
      onClick={toggle}
      animate={isOpen ? "open" : "closed"}
      initial={false}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        outline: "none",
        position: "fixed",
        top: "1.26rem",
        left: isOpen ? "13rem" : "1rem",
        zIndex: 1001,
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width="23" height="23" viewBox="0 0 23 23">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </motion.button>
  );
};

const Sidebar = () => {
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [employeesOpen, setEmployeesOpen] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleAttendance = () => {
    setAttendanceOpen((prev) => !prev);
  };

  const toggleEmployees = () => {
    setEmployeesOpen((prev) => !prev);
  };

  const toggleAdvancedSearch = () => {
    setAdvancedSearchOpen((prev) => !prev);
  };

  const toggleCompanies = () => {
    setCompaniesOpen((prev) => !prev);
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <ToggleButton isOpen={sidebarOpen} toggle={toggleSidebar} />

      <Transition transition="slide-right" duration={300} mounted={sidebarOpen}>
        {(styles) => (
          <Box
            style={{
              ...styles,
              width: "16rem",
              backgroundColor: "white",
              borderRight: "1px solid #E5E7EB",
              padding: "1.5rem",
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              overflowY: "auto",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div className="text-2xl font-bold">Tulsyan</div>
            </div>
            <nav className="space-y-4">
              <SidebarItem to="/" icon={<Dashboard size={24} />} label="Dashboard" />
              <div>
                <button
                  onClick={toggleEmployees}
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded transition duration-200 w-full text-left"
                >
                  <User size={24} className="mr-3" />
                  <span>Employees</span>
                  {employeesOpen ? (
                    <ChevronUp size={24} className="ml-auto" />
                  ) : (
                    <ChevronDown size={24} className="ml-auto" />
                  )}
                </button>
                <Collapse in={employeesOpen}>
                  <div className="pl-10">
                    <SidebarItem
                      to="/employees/list"
                      icon={<User size={24} />}
                      label="List Employees"
                    />
                    <SidebarItem
                      to="/employees/add"
                      icon={<Add size={24} />}
                      label="Add Employee"
                    />
                    {/* <SidebarItem
                      to="/employees/edit"
                      icon={<Edit size={24} />}
                      label="Edit Employee"
                    /> */}
                    <SidebarItem
                      to="/employees/search"
                      icon={<Search size={24} />}
                      label="Advanced Search Employee"
                    />
                  </div>
                </Collapse>
              </div>
              <div>
                <button
                  onClick={toggleAttendance}
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded transition duration-200 w-full text-left"
                >
                  <Calendar size={24} className="mr-3" />
                  <span>Attendance</span>
                  {attendanceOpen ? (
                    <ChevronUp size={24} className="ml-auto" />
                  ) : (
                    <ChevronDown size={24} className="ml-auto" />
                  )}
                </button>
                <Collapse in={attendanceOpen}>
                  <div className="pl-10">
                    <SidebarItem
                      to="/attendance/mark"
                      icon={<Calendar size={24} />}
                      label="Attendance By Site"
                    />
                    <SidebarItem
                      to="/attendance/upload"
                      icon={<Upload size={24} />}
                      label="Upload Attendance"
                    />
                    <SidebarItem
                      to="/attendance/records"
                      icon={<Document size={24} />}
                      label="Records"
                    />
                  </div>
                </Collapse>
              </div>
              <div>
                <button
                  onClick={toggleCompanies}
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded transition duration-200 w-full text-left"
                >
                  <Building size={24} className="mr-3" />
                  <span>Companies</span>
                  {companiesOpen ? (
                    <ChevronUp size={24} className="ml-auto" />
                  ) : (
                    <ChevronDown size={24} className="ml-auto" />
                  )}
                </button>
                <Collapse in={companiesOpen}>
                  <div className="pl-10">
                    <SidebarItem
                      to="/companies/list"
                      icon={<Building size={24} />}
                      label="List Companies"
                    />
                    <SidebarItem
                      to="/companies/add"
                      icon={<Add size={24} />}
                      label="Add Company"
                    />
                    {/* <SidebarItem
                      to="/companies/edit"
                      icon={<Create />}
                      label="Edit Company"
                    /> */}
                  </div>
                </Collapse>
              </div>
              <SidebarItem
                to="/salary"
                icon={<Wallet size={24} />}
                label="Salary"
              />
            </nav>
          </Box>
        )}
      </Transition>

      <div
        style={{
          marginLeft: sidebarOpen ? "16rem" : "0",
          transition: "margin-left 0.3s",
        }}
      >
      </div>
    </>
  );
};

export default Sidebar;
