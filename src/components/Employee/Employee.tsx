import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  FileInput,
  Grid,
  Card,
  Text,
  Group,
  Table,
  Container,
  Title,
  Badge,
  ActionIcon,
  Avatar,
  Tooltip,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import {
  IconBuilding,
  IconEdit,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import {
  Employee,
  EmployeeFormValues,
  Designation,
  EmployeeDepartments,
  Companies,
} from "./interface/employee.interface";
import "@mantine/core/styles.css";

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [opened, setOpened] = useState(false);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [employeeDepartments, setEmployeeDepartments] = useState<
    EmployeeDepartments[]
  >([]);
  const [companies, setCompanies] = useState<Companies[]>([]);

  const titleData = ["MR", "MS"].map((value) => ({
    value,
    label: value,
  }));
  const genderData = ["MALE", "FEMALE"].map((value) => ({
    value,
    label: value,
  }));
  const categoryData = ["SC", "ST", "OBC", "GENERAL"].map((value) => ({
    value,
    label: value,
  }));
  const educationQualificationData = [
    "UNDER_8",
    "EIGHT",
    "TEN",
    "TWELVE",
    "GRADUATE",
    "POST_GRADUATE",
  ].map((value) => ({ value, label: value }));

  const form = useForm<EmployeeFormValues>({
    initialValues: {
      title: "",
      firstName: "",
      lastName: "",
      designationId: "",
      employeeDepartmentId: "",
      mobileNumber: "",
      companyName: "",
      companyId: "",
      recruitedBy: "",
      gender: "",
      fatherName: "",
      motherName: "",
      husbandName: null,
      category: "",
      dateOfBirth: null,
      age: 0,
      dateOfJoining: null,
      highestEducationQualification: "",
      bloodGroup: "",
      permanentAddress: "",
      presentAddress: "",
      city: "",
      district: "",
      state: "",
      pincode: 0,
      referenceName: "",
      referenceAddress: "",
      referenceNumber: "",
      bankAccountNumber: "",
      ifscCode: "",
      bankCity: "",
      bankName: "",
      pfUanNumber: "",
      esicNumber: "",
      policeVerificationNumber: "",
      policeVerificationDate: null,
      trainingCertificateNumber: "",
      trainingCertificateDate: null,
      medicalCertificateNumber: "",
      medicalCertificateDate: null,
      photoUpload: null,
      aadhaarUpload: null,
      panCardUpload: null,
      bankPassbook: null,
      markSheet: null,
      otherDocument: null,
      salary: 0,
      aadhaarNumber: "",
    },
    validate: {
      firstName: (value) => (value ? null : "First Name is required"),
      lastName: (value) => (value ? null : "Last Name is required"),
      mobileNumber: (value) =>
        /^\d{10}$/.test(value) ? null : "Invalid mobile number",
      aadhaarNumber: (value) =>
        /^\d{12}$/.test(value) ? null : "Invalid Aadhaar number",
      salary: (value) => (value > 0 ? null : "Salary must be greater than 0"),
    },
  });

  useEffect(() => {
    fetchEmployees();
    fetchDesignations();
    fetchEmployeeDepartments();
    fetchCompanies();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get<{ data: Employee[] }>(
        "http://localhost:3003/employees"
      );
      setEmployees(response.data.data);
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
      const response = await axios.get<{ data: Companies[] }>(
        "http://localhost:3003/companies"
      );
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  const handleEdit = (id: string) => {
    console.log('Editing')
    // Handle edit logic
  };

  const handleDelete = (id: string) => {
    console.log('Deleting')
    // Handle delete logic
  };

  const handleCreate = () => {
    // Handle create logic
  };
  const handleSubmit = (values: EmployeeFormValues) => {
    console.log(values);
    // Here you would typically send a POST request to create the employee
    setOpened(false);
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
            <Text size="xs" c="dimmed">
              ID: {employee.id}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconBuilding size="0.8rem" />
          </ThemeIcon>
          <Text size="sm">{employee.companyName}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(employee.id)}>
            <IconEdit size="1rem" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(employee.id)}>
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
        <Button onClick={() => setOpened(true)}>Create Employee</Button>
      </Group>

      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        verticalSpacing="md"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Company</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Employee"
        size="xl"
      >
        {/* <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={4}>
              <Select
                label="Title"
                placeholder="Select title"
                data={titleData}
                {...form.getInputProps("title")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                {...form.getInputProps("firstName")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                {...form.getInputProps("lastName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Date of Birth"
                placeholder="Select date"
                {...form.getInputProps("dateOfBirth")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Date of Joining"
                placeholder="Select date"
                {...form.getInputProps("dateOfJoining")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Gender"
                placeholder="Select gender"
                data={genderData}
                {...form.getInputProps("gender")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Category"
                placeholder="Select category"
                data={categoryData}
                {...form.getInputProps("category")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Mobile Number"
                placeholder="Enter mobile number"
                {...form.getInputProps("mobileNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Aadhaar Number"
                placeholder="Enter Aadhaar number"
                {...form.getInputProps("aadhaarNumber")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <NumberInput
                label="Salary"
                placeholder="Enter salary"
                {...form.getInputProps("salary")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Photo Upload"
                placeholder="Upload photo"
                {...form.getInputProps("photoUpload")}
                accept="image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Aadhaar Upload"
                placeholder="Upload Aadhaar"
                {...form.getInputProps("aadhaarUpload")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Highest Education Qualification"
                placeholder="Select qualification"
                data={educationQualificationData}
                {...form.getInputProps("highestEducationQualification")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Designation"
                placeholder="Select designation"
                data={designations.map((designation) => ({
                  value: designation.id,
                  label: designation.name,
                }))}
                {...form.getInputProps("designationId")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Employee Department"
                placeholder="Select department"
                data={employeeDepartments.map((department) => ({
                  value: department.id,
                  label: department.name,
                }))}
                {...form.getInputProps("employeeDepartmentId")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Company"
                placeholder="Select company"
                data={companies.map((company) => ({
                  value: company.id,
                  label: company.name,
                }))}
                {...form.getInputProps("companyId")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Recruited By"
                placeholder="Enter recruiter name"
                {...form.getInputProps("recruitedBy")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Father's Name"
                placeholder="Enter father's name"
                {...form.getInputProps("fatherName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Mother's Name"
                placeholder="Enter mother's name"
                {...form.getInputProps("motherName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Husband's Name"
                placeholder="Enter husband's name"
                {...form.getInputProps("husbandName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Blood Group"
                placeholder="Enter blood group"
                {...form.getInputProps("bloodGroup")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Permanent Address"
                placeholder="Enter permanent address"
                {...form.getInputProps("permanentAddress")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Present Address"
                placeholder="Enter present address"
                {...form.getInputProps("presentAddress")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="City"
                placeholder="Enter city"
                {...form.getInputProps("city")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="District"
                placeholder="Enter district"
                {...form.getInputProps("district")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="State"
                placeholder="Enter state"
                {...form.getInputProps("state")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Pincode"
                placeholder="Enter pincode"
                {...form.getInputProps("pincode")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Reference Name"
                placeholder="Enter reference name"
                {...form.getInputProps("referenceName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Reference Address"
                placeholder="Enter reference address"
                {...form.getInputProps("referenceAddress")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Reference Number"
                placeholder="Enter reference number"
                {...form.getInputProps("referenceNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Bank Account Number"
                placeholder="Enter bank account number"
                {...form.getInputProps("bankAccountNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="IFSC Code"
                placeholder="Enter IFSC code"
                {...form.getInputProps("ifscCode")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Bank City"
                placeholder="Enter bank city"
                {...form.getInputProps("bankCity")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Bank Name"
                placeholder="Enter bank name"
                {...form.getInputProps("bankName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="PF UAN Number"
                placeholder="Enter PF UAN number"
                {...form.getInputProps("pfUanNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="ESIC Number"
                placeholder="Enter ESIC number"
                {...form.getInputProps("esicNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Police Verification Number"
                placeholder="Enter police verification number"
                {...form.getInputProps("policeVerificationNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Police Verification Date"
                placeholder="Select date"
                {...form.getInputProps("policeVerificationDate")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Training Certificate Number"
                placeholder="Enter training certificate number"
                {...form.getInputProps("trainingCertificateNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Training Certificate Date"
                placeholder="Select date"
                {...form.getInputProps("trainingCertificateDate")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Medical Certificate Number"
                placeholder="Enter medical certificate number"
                {...form.getInputProps("medicalCertificateNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Medical Certificate Date"
                placeholder="Select date"
                {...form.getInputProps("medicalCertificateDate")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="PAN Card Upload"
                placeholder="Upload PAN card"
                {...form.getInputProps("panCardUpload")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Bank Passbook"
                placeholder="Upload bank passbook"
                {...form.getInputProps("bankPassbook")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Mark Sheet"
                placeholder="Upload mark sheet"
                {...form.getInputProps("markSheet")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Other Document"
                placeholder="Upload other document"
                {...form.getInputProps("otherDocument")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form> */}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title order={3} mb="md">
            Basic Details
          </Title>
          <Grid>
            <Grid.Col span={4}>
              <Select
                label="Title"
                required
                placeholder="Select title"
                data={titleData}
                {...form.getInputProps("title")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="First Name"
                required
                placeholder="Enter first name"
                {...form.getInputProps("firstName")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Last Name"
                required
                placeholder="Enter last name"
                {...form.getInputProps("lastName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Date of Birth"
                required
                placeholder="Select date"
                {...form.getInputProps("dateOfBirth")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Gender"
                required
                placeholder="Select gender"
                data={genderData}
                {...form.getInputProps("gender")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Father's Name"
                required
                placeholder="Enter father's name"
                {...form.getInputProps("fatherName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Mother's Name"
                required
                placeholder="Enter mother's name"
                {...form.getInputProps("motherName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Husband's Name"
                required
                placeholder="Enter husband's name"
                {...form.getInputProps("husbandName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Blood Group"
                required
                placeholder="Enter blood group"
                {...form.getInputProps("bloodGroup")}
              />
            </Grid.Col>
          </Grid>

          <Title order={3} mt="xl" mb="md">
            Contact Details
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Mobile Number"
                required
                placeholder="Enter mobile number"
                {...form.getInputProps("mobileNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Aadhaar Number"
                required
                placeholder="Enter Aadhaar number"
                {...form.getInputProps("aadhaarNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Permanent Address"
                required
                placeholder="Enter permanent address"
                {...form.getInputProps("permanentAddress")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Present Address"
                required
                placeholder="Enter present address"
                {...form.getInputProps("presentAddress")}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="City"
                required
                placeholder="Enter city"
                {...form.getInputProps("city")}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="District"
                required
                placeholder="Enter district"
                {...form.getInputProps("district")}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="State"
                required
                placeholder="Enter state"
                {...form.getInputProps("state")}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NumberInput
                label="Pincode"
                required
                placeholder="Enter pincode"
                {...form.getInputProps("pincode")}
              />
            </Grid.Col>
          </Grid>

          <Title order={3} mt="xl" mb="md">
            Employment Details
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Date of Joining"
                required
                placeholder="Select date"
                {...form.getInputProps("dateOfJoining")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Category"
                required
                placeholder="Select category"
                data={categoryData}
                {...form.getInputProps("category")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Salary"
                required
                placeholder="Enter salary"
                {...form.getInputProps("salary")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Highest Education Qualification"
                required
                placeholder="Select qualification"
                data={educationQualificationData}
                {...form.getInputProps("highestEducationQualification")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Designation"
                required
                placeholder="Select designation"
                data={designations.map((designation) => ({
                  value: designation.id,
                  label: designation.name,
                }))}
                {...form.getInputProps("designationId")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Employee Department"
                required
                placeholder="Select department"
                data={employeeDepartments.map((department) => ({
                  value: department.id,
                  label: department.name,
                }))}
                {...form.getInputProps("employeeDepartmentId")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Company"
                required
                placeholder="Select company"
                data={companies.map((company) => ({
                  value: company.id,
                  label: company.name,
                }))}
                {...form.getInputProps("companyId")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Recruited By"
                required
                placeholder="Enter recruiter name"
                {...form.getInputProps("recruitedBy")}
              />
            </Grid.Col>
          </Grid>

          <Title order={3} mt="xl" mb="md">
            Bank Details
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Bank Account Number"
                required
                placeholder="Enter bank account number"
                {...form.getInputProps("bankAccountNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="IFSC Code"
                required
                placeholder="Enter IFSC code"
                {...form.getInputProps("ifscCode")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Bank Name"
                required
                placeholder="Enter bank name"
                {...form.getInputProps("bankName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Bank City"
                required
                placeholder="Enter bank city"
                {...form.getInputProps("bankCity")}
              />
            </Grid.Col>
          </Grid>

          <Title order={3} mt="xl" mb="md">
            Additional Details
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="PF UAN Number"
                required
                placeholder="Enter PF UAN number"
                {...form.getInputProps("pfUanNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="ESIC Number"
                required
                placeholder="Enter ESIC number"
                {...form.getInputProps("esicNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Police Verification Number"
                required
                placeholder="Enter police verification number"
                {...form.getInputProps("policeVerificationNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Police Verification Date"
                required
                placeholder="Select date"
                {...form.getInputProps("policeVerificationDate")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Training Certificate Number"
                required
                placeholder="Enter training certificate number"
                {...form.getInputProps("trainingCertificateNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Training Certificate Date"
                required
                placeholder="Select date"
                {...form.getInputProps("trainingCertificateDate")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Medical Certificate Number"
                required
                placeholder="Enter medical certificate number"
                {...form.getInputProps("medicalCertificateNumber")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Medical Certificate Date"
                required
                placeholder="Select date"
                {...form.getInputProps("medicalCertificateDate")}
              />
            </Grid.Col>
          </Grid>

          <Title order={3} mt="xl" mb="md">
            Reference Details
          </Title>
          <Grid>
            <Grid.Col span={4}>
              <TextInput
                label="Reference Name"
                required
                placeholder="Enter reference name"
                {...form.getInputProps("referenceName")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Reference Address"
                required
                placeholder="Enter reference address"
                {...form.getInputProps("referenceAddress")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Reference Number"
                required
                placeholder="Enter reference number"
                {...form.getInputProps("referenceNumber")}
              />
            </Grid.Col>
          </Grid>

          <Title order={3} mt="xl" mb="md">
            Document Uploads
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <FileInput
                label="Photo Upload"
                required
                placeholder="Upload photo"
                {...form.getInputProps("photoUpload")}
                accept="image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Aadhaar Upload"
                required
                placeholder="Upload Aadhaar"
                {...form.getInputProps("aadhaarUpload")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="PAN Card Upload"
                required
                placeholder="Upload PAN card"
                {...form.getInputProps("panCardUpload")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Bank Passbook"
                required
                placeholder="Upload bank passbook"
                {...form.getInputProps("bankPassbook")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Mark Sheet"
                required
                placeholder="Upload mark sheet"
                {...form.getInputProps("markSheet")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Other Document"
                required
                placeholder="Upload other document"
                {...form.getInputProps("otherDocument")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default EmployeesPage;
