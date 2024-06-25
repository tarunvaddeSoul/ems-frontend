import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stepper,
  Button,
  Group,
  Select,
  Table,
  NumberInput,
  FileInput,
  Container,
  Title,
  Paper,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import { Employee } from "../Employee/interface/employee.interface";
interface Company {
  id: string;
  name: string;
}

const MarkAttendanceBySite: React.FC = () => {
  const [active, setActive] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      companyId: "",
      attendance: {} as Record<string, number>,
      attendanceSheet: null as File | null,
    },
    validate: (values) => {
      if (active === 0 && !values.companyId) {
        return { companyId: "Please select a company" };
      }
      return {};
    },
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ data: Company[] }>(
        "http://localhost:3003/companies"
      );
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (companyId: string) => {
    setLoading(true);
    try {
      const response = await axios.get<{ data: Employee[] }>(
        "http://localhost:3003/employees"
      );
      const filteredEmployees = response.data.data.filter(
        (emp) => emp.companyId === companyId
      );
      setEmployees(filteredEmployees);
      const initialAttendance = filteredEmployees.reduce((acc, emp) => {
        acc[emp.id] = 0;
        return acc;
      }, {} as Record<string, number>);
      form.setFieldValue("attendance", initialAttendance);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("companyId", form.values.companyId);
      formData.append("attendance", JSON.stringify(form.values.attendance));
      if (form.values.attendanceSheet) {
        formData.append("attendanceSheet", form.values.attendanceSheet);
      }

      await axios.post("http://localhost:3003/attendance/mark", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle success (e.g., show a notification, reset form, etc.)
      console.log("Attendance marked successfully");
    } catch (error) {
      console.error("Error marking attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (form.validate().hasErrors) return;
    if (active === 0) {
      fetchEmployees(form.values.companyId);
    }
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Container size="lg">
      <Paper shadow="sm" p="md" withBorder>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Select Company" description="Choose a company">
            <Select
              label="Company"
              placeholder="Select a company"
              data={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
              {...form.getInputProps("companyId")}
            />
          </Stepper.Step>

          <Stepper.Step
            label="Mark Attendance"
            description="Enter employee attendance"
          >
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Designation</Table.Th>
                  <Table.Th>Present Days</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {employees.map((employee) => (
                  <Table.Tr key={employee.id}>
                    <Table.Td>{`${employee.firstName} ${employee.lastName}`}</Table.Td>
                    <Table.Td>{employee.employeeDepartmentName}</Table.Td>
                    <Table.Td>{employee.designationName}</Table.Td>
                    <Table.Td>
                      <NumberInput
                        min={0}
                        max={31}
                        {...form.getInputProps(`attendance.${employee.id}`)}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stepper.Step>

          <Stepper.Step
            label="Upload Sheet"
            description="Upload attendance sheet"
          >
            <FileInput
              label="Upload Attendance Sheet"
              placeholder="Choose file"
              accept=".csv,.xlsx,.xls"
              leftSection={<IconUpload size={14} />}
              {...form.getInputProps("attendanceSheet")}
            />
          </Stepper.Step>

          <Stepper.Completed>
            <Text c="teal" fw={700}>
              All steps completed - you're good to go!
            </Text>
          </Stepper.Completed>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active !== 3 && (
            <Button onClick={active === 2 ? handleSubmit : nextStep}>
              {active === 2 ? "Submit" : "Next step"}
            </Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
};

export default MarkAttendanceBySite;
