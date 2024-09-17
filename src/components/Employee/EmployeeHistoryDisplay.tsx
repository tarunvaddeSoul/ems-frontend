import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import {
  Text,
  Group,
  Button,
  NumberInput,
  Select,
  Box,
  Paper,
  Divider,
  ActionIcon,
  Stack,
  Modal,
} from "@mantine/core";
import { parseDateString, formatDateToString } from "../utils/date.converter";

const EmploymentHistoryDisplay = ({ initialValues, onSubmit }: any) => {
  const [designations, setDesignations] = useState([]);
  const [employeeDepartments, setEmployeeDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      employmentHistory: initialValues.map((item: any) => ({
        ...item,
        companyName: item.companyId,
        designationName: item.designationId,
        departmentName: item.departmentId,
        joiningDate: parseDateString(item.joiningDate),
        leavingDate: parseDateString(item.leavingDate),
      })),
    },
  });

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
    }
  };

  const handleAddEmploymentRecord = (values: any) => {
    form.insertListItem("employmentHistory", {
      id: Date.now().toString(),
      ...values,
      status: "ACTIVE",
    });
    setIsModalOpen(false);
  };

  const fields = form.values.employmentHistory.map((item: any, index: any) => (
    <Paper key={item.id} p="md" withBorder mb="md">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={500}>
          {(companies as any).find((c: any) => c?.value === item.companyName)
            ?.label || `Employment Record ${index + 1}`}
        </Text>
        <ActionIcon
          color="red"
          onClick={() => form.removeListItem("employmentHistory", index)}
          variant="subtle"
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Group>
      <Group grow align="flex-start">
        <Select
          label="Company"
          data={companies}
          {...form.getInputProps(`employmentHistory.${index}.companyName`)}
        />
        <Select
          label="Designation"
          data={designations}
          {...form.getInputProps(`employmentHistory.${index}.designationName`)}
        />
      </Group>
      <Group grow align="flex-start" mt="sm">
        <Select
          label="Department"
          data={employeeDepartments}
          {...form.getInputProps(`employmentHistory.${index}.departmentName`)}
        />
        <NumberInput
          label="Salary"
          {...form.getInputProps(`employmentHistory.${index}.salary`)}
        />
      </Group>
      <Group grow align="flex-start" mt="sm">
        <DateInput
          clearable
          label="Joining Date"
          placeholder="Select date"
          value={form.values.employmentHistory[index].joiningDate}
          onChange={(date) => {
            form.setFieldValue(`employmentHistory.${index}.joiningDate`, date);
          }}
        />
        <DateInput
          clearable
          label="Leaving Date"
          placeholder="Select date"
          value={form.values.employmentHistory[index].leavingDate}
          onChange={(date) => {
            form.setFieldValue(`employmentHistory.${index}.leavingDate`, date);
          }}
        />
      </Group>
      <Select
        label="Status"
        data={[
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" },
        ]}
        {...form.getInputProps(`employmentHistory.${index}.status`)}
        mt="sm"
      />
    </Paper>
  ));

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      employmentHistory: values.employmentHistory.map((item: any) => ({
        ...item,
        joiningDate: formatDateToString(item.joiningDate),
        leavingDate: formatDateToString(item.leavingDate),
      })),
    };
    onSubmit(formattedValues);
  };

  return (
    <Box m="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {fields.length > 0 ? (
          <Stack>{fields}</Stack>
        ) : (
          <Text c="dimmed" ta="center">
            No employment records yet. Add one below.
          </Text>
        )}
        <Group justify="center" mt="md">
          <Button
            onClick={() => setIsModalOpen(true)}
            leftSection={<IconPlus size="1rem" />}
          >
            Add Employment Record
          </Button>
        </Group>
        <Divider my="lg" />
        <Group justify="flex-end">
          <Button type="submit">Save Employment History</Button>
        </Group>
      </form>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Employment Record"
      >
        <AddEmploymentRecordForm
          onSubmit={handleAddEmploymentRecord}
          companies={companies}
          designations={designations}
          departments={employeeDepartments}
        />
      </Modal>
    </Box>
  );
};

const AddEmploymentRecordForm = ({
  onSubmit,
  companies,
  designations,
  departments,
}: any) => {
  const form = useForm({
    initialValues: {
      companyName: "",
      designationName: "",
      departmentName: "",
      salary: 0,
      joiningDate: null,
      leavingDate: null,
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Select
        label="Company"
        data={companies}
        {...form.getInputProps("companyName")}
        required
      />
      <Select
        label="Designation"
        data={designations}
        {...form.getInputProps("designationName")}
        required
        mt="sm"
      />
      <Select
        label="Department"
        data={departments}
        {...form.getInputProps("departmentName")}
        required
        mt="sm"
      />
      <NumberInput
        label="Salary"
        {...form.getInputProps("salary")}
        required
        mt="sm"
      />
      <DateInput
        label="Joining Date"
        {...form.getInputProps("joiningDate")}
        required
        mt="sm"
      />
      <DateInput
        label="Leaving Date"
        {...form.getInputProps("leavingDate")}
        mt="sm"
      />
      <Button type="submit" mt="md" fullWidth>
        Add Record
      </Button>
    </form>
  );
};

export default EmploymentHistoryDisplay;
