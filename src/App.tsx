import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import { MantineProvider, Box } from "@mantine/core";
import appTheme from "./appTheme";
import Employee from "./components/Employee/Employee";
import { RegisterForm } from "./components/Register/register";
import MarkAttendanceBySite from "./components/Attendance/MarkAttendanceBySite";

const App = () => {
  return (
    <MantineProvider theme={appTheme} withGlobalClasses withCssVariables>
      <Box h="150vh" bg="brandColor.0">
        <Router>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <div className="p-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/employees" element={<Employee />} />
                  <Route path="/attendance/mark" element={<MarkAttendanceBySite />} />
                  <Route path="/register" element={<RegisterForm />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </Box>
    </MantineProvider>
  );
};

export default App;
