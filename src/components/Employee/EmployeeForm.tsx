import React, { useState } from "react";
import {
  TextInput,
  Select,
  NumberInput,
  FileInput,
  Grid,
  Title,
  Divider,
  Button,
  Group,
  ScrollArea,
  Checkbox,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import { EmployeeFormValues } from "./interface/employee.interface";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

interface EmployeeFormProps {
  initialValues?: Partial<EmployeeFormValues>;
  onSubmit: (values: EmployeeFormValues) => void;
  designations: { value: string; label: string }[];
  employeeDepartments: { value: string; label: string }[];
  companies: { value: string; label: string }[];
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  designations,
  employeeDepartments,
  companies,
}) => {
  const form = useForm<EmployeeFormValues>({
    initialValues: {
      title: "",
      firstName: "",
      lastName: "",
      currentCompanyDesignationId: "",
      currentCompanyDepartmentId: "",
      currentCompanyJoiningDate: new Date(),
      mobileNumber: "",
      currentCompanyId: "",
      recruitedBy: "",
      gender: "",
      status: "",
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
      otherDocumentRemarks: "",
      currentCompanySalary: 0,
      aadhaarNumber: "",
      ...initialValues,
    },
    validate: {
      firstName: (value) => (value ? null : "First Name is required"),
      lastName: (value) => (value ? null : "Last Name is required"),
      mobileNumber: (value) =>
        /^\d{10}$/.test(value) ? null : "Invalid mobile number",
      aadhaarNumber: (value) =>
        /^\d{12}$/.test(value) ? null : "Invalid Aadhaar number",
      currentCompanySalary: (value: any) =>
        value > 0 ? null : "Salary must be greater than 0",
      // email: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const titleData = ["MR", "MS"].map((value) => ({ value, label: value }));
  const statusData = ["ACTIVE", "INACTIVE"].map((value) => ({
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
  const [gender, setGender] = useState("");
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const handleGenderChange = (value: any) => {
    setGender(value);
    form.setFieldValue("gender", value);
  };

  const handleSameAsPermanentChange = (event: any) => {
    setSameAsPermanent(event.currentTarget.checked);
    if (event.currentTarget.checked) {
      form.setFieldValue("presentAddress", form.values.permanentAddress);
    }
  };

  return (
    
    // <ScrollArea h='100%'>
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Title order={3} mb="md">
        Basic Details
      </Title>
      <Grid>
        <Grid.Col span={4}>
          <Select
            label="Title"
            searchable
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
            valueFormat="DD-MM-YYYY"
            required
            placeholder="Select date"
            {...form.getInputProps("dateOfBirth")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Gender"
            searchable
            required
            placeholder="Select gender"
            data={genderData}
            {...form.getInputProps("gender")}
            onChange={handleGenderChange}
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
        {gender === "FEMALE" && (
          <Grid.Col span={6}>
            <TextInput
              label="Husband's Name"
              placeholder="Enter husband's name"
              {...form.getInputProps("husbandName")}
            />
          </Grid.Col>
        )}
        <Grid.Col span={6}>
          <TextInput
            label="Blood Group"
            required
            placeholder="Enter blood group"
            {...form.getInputProps("bloodGroup")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <DatePickerInput
            valueFormat="DD-MM-YYYY"
            label="Employee onboarding date"
            required
            placeholder="Select date"
            {...form.getInputProps("employeeOnboardingDate")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Status"
            searchable
            defaultValue={"ACTIVE"}
            placeholder="Select Employee Status"
            data={statusData}
            {...form.getInputProps("status")}
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
        <Grid.Col span={6}>
          <Select
            label="Highest Education Qualification"
            required
            placeholder="Select qualification"
            data={educationQualificationData}
            searchable
            {...form.getInputProps("highestEducationQualification")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Category"
            searchable
            required
            placeholder="Select category"
            data={categoryData}
            {...form.getInputProps("category")}
          />
        </Grid.Col>
      </Grid>

      <Divider my="lg" />

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
        <Grid.Col span={12}>
          <TextInput
            label="Permanent Address"
            required
            placeholder="Enter permanent address"
            {...form.getInputProps("permanentAddress")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Checkbox
            label="Present address same as permanent address"
            checked={sameAsPermanent}
            onChange={handleSameAsPermanentChange}
            mb="sm"
          />
          <TextInput
            label="Present Address"
            required
            placeholder="Enter present address"
            {...form.getInputProps("presentAddress")}
            disabled={sameAsPermanent}
          />
        </Grid.Col>
      </Grid>
      <Grid>
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
      <Divider my="lg" />

      <Title order={3} mt="xl" mb="md">
        Employment Details
      </Title>
      <Grid>
        <Grid.Col span={6}>
          <DatePickerInput
            valueFormat="DD-MM-YYYY"
            label="Company Date of Joining"
            // required
            placeholder="Select date"
            {...form.getInputProps("currentCompanyJoiningDate")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <NumberInput
            label="Salary"
            // required
            placeholder="Enter salary"
            {...form.getInputProps("currentCompanySalary")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Designation"
            required
            placeholder="Select designation"
            searchable
            data={designations}
            {...form.getInputProps("currentCompanyDesignationId")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Employee Department"
            searchable
            required
            placeholder="Select department"
            data={employeeDepartments}
            {...form.getInputProps("currentCompanyDepartmentId")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Company"
            searchable
            // required
            placeholder="Select company"
            data={companies}
            {...form.getInputProps("currentCompanyId")}
          />
        </Grid.Col>
      </Grid>

      <Divider my="lg" />

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

      <Divider my="lg" />

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
            valueFormat="DD-MM-YYYY"
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
            valueFormat="DD-MM-YYYY"
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
            valueFormat="DD-MM-YYYY"
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
            placeholder="Upload photo"
            {...form.getInputProps("photo")}
            accept="application/pdf,image/*"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="Aadhaar Upload"
            leftSection={<IconUpload size={14} />}
            placeholder="Upload Aadhaar"
            {...form.getInputProps("aadhaar")}
            accept="application/pdf,image/*"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="PAN Card Upload"
            leftSection={<IconUpload size={14} />}
            placeholder="Upload PAN card"
            {...form.getInputProps("panCard")}
            accept="application/pdf,image/*"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="Bank Passbook"
            leftSection={<IconUpload size={14} />}
            placeholder="Upload bank passbook"
            {...form.getInputProps("bankPassbook")}
            accept="application/pdf,image/*"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="Mark Sheet"
            leftSection={<IconUpload size={14} />}
            placeholder="Upload mark sheet"
            {...form.getInputProps("markSheet")}
            accept="application/pdf,image/*"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="Other Document"
            leftSection={<IconUpload size={14} />}
            placeholder="Upload other document"
            {...form.getInputProps("otherDocument")}
            accept="application/pdf,image/*"
          />
        </Grid.Col>
        {form.values.otherDocument && (
          <Grid.Col span={6}>
            <TextInput
              required
              label="Other Document Remarks"
              placeholder="Enter remarks for the other document"
              {...form.getInputProps("otherDocumentRemarks")}
            />
          </Grid.Col>
        )}
      </Grid>

      <Group justify="flex-end" mt="xl">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
    // </ScrollArea>

  );
};

export default EmployeeForm;
