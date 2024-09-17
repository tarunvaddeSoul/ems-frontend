import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextInput,
  Select,
  NumberInput,
  FileInput,
  Grid,
  Text,
  Group,
  Table,
  Container,
  Title,
  ActionIcon,
  Avatar,
  ThemeIcon,
  Divider,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput, DatePickerInput } from "@mantine/dates";
import {
  IconBuilding,
  IconEdit,
  IconTrash,
  IconEye,
  IconUserPlus,
  IconUpload,
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
import { PDFViewer, pdf } from "@react-pdf/renderer";
import EmployeeView from "./EmployeeView";
import { parse } from "date-fns";

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [opened, setOpened] = useState(false);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [employeeDepartments, setEmployeeDepartments] = useState<
    EmployeeDepartments[]
  >([]);
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
      status: "",
      currentCompanyDesignationId: "",
      currentCompanyDepartmentId: "",
      mobileNumber: "",
      currentCompanyId: "",
      recruitedBy: "",
      gender: "",
      fatherName: "",
      motherName: "",
      husbandName: "",
      category: "",
      dateOfBirth: new Date(),
      employeeOnboardingDate: new Date(),
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
      policeVerificationDate: new Date(),
      trainingCertificateNumber: "",
      trainingCertificateDate: new Date(),
      medicalCertificateNumber: "",
      medicalCertificateDate: new Date(),
      photo: null,
      aadhaar: null,
      panCard: null,
      bankPassbook: null,
      markSheet: null,
      otherDocument: null,
      currentCompanySalary: 0,
      aadhaarNumber: "",
    },
    validate: {
      firstName: (value) => (value ? null : "First Name is required"),
      lastName: (value) => (value ? null : "Last Name is required"),
      mobileNumber: (value) =>
        /^\d{10}$/.test(value) ? null : "Invalid mobile number",
      aadhaarNumber: (value) =>
        /^\d{12}$/.test(value) ? null : "Invalid Aadhaar number",
      // salary: (value) => (value > 0 ? null : "Salary must be greater than 0"),
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
      const response = await axios.get(
        "http://localhost:3003/employees"
      );
      setEmployees(response.data.data.data);
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
      const response = await axios.get(
        "http://localhost:3003/companies"
      );
      setCompanies(response.data.data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleView = async (id: string) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      const blob = await pdf(<EmployeeView employee={employee} />).toBlob();
      const url = URL.createObjectURL(blob);
      setViewModalOpened(true);
      setPdfUrl(url);
    }
  };
  const handleEdit = (id: string) => {
    const employeeToEdit = employees.find((emp) => emp.id === id);
    if (employeeToEdit) {
      const formValues: Partial<EmployeeFormValues> = {
        title: employeeToEdit.title,
        firstName: employeeToEdit.firstName,
        lastName: employeeToEdit.lastName,
        // designationId: employeeToEdit.designationId,
        // employeeDepartmentId: employeeToEdit.employeeDepartmentId,
        mobileNumber: employeeToEdit.mobileNumber,
        // companyId: employeeToEdit.companyId,
        recruitedBy: employeeToEdit.recruitedBy,
        gender: employeeToEdit.gender,
        fatherName: employeeToEdit.fatherName,
        motherName: employeeToEdit.motherName,
        husbandName: employeeToEdit.husbandName,
        category: employeeToEdit.category,
        dateOfBirth: parse(
          employeeToEdit.dateOfBirth as string,
          "dd-MM-yyyy",
          new Date()
        ),
        employeeOnboardingDate: parse(
          employeeToEdit.dateOfJoining as string,
          "dd-MM-yyyy",
          new Date()
        ),
        highestEducationQualification:
          employeeToEdit.highestEducationQualification,
        bloodGroup: employeeToEdit.bloodGroup,
        permanentAddress: employeeToEdit.permanentAddress,
        presentAddress: employeeToEdit.presentAddress,
        city: employeeToEdit.city,
        district: employeeToEdit.district,
        state: employeeToEdit.state,
        pincode: employeeToEdit.pincode,
        referenceName: employeeToEdit.referenceName,
        referenceAddress: employeeToEdit.referenceAddress,
        referenceNumber: employeeToEdit.referenceNumber,
        bankAccountNumber: employeeToEdit.bankAccountNumber,
        ifscCode: employeeToEdit.ifscCode,
        bankCity: employeeToEdit.bankCity,
        bankName: employeeToEdit.bankName,
        pfUanNumber: employeeToEdit.pfUanNumber,
        esicNumber: employeeToEdit.esicNumber,
        policeVerificationNumber: employeeToEdit.policeVerificationNumber,
        policeVerificationDate: parse(
          employeeToEdit.policeVerificationDate as string,
          "dd-MM-yyyy",
          new Date()
        ),
        trainingCertificateNumber: employeeToEdit.trainingCertificateNumber,
        trainingCertificateDate: parse(
          employeeToEdit.trainingCertificateDate as string,
          "dd-MM-yyyy",
          new Date()
        ),
        medicalCertificateNumber: employeeToEdit.medicalCertificateNumber,
        medicalCertificateDate: parse(
          employeeToEdit.medicalCertificateDate as string,
          "dd-MM-yyyy",
          new Date()
        ),
        // salary: employeeToEdit.salary,
        aadhaarNumber: employeeToEdit.aadhaarNumber,
      };

      form.setValues(formValues);
      setIsEditing(true);
      setSelectedEmployee(employeeToEdit);
      setOpened(true);
    }
  };

  const handleEditSubmit = async (values: EmployeeFormValues) => {
    try {
      const formData = new FormData();
      const originalEmployee = employees.find(
        (emp) => emp.id === selectedEmployee?.id
      );

      if (!originalEmployee) {
        console.error("Original employee not found");
        return;
      }

      // Compare and add only changed fields
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof Date) {
          const formattedDate = `${value
            .getDate()
            .toString()
            .padStart(2, "0")}-${(value.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${value.getFullYear()}`;
          if (formattedDate !== (originalEmployee as any)[key]) {
            formData.append(key, formattedDate);
          }
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== (originalEmployee as any)[key]) {
          formData.append(key, String(value));
        }
      });

      if (formData.entries().next().done) {
        console.log("No changes detected");
        setOpened(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:3003/employees/${selectedEmployee?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Employee updated successfully", response.data);
      setOpened(false);
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Deleting");
    // Handle delete logic
  };

  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      console.log("hii");
      console.log(
        `${values.trainingCertificateDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(values.trainingCertificateDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${values.trainingCertificateDate.getFullYear()}`
      );
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      // formData.append("currentCompanyDesignationId", values.currentCompanyDesignationId);
      // formData.append("currentCompanyDepartmentId", values.currentCompanyDepartmentId);
      // formData.append("mobileNumber", values.mobileNumber);
      // formData.append("companyId", values.companyId);
      formData.append("recruitedBy", values.recruitedBy);
      formData.append("gender", values.gender);
      formData.append("fatherName", values.fatherName);
      formData.append("motherName", values.motherName);
      formData.append("husbandName", values.husbandName || "");
      formData.append("category", values.category);
      formData.append(
        "dateOfBirth",
        `${values.dateOfBirth.getDate().toString().padStart(2, "0")}-${(
          values.dateOfBirth.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${values.dateOfBirth.getFullYear()}`
      );
      formData.append(
        "dateOfJoining",
        `${values.employeeOnboardingDate.getDate().toString().padStart(2, "0")}-${(
          values.employeeOnboardingDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${values.employeeOnboardingDate.getFullYear()}`
      );
      formData.append(
        "highestEducationQualification",
        values.highestEducationQualification
      );
      formData.append("bloodGroup", values.bloodGroup);
      formData.append("permanentAddress", values.permanentAddress);
      formData.append("presentAddress", values.presentAddress);
      formData.append("city", values.city);
      formData.append("district", values.district);
      formData.append("state", values.state);
      formData.append("pincode", values.pincode.toString());
      formData.append("referenceName", values.referenceName);
      formData.append("referenceAddress", values.referenceAddress);
      formData.append("referenceNumber", values.referenceNumber);
      formData.append("bankAccountNumber", values.bankAccountNumber);
      formData.append("ifscCode", values.ifscCode);
      formData.append("bankCity", values.bankCity);
      formData.append("bankName", values.bankName);
      formData.append("pfUanNumber", values.pfUanNumber);
      formData.append("esicNumber", values.esicNumber);
      formData.append(
        "policeVerificationNumber",
        values.policeVerificationNumber
      );
      formData.append(
        "policeVerificationDate",
        `${values.policeVerificationDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(values.policeVerificationDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${values.policeVerificationDate.getFullYear()}`
      );
      formData.append(
        "trainingCertificateNumber",
        values.trainingCertificateNumber
      );
      formData.append(
        "trainingCertificateDate",
        `${values.trainingCertificateDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(values.trainingCertificateDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${values.trainingCertificateDate.getFullYear()}`
      );
      formData.append(
        "medicalCertificateNumber",
        values.medicalCertificateNumber
      );
      formData.append(
        "medicalCertificateDate",
        `${values.medicalCertificateDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(values.medicalCertificateDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${values.medicalCertificateDate.getFullYear()}`
      );
      formData.append("photo", values.photo as any);
      formData.append("aadhaar", values.aadhaar as any);
      formData.append("panCard", values.panCard as any);
      formData.append("bankPassbook", values.bankPassbook as any);
      formData.append("markSheet", values.markSheet as any);
      formData.append("otherDocument", values.otherDocument as any);
      // formData.append("salary", values.salary.toString());
      formData.append("aadhaarNumber", values.aadhaarNumber);

      const response = await axios.post(
        "http://localhost:3003/employees/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Employee created successfully", response.data);
      // Close the form modal or reset the form if needed
      setOpened(false);
    } catch (error) {
      console.error("Error creating employee", error);
    }
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
          <Text size="sm">{employee.designationName}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconBuilding size="0.8rem" />
          </ThemeIcon>
          <Text size="sm">{employee.employeeDepartmentName}</Text>
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
          <ActionIcon
            variant="subtle"
            color="yellow"
            onClick={() => handleView(employee.id)}
          >
            <IconEye size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleEdit(employee.id)}
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
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Group justify="space-between" mb="xl">
        <Title order={2}>Employees</Title>
        <Button
          leftSection={<IconUserPlus size={20} />}
          onClick={() => {
            form.reset();
            setIsEditing(false);
            setOpened(true);
          }}
        >
          Create Employee
        </Button>
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
            <Table.Th>Designation</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Site</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            {selectedEmployee ? (
              <IconEdit size={24} style={{ marginRight: "10px" }} />
            ) : (
              <IconUserPlus size={24} style={{ marginRight: "10px" }} />
            )}
            <Text>
              {selectedEmployee ? "Edit Employee" : "Create Employee"}
            </Text>
          </div>
        }
      >
        <Divider labelPosition="center" my="lg" />

        <form
          onSubmit={form.onSubmit((values) =>
            selectedEmployee
              ? handleEditSubmit(values as unknown as EmployeeFormValues)
              : handleSubmit(values as unknown as EmployeeFormValues)
          )}
        >
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
                mx="auto"
                maw={400}
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
          <Divider labelPosition="center" my="lg" />

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
          <Divider labelPosition="center" my="lg" />

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
          <Divider labelPosition="center" my="lg" />

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
          <Divider labelPosition="center" my="lg" />

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
          <Divider labelPosition="center" my="lg" />

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
          <Divider labelPosition="center" my="lg" />

          <Title order={3} mt="xl" mb="md">
            Document Uploads
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <FileInput
                label="Photo Upload"
                leftSection={<IconUpload size={14} />}
                required
                placeholder="Upload photo"
                {...form.getInputProps("photo")}
                accept="image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Aadhaar Upload"
                leftSection={<IconUpload size={14} />}
                required
                placeholder="Upload Aadhaar"
                {...form.getInputProps("aadhaar")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="PAN Card Upload"
                leftSection={<IconUpload size={14} />}
                required
                placeholder="Upload PAN card"
                {...form.getInputProps("panCardUpload")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Bank Passbook"
                leftSection={<IconUpload size={14} />}
                required
                placeholder="Upload bank passbook"
                {...form.getInputProps("bankPassbook")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Mark Sheet"
                leftSection={<IconUpload size={14} />}
                required
                placeholder="Upload mark sheet"
                {...form.getInputProps("markSheet")}
                accept="application/pdf,image/*"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FileInput
                label="Other Document"
                leftSection={<IconUpload size={14} />}
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

export default EmployeesPage;
