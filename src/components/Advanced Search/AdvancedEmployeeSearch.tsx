import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Title,
  TextInput,
  Select,
  RangeSlider,
  Button,
  Group,
  Stack,
  Table,
  Pagination,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import {
  Companies,
  Designation,
  Employee,
  EmployeeDepartments,
} from "../Employee/interface/employee.interface";
import { DatePickerInput } from "@mantine/dates";

const AdvancedEmployeeSearch: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [employeeDepartments, setEmployeeDepartments] = useState<
    EmployeeDepartments[]
  >([]);
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const form = useForm({
    initialValues: {
      searchText: "",
      designationId: "",
      employeeDepartmentId: "",
      companyId: "",
      gender: "",
      category: "",
      highestEducationQualification: "",
      ageRange: [15, 65] as [number, number],
      sortBy: "",
      sortOrder: "asc" as "asc" | "desc",
      startDate: null,
      endDate: null,
    },
  });

  useEffect(() => {
    fetchDesignations();
    fetchEmployeeDepartments();
    fetchCompanies();
  }, []);

  function formatDateToDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3003/employees", {
        params: {
          page,
          limit: 10,
          searchText: form.values.searchText,
          designationId: form.values.designationId,
          employeeDepartmentId: form.values.employeeDepartmentId,
          companyId: form.values.companyId,
          gender: form.values.gender,
          category: form.values.category,
          highestEducationQualification:
            form.values.highestEducationQualification,
          minAge: form.values.ageRange[0],
          maxAge: form.values.ageRange[1],
          sortBy: form.values.sortBy || "lastName",
          sortOrder: form.values.sortOrder || "asc",
          startDate: form.values.startDate
            ? formatDateToDDMMYYYY(new Date(form.values.startDate))
            : undefined,
          endDate: form.values.endDate
            ? formatDateToDDMMYYYY(new Date(form.values.endDate))
            : undefined,
        },
      });
      setEmployees(response.data.data.data);
      setTotalPages(Math.ceil(response.data.data.total / 10));
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await axios.get<{ data: Designation[] }>(
        "http://localhost:3003/designation"
      );
      setDesignations(response.data.data);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const fetchEmployeeDepartments = async () => {
    try {
      const response = await axios.get<{ data: EmployeeDepartments[] }>(
        "http://localhost:3003/departments/employee-departments"
      );
      setEmployeeDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching employee departments:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3003/companies"
      );
      setCompanies(response.data.data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchEmployees();
  };

  const handleClearFilters = () => {
    form.reset();
    setPage(1);
  };

  return (
    <Container size="xl">
      <Paper shadow="sm" p="xl" withBorder>
        <Title order={2} mb="lg">
          Advanced Employee Search
        </Title>
        <form onSubmit={form.onSubmit(handleSearch)}>
          <Stack>
            <TextInput
              label="Search"
              placeholder="Search by name or ID"
              {...form.getInputProps("searchText")}
            />
            <Group grow>
              <Select
                label="Designation"
                placeholder="Select designation"
                data={[
                  { value: "", label: "All" },
                  ...designations.map((d) => ({ value: d.id, label: d.name })),
                ]}
                {...form.getInputProps("designationId")}
              />
              <Select
                label="Department"
                placeholder="Select department"
                data={[
                  { value: "", label: "All" },
                  ...employeeDepartments.map((d) => ({
                    value: d.id,
                    label: d.name,
                  })),
                ]}
                {...form.getInputProps("employeeDepartmentId")}
              />
            </Group>
            <Group grow>
              <Select
                label="Company"
                placeholder="Select company"
                data={[
                  { value: "", label: "All" },
                  ...companies.map((c) => ({ value: c.id, label: c.name })),
                ]}
                {...form.getInputProps("companyId")}
              />
              <Select
                label="Sort By"
                placeholder="Select field to sort by"
                data={[
                  { value: "firstName", label: "First Name" },
                  { value: "lastName", label: "Last Name" },
                  { value: "age", label: "Age" },
                  // Add other sortable fields here
                ]}
                {...form.getInputProps("sortBy")}
              />

              <DatePickerInput
                label="Start Date"
                placeholder="Select date"
                {...form.getInputProps("startDate")}
              />

              <DatePickerInput
                label="End Date"
                placeholder="Select date"
                {...form.getInputProps("endDate")}
              />

              <Select
                label="Sort Order"
                placeholder="Select sort order"
                data={[
                  { value: "asc", label: "Ascending" },
                  { value: "desc", label: "Descending" },
                ]}
                {...form.getInputProps("sortOrder")}
              />
              <Select
                label="Gender"
                placeholder="Select gender"
                data={[
                  { value: "", label: "All" },
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                ]}
                {...form.getInputProps("gender")}
              />
            </Group>
            <Text size="sm">Age Range</Text>
            <RangeSlider
              min={15}
              max={75}
              step={1}
              minRange={0}
              label={(value) => value}
              {...form.getInputProps("ageRange")}
            />
            <Group grow>
              <Select
                label="Category"
                placeholder="Select category"
                data={[
                  { value: "", label: "All" },
                  { value: "SC", label: "SC" },
                  { value: "ST", label: "ST" },
                  { value: "OBC", label: "OBC" },
                  { value: "GENERAL", label: "GENERAL" },
                ]}
                {...form.getInputProps("category")}
              />
              <Select
                label="Highest Education Qualification"
                placeholder="Select qualification"
                data={[
                  { value: "", label: "All" },
                  { value: "UNDER_8", label: "Under 8th" },
                  { value: "EIGHT", label: "8th" },
                  { value: "TEN", label: "10th" },
                  { value: "TWELVE", label: "12th" },
                  { value: "GRADUATE", label: "Graduate" },
                  { value: "POST_GRADUATE", label: "Post Graduate" },
                ]}
                {...form.getInputProps("highestEducationQualification")}
              />
            </Group>
            <Group justify="flex-end">
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button type="submit" leftSection={<IconSearch size={14} />}>
                Search
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Paper mt="xl" p="md" withBorder>
        <LoadingOverlay visible={loading} />
        {employees && employees.length > 0 ? (
          <>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Designation</Table.Th>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Gender</Table.Th>
                  <Table.Th>Age</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Education</Table.Th>
                  <Table.Th>Salary</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {employees.map((employee) => (
                  <Table.Tr key={employee.id}>
                    <Table.Td>{employee.id}</Table.Td>
                    <Table.Td>{`${employee.firstName} ${employee.lastName}`}</Table.Td>
                    <Table.Td>{employee.designationName}</Table.Td>
                    <Table.Td>{employee.employeeDepartmentName}</Table.Td>
                    <Table.Td>{employee.companyName}</Table.Td>
                    <Table.Td>{employee.gender}</Table.Td>
                    <Table.Td>{employee.age}</Table.Td>
                    <Table.Td>{employee.category}</Table.Td>
                    <Table.Td>
                      {employee.highestEducationQualification
                        ? employee.highestEducationQualification.replace(
                            "_",
                            " "
                          )
                        : "N/A"}
                    </Table.Td>

                    <Table.Td>{employee.salary}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Group justify="center" mt="md">
              <Pagination value={page} onChange={setPage} total={totalPages} />
            </Group>
          </>
        ) : (
          <Text ta="center">No results found</Text>
        )}
      </Paper>
    </Container>
  );
};

export default AdvancedEmployeeSearch;
