import { Route, Routes } from "react-router-dom";
import ListEmployees from "../Employee/ListEmployees";
import AddEmployee from "../Employee/AddEmployee";
import {EditEmployee} from "../Employee/Edit";
import AdvancedEmployeeSearch from "../Advanced Search/AdvancedEmployeeSearch";
import GetEmployeeByPage from "../Employee/GetEmployeeById";

const EmployeeRoutes = () => (
  <Routes>
    <Route index element={<ListEmployees />} />
    <Route path="add" element={<AddEmployee />} />
    <Route path="edit/:id" element={<EditEmployee />} />
    <Route path="edit" element={<EditEmployee />} />
    <Route path=":id" element={<GetEmployeeByPage />} />
    <Route path="search" element={<AdvancedEmployeeSearch />} />
  </Routes>
);

export default EmployeeRoutes;