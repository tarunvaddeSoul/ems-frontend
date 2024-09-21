import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Title,
  ActionIcon,
  Group,
  Text,
  Avatar,
  ThemeIcon,
  Button,
  Modal,
  TextInput,
  Pagination,
  Select,
  NumberInput,
  Grid,
  Anchor,
} from "@mantine/core";
import {
  IconEye,
  IconEdit,
  IconBuilding,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import {
  Companies,
  Designation,
  Employee,
  EmployeeDepartments,
  EmployeeSearchParams,
} from "./interface/employee.interface";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import EmployeeView from "./EmployeeView";

const ListEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<EmployeeSearchParams>({
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [employeeDepartments, setEmployeeDepartments] = useState<
    EmployeeDepartments[]
  >([]);
  const [companies, setCompanies] = useState<Companies[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchDesignations();
    fetchEmployeeDepartments();
    fetchCompanies();
  }, [searchParams]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get<{
        data: { data: Employee[]; total: number };
      }>("http://localhost:3003/employees", { params: searchParams });
      setEmployees(response.data.data.data);
      setTotalPages(Math.ceil(response.data.data.total / 10));
    } catch (error) {
      console.error("Error fetching employees:", error);
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
      const response = await axios.get("http://localhost:3003/companies");
      setCompanies(response.data.data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleView = async (employee: Employee) => {
    if (employee) {
      setSelectedEmployee(employee);
      const blob = await pdf(<EmployeeView employee={employee} />).toBlob();
      const url = URL.createObjectURL(blob);
      setViewModalOpened(true);
      setPdfUrl(url);
    }
  };

  const handleEdit = (employee: Employee) => {
    navigate(`/employees/edit/${employee.id}`);
  };

  const handleIdClick = (id: string) => {
    navigate(`/employees/${id}`);
  };

  const handleDelete = (id: string) => {
    // Handle delete logic
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams({ ...searchParams, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const rows = employees.map((employee) => (
    <Table.Tr key={employee.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar src={employee.avatar} size="md" radius="xl">
            {employee.firstName[0] + employee.lastName[0]}
          </Avatar>
          <div>
            <Text size="sm" fw={500}>
              {`${employee.firstName} ${employee.lastName}`}
            </Text>
            <Anchor
              component="button"
              size="xs"
              c="violet"
              onClick={() => handleIdClick(employee.id)}
            >
              ID: {employee.id}
            </Anchor>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconBuilding size="0.8rem" />
          </ThemeIcon>
          <Text size="sm">
            {employee.employmentHistories[0]?.designationName}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconBuilding size="0.8rem" />
          </ThemeIcon>
          <Text size="sm">
            {employee.employmentHistories[0]?.departmentName}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconBuilding size="0.8rem" />
          </ThemeIcon>
          <Text size="sm">{employee.employmentHistories[0]?.companyName}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="center">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleView(employee)}
          >
            <IconEye size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="yellow"
            onClick={() => handleEdit(employee)}
          >
            <IconEdit size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(employee.id)}
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Employees</Title>
      </Group>

      <form onSubmit={handleSearch}>
        <Grid mb="md">
          <Grid.Col span={4}>
            <TextInput
              placeholder="Search employees"
              value={searchParams.searchText || ""}
              onChange={(e) =>
                setSearchParams({ ...searchParams, searchText: e.target.value })
              }
              rightSection={<IconSearch size="1rem" />}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Select
              placeholder="Select designation"
              data={[
                { value: "", label: "All" },
                ...designations.map((d) => ({ value: d.id, label: d.name })),
              ]}
              value={searchParams.designationId}
              onChange={(value) =>
                setSearchParams({
                  ...searchParams,
                  designationId: value || undefined,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Select
              placeholder="Select Department"
              data={[
                { value: "", label: "All" },
                ...employeeDepartments.map((d) => ({
                  value: d.id,
                  label: d.name,
                })),
              ]}
              value={searchParams.employeeDepartmentId}
              onChange={(value) =>
                setSearchParams({
                  ...searchParams,
                  employeeDepartmentId: value || undefined,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Select
              placeholder="Company"
              data={[
                { value: "", label: "All" },
                ...companies.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={searchParams.companyId}
              onChange={(value) =>
                setSearchParams({
                  ...searchParams,
                  companyId: value || undefined,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Button type="submit">Search</Button>
          </Grid.Col>
        </Grid>
      </form>

      <Table.ScrollContainer minWidth={500}>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          horizontalSpacing="xl"
          verticalSpacing="md"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Designation</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Company</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows && rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center">No employees found</Text>
                </Table.Td>
              </Table.Tr>
            )}{" "}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group justify="center" mt="xl">
        <Pagination
          total={totalPages}
          value={searchParams.page}
          onChange={handlePageChange}
        />
      </Group>

      <Modal
        opened={viewModalOpened}
        onClose={() => {
          setViewModalOpened(false);
          if (pdfUrl) URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }}
        size="xl"
        title="Employee Details"
      >
        {pdfUrl && (
          <>
            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "500px", border: "none" }}
            />
            <Group mt="md">
              <Button onClick={() => setViewModalOpened(false)}>Close</Button>
              <Button
                component="a"
                href={pdfUrl}
                download={`employee_${selectedEmployee?.id}.pdf`}
              >
                Download PDF
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default ListEmployees;
