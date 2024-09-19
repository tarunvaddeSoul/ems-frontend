import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Paper,
  Text,
  Grid,
  Divider,
  Stack,
  Avatar,
  Badge,
  Table,
  Group,
  Skeleton,
} from "@mantine/core";
import {
  Employee,
  IEmployeeDocumentUploads,
} from "./interface/employee.interface";
import { useParams } from "react-router-dom";
import EnhancedDocumentDisplay from "./DocumentDisplay";

const GetEmployeeByPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3003/employees/${id}`
        );
        setEmployee(response.data.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return <EmployeeSkeleton />;
  }

  if (!employee) {
    return <Text>Employee not found.</Text>;
  }

  return (
    <Container size="lg">
      <Paper shadow="sm" p="md" withBorder>
        <Group gap="apart" mb="md">
          <Group>
            <Avatar size="xl" radius="xl" color="blue">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </Avatar>
            <div>
              <Title
                order={2}
              >{`${employee.title} ${employee.firstName} ${employee.lastName}`}</Title>
              <Badge color={employee.status === "ACTIVE" ? "green" : "red"}>
                {employee.status}
              </Badge>
            </div>
          </Group>
          <Text size="sm" c="dimmed">
            ID: {employee.id}
          </Text>
        </Group>

        <Divider my="md" />

        <Grid gutter="md">
          <Grid.Col span={6}>
            <Stack>
              <Title order={2}>Basic Information</Title>
              <InfoItem label="Gender" value={employee.gender as string} />
              <InfoItem
                label="Date of Birth"
                value={employee.dateOfBirth as string}
              />
              <InfoItem
                label="Age"
                value={employee.age?.toString() as string}
              />
              <InfoItem
                label="Blood Group"
                value={employee.bloodGroup as string}
              />
              <InfoItem label="Category" value={employee.category as string} />
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack>
              <Title order={2}>Contact Information</Title>
              <InfoItem
                label="Mobile"
                value={employee?.contactDetails?.mobileNumber as string}
              />
              <InfoItem
                label="Present Address"
                value={employee.contactDetails?.presentAddress as string}
              />
              <InfoItem
                label="City"
                value={employee.contactDetails?.city as string}
              />
              <InfoItem
                label="State"
                value={employee.contactDetails?.state as string}
              />
              <InfoItem
                label="Pincode"
                value={employee?.contactDetails?.pincode?.toString() as string}
              />
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Title order={2} mb="sm">
          Banking Information
        </Title>
        <Grid gutter="md">
          <Grid.Col span={6}>
            <InfoItem
              label="Bank Name"
              value={employee.bankDetails?.bankName as string}
            />
            <InfoItem
              label="Account Number"
              value={employee.bankDetails?.bankAccountNumber as string}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <InfoItem
              label="IFSC Code"
              value={employee.bankDetails?.ifscCode as string}
            />
            <InfoItem
              label="PF UAN Number"
              value={employee.additionalDetails?.pfUanNumber as string}
            />
          </Grid.Col>
        </Grid>
        <Grid gutter="md">
          <Grid.Col span={6}></Grid.Col>
        </Grid>
        <Divider my="md" />

        <Title order={2} mb="sm">
          Reference Details
        </Title>
        <InfoItem
          label="Reference Name"
          value={employee.referenceDetails?.referenceName as string}
        />
        <InfoItem
          label="Reference Address"
          value={employee.referenceDetails?.referenceAddress as string}
        />
        <InfoItem
          label="Reference Number"
          value={employee.referenceDetails?.referenceNumber as string}
        />
        <Divider my="md" />

        <Title order={2} mb="sm">
          Additional Details
        </Title>
        <Grid gutter="md">
          <Grid.Col span={6}>
            <InfoItem
              label="PF UAN Number"
              value={employee.referenceDetails?.referenceName as string}
            />
            <InfoItem
              label="ESIC Number"
              value={employee.referenceDetails?.referenceAddress as string}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <InfoItem
              label="Police Verification Number"
              value={employee.referenceDetails?.referenceNumber as string}
            />
            <InfoItem
              label="Police Verification Date"
              value={employee.referenceDetails?.referenceNumber as string}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <InfoItem
              label="Training Certificate Number"
              value={employee.referenceDetails?.referenceNumber as string}
            />

            <InfoItem
              label="Training Certificate Date"
              value={employee.referenceDetails?.referenceNumber as string}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <InfoItem
              label="Medical Certificate Number"
              value={employee.referenceDetails?.referenceNumber as string}
            />

            <InfoItem
              label="Medical Certificate Date"
              value={employee.referenceDetails?.referenceNumber as string}
            />
          </Grid.Col>
        </Grid>
        <Divider my="md" />

        <EnhancedDocumentDisplay
          documents={employee.documentUploads as IEmployeeDocumentUploads}
        />

        <Divider my="md" />

        <Title order={2} mb="sm">
          Employment History
        </Title>
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
                <Table.Th>Company</Table.Th>
                <Table.Th>Designation</Table.Th>
                <Table.Th>Department</Table.Th>
                <Table.Th>Salary</Table.Th>
                <Table.Th>Joining Date</Table.Th>
                <Table.Th>Leaving Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {employee.employmentHistories?.map((history: any, index: any) => (
                <Table.Tr key={index}>
                  <Table.Td>{history.companyName}</Table.Td>
                  <Table.Td>{history.designationName}</Table.Td>
                  <Table.Td>{history.departmentName}</Table.Td>
                  <Table.Td>{history.salary}</Table.Td>
                  <Table.Td>{history.joiningDate}</Table.Td>
                  <Table.Td>{history.leavingDate || "Present"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </Container>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Text>
    <Text component="span" fw={700}>
      {label}:
    </Text>{" "}
    {value}
  </Text>
);

const EmployeeSkeleton: React.FC = () => (
  <Container size="lg">
    <Paper shadow="sm" p="md" withBorder>
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Paper>
  </Container>
);

export default GetEmployeeByPage;
