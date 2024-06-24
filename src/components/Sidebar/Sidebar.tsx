import { useState } from 'react';
import { SidebarItem } from './SidebarItem';
import { Home, User, Calendar, Document, Building, Wallet, ChevronDown, ChevronUp } from '@carbon/icons-react';
import { Collapse, Box, Transition, Tooltip } from '@mantine/core';
import { motion } from 'framer-motion';

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
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        position: 'fixed',
        top: '1.26rem',
        left: isOpen ? '13rem' : '1rem',
        zIndex: 1001,
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleAttendance = () => {
    setAttendanceOpen((prev) => !prev);
  };

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
              width: '16rem',
              backgroundColor: 'white',
              borderRight: '1px solid #E5E7EB',
              padding: '1.5rem',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="text-2xl font-bold">Tulsyan</div>
            </div>
            <nav className="space-y-4">
              <SidebarItem to="/" icon={<Home size={24} />} label="Home" />
              <SidebarItem to="/employees" icon={<User size={24} />} label="Employees" />
              <div>
                <button
                  onClick={toggleAttendance}
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded transition duration-200 w-full text-left"
                >
                  <Calendar size={24} className="mr-3" />
                  <span>Attendance</span>
                  {attendanceOpen ? <ChevronUp size={24} className="ml-auto" /> : <ChevronDown size={24} className="ml-auto" />}
                </button>
                <Collapse in={attendanceOpen}>
                  <div className="pl-10">
                    <SidebarItem to="/attendance/records" icon={<Document size={24} />} label="Attendance Records" />
                    <SidebarItem to="/attendance/mark" icon={<Calendar size={24} />} label="Mark Attendance" />
                  </div>
                </Collapse>
              </div>
              <SidebarItem to="/companies" icon={<Building size={24} />} label="Companies" />
              <SidebarItem to="/salary" icon={<Wallet size={24} />} label="Salary" />
            </nav>
          </Box>
        )}
      </Transition>

      <div style={{ marginLeft: sidebarOpen ? '16rem' : '0', transition: 'margin-left 0.3s' }}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;