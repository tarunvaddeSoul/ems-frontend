import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Paper,
  LoadingOverlay,
  Loader,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import EmployeeForm from "./EmployeeForm";
import { EmployeeFormValues } from "./interface/employee.interface";
import axios from "axios";
import "@mantine/notifications/styles.css";
import {convertToCustomDateFormat} from "../utils/date.converter";

const AddEmployee: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [employeeDepartments, setEmployeeDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchDesignations();
    fetchEmployeeDepartments();
    fetchCompanies();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await axios.get("http://localhost:3003/designation");
      setDesignations(
        response.data.data.map((designation: any) => ({
          value: designation.id,
          label: designation.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching designations:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch designations",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  const fetchEmployeeDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3003/departments/employee-departments"
      );
      setEmployeeDepartments(
        response.data.data.map((department: any) => ({
          value: department.id,
          label: department.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching employee departments:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch employee departments",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:3003/companies");
      setCompanies(
        response.data.data.companies.map((company: any) => ({
          value: company.id,
          label: company.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching companies:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch companies",
        color: "red",
        icon: <IconX />,
      });
    }
  };
  
  const handleSubmit = async (values: EmployeeFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        // Check if the field is a file and if a file has been selected
        if (value instanceof Date) {
          formData.append(key, convertToCustomDateFormat(value));
        } else if (value instanceof File) {
          // Only append the file if a file has been selected
          if (value.name) {
            formData.append(key, value);
          }
        } else if (value !== null && value !== undefined) {
          // Append non-null and non-undefined values
          formData.append(key, String(value));
        }
      });
      
      await axios.post("http://localhost:3003/employees/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      notifications.show({
        title: "Success",
        message: "Employee created successfully",
        color: "green",
        icon: <IconCheck />,
      });
  
      // Optionally clear form or redirect
    } catch (error: any) {
      console.error("Error creating employee:", error.response?.data?.message || error.message);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Something went wrong!",
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Add New Employee</Title>
      <Box pos="relative">
        <LoadingOverlay 
          visible={loading} 
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ children: <Loader size={30} type="ring" color="violet" /> }}
        />
        <Paper shadow="xs" p="md">
          <EmployeeForm
            onSubmit={handleSubmit}
            designations={designations}
            employeeDepartments={employeeDepartments}
            companies={companies}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default AddEmployee;
