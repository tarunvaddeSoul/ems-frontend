import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { MantineProvider, createTheme, ColorSchemeScript, Loader } from "@mantine/core";
import '@mantine/core/styles.css';
import AuthLayout from "./components/Layout/AuthLayout";
import Dashboard from "./components/Home/Dashboard";
import EmployeeRoutes from "./components/routes/EmployeeRoutes";
import CompanyRoutes from "./components/routes/CompanyRoutes";
import AttendanceRoutes from "./components/routes/AttendanceRoutes";
import { AuthForm } from "./components/Register/register"; 
import { ProfilePage } from "./components/Profile/ProfilePage";
import SalaryPage from "./components/Salary/Salary";
import { Notifications } from "@mantine/notifications";
import RingLoader from "./RingLoader";
import PayrollManagementSystem from "./components/Salary/PayrollManagementSystem";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { MainLayout } from "./components/Layout/MainLayout";

const theme = createTheme({
  primaryColor: 'violet',
  colors: {
    grape: [
      '#F8F0FC',
      '#F3D9FA',
      '#EEBEFA',
      '#E599F7',
      '#DA77F2',
      '#CC5DE8',
      '#BE4BDB',
      '#AE3EC9',
      '#9C36B5',
      '#862E9C',
    ],
  },
  fontFamily: 'Roboto, sans-serif',
  headings: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: 'ring',
      },
    }),
  }
});
const queryClient = new QueryClient()

const App = () => {
  const [colorScheme, setColorScheme] = useState<any>('light');
  const toggleColorScheme = (value?: any) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      <QueryClientProvider client={queryClient}>
      <Notifications />
      <Loader />
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/auth" element={<AuthForm />} />
            </Route>

            {/* Main app routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/employees/*" element={<EmployeeRoutes />} />
              <Route path="/companies/*" element={<CompanyRoutes />} />
              <Route path="/attendance/*" element={<AttendanceRoutes />} />
              <Route path="/salary/*" element={<SalaryPage />} />
              <Route path="/payroll/*" element={<PayrollManagementSystem />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
     </QueryClientProvider>

      </MantineProvider>
    </>
  );
};

export default App;