import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Paper,
  LoadingOverlay,
  Notification,
  Stack,
} from "@mantine/core";
import EmployeeForm from "./EmployeeForm";
import { EmployeeFormValues } from "./interface/employee.interface";
import axios from "axios";

const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<EmployeeFormValues | null>(null);
  const [designations, setDesignations] = useState([]);
  const [employeeDepartments, setEmployeeDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    color: string;
  }>({
    show: false,
    message: "",
    color: "blue",
  });

  useEffect(() => {
    fetchEmployee();
    fetchDesignations();
    fetchEmployeeDepartments();
    fetchCompanies();
  }, [id]);

  // Function to parse DD-MM-YYYY to Date object
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3003/employees/${id}`);
      const employeeData = response.data.data;
      console.log(JSON.stringify(employeeData, null, 2));
      // Parse date strings to Date objects
      const parsedEmployee = {
        ...employeeData,
        dateOfBirth: parseDate(employeeData.dateOfBirth),
        dateOfJoining: parseDate(employeeData.dateOfJoining),
        policeVerificationDate: parseDate(employeeData.policeVerificationDate),
        trainingCertificateDate: parseDate(
          employeeData.trainingCertificateDate
        ),
        medicalCertificateDate: parseDate(employeeData.medicalCertificateDate),
      };

      setEmployee(parsedEmployee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      showNotification("Failed to fetch employee details", "red");
    } finally {
      setLoading(false);
    }
  };

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
      showNotification("Failed to fetch designations", "red");
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
      showNotification("Failed to fetch employee departments", "red");
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
      showNotification("Failed to fetch companies", "red");
    }
  };

  const handleSubmit = async (values: EmployeeFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof Date) {
          // Format Date to DD-MM-YYYY
          const day = value.getDate().toString().padStart(2, "0");
          const month = (value.getMonth() + 1).toString().padStart(2, "0");
          const year = value.getFullYear();
          formData.append(key, `${day}-${month}-${year}`);
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      await axios.put(`http://localhost:3003/employees/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification("Employee updated successfully", "green");
      navigate("/employees"); // Redirect to employee list
    } catch (error) {
      console.error("Error updating employee:", error);
      showNotification("Failed to update employee", "red");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, color: string) => {
    setNotification({ show: true, message, color });
    setTimeout(
      () => setNotification({ show: false, message: "", color: "blue" }),
      5000
    );
  };

  if (!employee) {
    return (
      <Notification
        color='red'
      >
        {"Employee not found."}
      </Notification>
    );
  }

  return (
    <Container size="xl">
      <LoadingOverlay
        visible={loading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack gap="md">
        <Title order={2}>Edit Employee</Title>
        {notification.show && (
          <Notification
            color={notification.color}
            onClose={() => setNotification({ ...notification, show: false })}
          >
            {notification.message}
          </Notification>
        )}
        <Paper shadow="xs" p="md">
          <EmployeeForm
            initialValues={employee}
            onSubmit={handleSubmit}
            designations={designations}
            employeeDepartments={employeeDepartments}
            companies={companies}
          />
        </Paper>
      </Stack>
    </Container>
  );
};

export default EditEmployee;
