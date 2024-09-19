import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stepper,
  Button,
  Group,
  Select,
  Table,
  Container,
  Paper,
  Text,
  LoadingOverlay,
  Checkbox,
  Alert,
  Title,
  ThemeIcon,
  Stack,
  FileInput,
  Timeline,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck, IconUpload } from "@tabler/icons-react";
import { Employee } from "../Employee/interface/employee.interface";
import { MonthPicker } from "@mantine/dates";
import dayjs from "dayjs";
import "@mantine/core/styles.css";

interface Company {
  id: string;
  name: string;
}

interface ProgressStep {
  label: string;
  status: 'waiting' | 'processing' | 'success' | 'error';
}

const MarkAttendanceBySite: React.FC = () => {
  const [active, setActive] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { label: 'Mark Attendance', status: 'waiting' },
    { label: 'Upload Attendance Sheet', status: 'waiting' },
  ]);
  const form = useForm({
    initialValues: {
      companyId: "",
      month: "",
      attendance: {} as Record<
        string,
        { selected: boolean; presentCount: string }
      >,
      file: null as File | null,
    },
    validate: (values) => {
      if (active === 0 && !values.companyId) {
        return { companyId: "Please select a company" };
      }
      if (active === 1 && !values.month) {
        return { month: "Please select a month" };
      }
      return {};
    },
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get("http://localhost:3003/companies");
      setCompanies(response.data.data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setErrorMessage("Failed to fetch companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (companyId: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        `http://localhost:3003/companies/${companyId}/employees`
      );

      const filteredEmployees = response.data.data.filter(
        (emp: any) => emp.status === "ACTIVE"
      );

      setEmployees(filteredEmployees);
      // Initialize the attendance object with all employees
      const initialAttendance = filteredEmployees.reduce(
        (acc: any, emp: any) => {
          acc[emp.employeeId] = { selected: false, presentCount: "0" };
          return acc;
        },
        {} as Record<string, { selected: boolean; presentCount: string }>
      );

      form.setFieldValue("attendance", initialAttendance);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setErrorMessage("Failed to fetch employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (date: Date | null) => {
    const formattedDate = dayjs(date).format("YYYY-MM");
    setValue(date);
    form.setFieldValue("month", formattedDate);
  };


  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const selectedEmployees = Object.entries(form.values.attendance).filter(
        ([_, value]) => value.selected
      );
      
      if (selectedEmployees.length === 0) {
        setErrorMessage("No employees selected");
        return;
      }
      
      const attendanceRecords = selectedEmployees.map(
        ([employeeId, value]) => ({
          employeeId,
          companyId: form.values.companyId,
          month: form.values.month,
          presentCount: parseInt(value.presentCount),
        })
      );
      
      const payload = {
        records: attendanceRecords,
      };
      
      setProgressSteps(prev => [
        { ...prev[0], status: 'processing' },
        prev[1],
      ]);
      
      await axios.post("http://localhost:3003/attendance/bulk", payload);
      
      setProgressSteps(prev => [
        { ...prev[0], status: 'success' },
        prev[1],
      ]);
      
      setSuccessMessage("Attendance marked successfully");
      
      if (form.values.file) {
        setProgressSteps(prev => [
          prev[0],
          { ...prev[1], status: 'processing' },
        ]);
        
        const formData = new FormData();
        formData.append("companyId", form.values.companyId);
        formData.append("month", form.values.month);
        formData.append("attendanceSheet", form.values.file);
        
        await axios.post("http://localhost:3003/attendance/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        setProgressSteps(prev => [
          prev[0],
          { ...prev[1], status: 'success' },
        ]);
        
        setSuccessMessage(prev => `${prev}. Attendance file uploaded successfully`);
      }
      
      setActive(4); // Move to the success step
    } catch (error) {
      console.error("Error marking attendance:", error);
      setErrorMessage("Failed to mark attendance. Please try again.");
      setProgressSteps(prev => prev.map(step => ({ ...step, status: 'error' })));
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setErrorMessage("");
    if (form.validate().hasErrors) return;
    if (active === 0) {
      fetchEmployees(form.values.companyId);
    }
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => {
    setErrorMessage("");
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const resetForm = () => {
    form.reset();
    setActive(0);
    setErrorMessage("");
    setSuccessMessage("");
    setValue(null);
    setEmployees([]);
  };

  const ProgressTimeline = () => (
    <Timeline active={progressSteps.findIndex(step => step.status === 'processing')} bulletSize={24} lineWidth={2}>
      {progressSteps.map((step, index) => (
        <Timeline.Item
          key={index}
          title={step.label}
          color={step.status === 'success' ? 'green' : step.status === 'error' ? 'red' : 'blue'}
        >
          {step.status === 'processing' && 'In progress...'}
          {step.status === 'success' && 'Completed'}
          {step.status === 'error' && 'Error occurred'}
        </Timeline.Item>
      ))}
    </Timeline>
  );

  return (
    <Container size="lg">
      <Paper shadow="sm" p="xl" withBorder>
        {loading && <ProgressTimeline />}
        <Title order={2} mb="lg">
          Mark Attendance
        </Title>
        <Stepper
          active={active}
          onStepClick={setActive}
          mb="xl"
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Select Company" description="Choose a company">
            <Select
              label="Company"
              placeholder="Select a company"
              data={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
              {...form.getInputProps("companyId")}
              error={form.errors.companyId}
            />
          </Stepper.Step>

          <Stepper.Step label="Select Month" description="Choose a month">
            <MonthPicker value={value} onChange={handleMonthChange} />
          </Stepper.Step>

          <Stepper.Step
            label="Mark Attendance"
            description="Enter employee attendance"
          >
            {errorMessage && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
                {errorMessage}
              </Alert>
            )}
            {employees.length > 0 ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Select</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Department</Table.Th>
                    <Table.Th>Designation</Table.Th>
                    <Table.Th>Present Days</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {employees.map((employee) => (
                    <Table.Tr key={employee.employeeId}>
                      <Table.Td>
                        <Checkbox
                          {...form.getInputProps(
                            `attendance.${employee.employeeId}.selected`,
                            { type: "checkbox" }
                          )}
                        />
                      </Table.Td>
                      <Table.Td>{`${employee.firstName} ${employee.lastName}`}</Table.Td>
                      <Table.Td>{employee.employeeDepartmentName}</Table.Td>
                      <Table.Td>{employee.designationName}</Table.Td>
                      <Table.Td>
                        <Select
                          data={Array.from({ length: 32 }, (_, i) => ({
                            value: i.toString(),
                            label: i.toString(),
                          }))}
                          disabled={
                            !form.values.attendance[employee.employeeId as any]
                              ?.selected
                          }
                          {...form.getInputProps(
                            `attendance.${employee.employeeId}.presentCount`
                          )}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed">
                No employees found for the selected company.
              </Text>
            )}
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Reminder"
              color="blue"
              mt="md"
            >
              Please ensure you've selected employees and entered their
              attendance.
            </Alert>
          </Stepper.Step>

          <Stepper.Step
            label="Upload File"
            description="Optional: Upload attendance file"
          >
            <FileInput
              label="Upload Attendance File"
              placeholder="Choose file"
              accept=".jpeg,.png"
              leftSection={<IconUpload size="1rem" />}
              {...form.getInputProps("file")}
            />
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Reminder"
              color="blue"
              mt="md"
            >
              Kindly ignore if already uploaded.
            </Alert>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack align="center" mt="xl">
              <ThemeIcon color="teal" size={48} radius="xl">
                <IconCheck size="1.5rem" stroke={1.5} />
              </ThemeIcon>
              <Text c="teal" ta="center" fz="xl" fw={700}>
                Attendance Marked Successfully
              </Text>
              <Text c="dimmed" ta="center" mt="sm">
                The attendance has been recorded for the selected employees.
              </Text>
              <Button onClick={resetForm} mt="lg">
                Mark New Attendance
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {active !== 4 && (
          <Group justify="flex-end" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active === 3 ? (
              <Button onClick={handleSubmit}>Submit</Button>
            ) : (
              <Button onClick={nextStep}>Next step</Button>
            )}
          </Group>
        )}
      </Paper>
    </Container>
  );
};

export default MarkAttendanceBySite;

