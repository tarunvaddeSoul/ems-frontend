import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import { MantineProvider, Box } from "@mantine/core";
import appTheme from "./appTheme";
import Employee from "./components/Employee/Employee";
import { RegisterForm } from "./components/Register/register";
import MarkAttendanceBySite from "./components/Attendance/MarkAttendanceBySite";
import UploadAttendance from "./components/Attendance/UploadAttendance";
import AdvancedEmployeeSearch from "./components/Advanced Search/AdvancedEmployeeSearch";
import AddEmployee from "./components/Employee/AddEmployee";
import EditEmployee from "./components/Employee/EditEmployee";
import ListEmployees from "./components/Employee/ListEmployees";
import Dashboard from "./components/Home/Dashboard";
import ListCompanies from "./components/Company/ListCompanies";
import AddCompany from "./components/Company/AddCompany";
import EditCompany from "./components/Company/EditCompany";

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
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/employees" element={<Employee />} />
                  <Route path="/employees/list" element={<ListEmployees />} />
                  <Route path="/employees/edit/:id" element={<EditEmployee />} />
                  <Route path="/employees/add" element={<AddEmployee />} />
                  <Route path="/employees/search" element={<AdvancedEmployeeSearch />} />
                  <Route path="/attendance/mark" element={<MarkAttendanceBySite />} />
                  <Route path="/attendance/upload" element={<UploadAttendance />} />
                  <Route path="/companies/list" element={<ListCompanies />} />
                  <Route path="/companies/add" element={<AddCompany />} />
                  <Route path="/companies/edit/:id" element={<EditCompany />} />
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
