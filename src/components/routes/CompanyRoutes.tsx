import { Route, Routes } from "react-router-dom";
import ListCompanies from "../Company/ListCompanies";
import AddCompany from "../Company/AddCompany";
import EditCompany from "../Company/EditCompany";
import CompanyForm from "../Company/Company";

const CompanyRoutes = () => (
  <Routes>
    <Route index element={<ListCompanies />} />
    <Route path="add" element={<AddCompany />} />
    <Route path="edit/:id" element={<EditCompany />} />
    <Route path="/demo" element={<CompanyForm />} />
  </Routes>
);

export default CompanyRoutes;