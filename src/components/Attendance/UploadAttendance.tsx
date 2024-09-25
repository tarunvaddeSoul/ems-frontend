import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stepper,
  Button,
  Group,
  Select,
  Container,
  Paper,
  Text,
  LoadingOverlay,
  Alert,
  Title,
  ThemeIcon,
  Stack,
  FileInput,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck, IconUpload } from "@tabler/icons-react";
import { MonthPicker } from "@mantine/dates";
import dayjs from "dayjs";
import "@mantine/core/styles.css";

interface Company {
  id: string;
  name: string;
}

const UploadAttendance: React.FC = () => {
  const [active, setActive] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    initialValues: {
      companyId: "",
      month: "",
      file: null as File | null,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (active === 0 && !values.companyId) {
        errors.companyId = "Please select a company";
      }
      if (active === 1 && !values.month) {
        errors.month = "Please select a month";
      }
      if (active === 2 && !values.file) {
        errors.file = "Please upload a file";
      }
      return errors;
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

  const handleMonthChange = (date: Date | null) => {
    const formattedDate = dayjs(date).format("YYYY-MM");
    form.setFieldValue("month", formattedDate);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const formData = new FormData();
      formData.append("companyId", form.values.companyId);
      formData.append("month", form.values.month);
      if (form.values.file) {
        formData.append("attendanceSheet", form.values.file);
      }

      await axios.post("http://localhost:3003/attendance/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Attendance file uploaded successfully");
      setActive(4); // Move to the success step
    } catch (error) {
      console.error("Error uploading attendance:", error);
      setErrorMessage("Failed to upload attendance file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setErrorMessage("");
    if (form.validate().hasErrors) return;
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
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" withBorder>
        {/* <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        /> */}
        <Title order={2} mb="lg">
          Upload Attendance
        </Title>
        <Stepper
          active={active}
          onStepClick={setActive}
          orientation="horizontal"
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
            <Flex justify="center" align="center">
              <MonthPicker
                value={form.values.month ? new Date(form.values.month) : null}
                onChange={handleMonthChange}
              />
            </Flex>
          </Stepper.Step>

          <Stepper.Step
            label="Upload File"
            description="Upload attendance file"
          >
            <FileInput
              label="Upload Attendance File"
              placeholder="Click to select file"
              accept=".jpeg,.png"
              leftSection={<IconUpload size={14} />}
              {...form.getInputProps("file")}
              error={form.errors.file}
              required
            />
          </Stepper.Step>

          <Stepper.Completed>
            <Stack align="center" mt="xl">
              <ThemeIcon color="teal" size={48} radius="xl">
                <IconCheck size="1.5rem" stroke={1.5} />
              </ThemeIcon>
              <Text c="teal" ta="center" fz="xl" fw={700}>
                Attendance File Uploaded Successfully
              </Text>
              <Text c="dimmed" ta="center" mt="sm">
                The attendance file has been uploaded and processed.
              </Text>
              <Button onClick={resetForm} mt="lg">
                Upload Another File
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {errorMessage && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mt="md">
            {errorMessage}
          </Alert>
        )}

        {active !== 4 && (
          <Group justify="flex-end" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active !== 3 && (
              <Button onClick={active === 2 ? handleSubmit : nextStep}>
                {active === 2 ? "Upload" : "Next step"}
              </Button>
            )}
          </Group>
        )}
      </Paper>
    </Container>
  );
};

export default UploadAttendance;
