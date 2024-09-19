import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Tabs,
  Paper,
  Button,
  Stack,
  TextInput,
  Loader,
  Text,
  Grid,
  Select,
  Textarea,
  NumberInput,
  Modal,
  Group,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { DocumentUpload } from "./EditDocument";
import { formatDateToString, parseDateString } from "../utils/date.converter";
import EmploymentHistoryDisplay from "./EmployeeHistoryDisplay";

const API_BASE_URL = "http://localhost:3003/employees";

interface ContactDetails {
  id: string;
  employeeId: string;
  mobileNumber: string;
  aadhaarNumber: string;
  permanentAddress: string;
  presentAddress: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
  createdAt: string;
  updatedAt: string;
}

interface BankDetails {
  id: string;
  employeeId: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;
  bankCity: string;
  createdAt: string;
  updatedAt: string;
}

interface AdditionalDetails {
  id: string;
  employeeId: string;
  pfUanNumber: string;
  esicNumber: string;
  policeVerificationNumber: string;
  policeVerificationDate: string;
  trainingCertificateNumber: string;
  trainingCertificateDate: string;
  medicalCertificateNumber: string;
  medicalCertificateDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ReferenceDetails {
  id: string;
  employeeId: string;
  referenceName: string;
  referenceAddress: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentUploads {
  id: string;
  employeeId: string;
  photo: string;
  aadhaar: string;
  panCard: string;
  bankPassbook: string;
  markSheet: string;
  otherDocument: string;
  otherDocumentRemarks: string;
  createdAt: string;
  updatedAt: string;
}

interface EmploymentHistory {
  id: string;
  employeeId: string;
  companyName: string;
  designationName: string;
  departmentName: string;
  companyId: string;
  designationId: string;
  departmentId: string;
  salary: number;
  joiningDate: string;
  leavingDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeData {
  contactDetails: ContactDetails;
  bankDetails: BankDetails;
  additionalDetails: AdditionalDetails;
  referenceDetails: ReferenceDetails;
  documentUploads: DocumentUploads;
  employmentHistory: EmploymentHistory[];
}
type TabName = keyof EmployeeData;

export function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("contactDetails");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const form = useForm<EmployeeData>({
    initialValues: {
      contactDetails: {} as ContactDetails,
      bankDetails: {} as BankDetails,
      additionalDetails: {} as AdditionalDetails,
      referenceDetails: {} as ReferenceDetails,
      documentUploads: {} as DocumentUploads,
      employmentHistory: [] as EmploymentHistory[],
    },
    validate: {
      contactDetails: {
        mobileNumber: (value) =>
          /^\d{10}$/.test(value) ? null : "Invalid mobile number",
        aadhaarNumber: (value) =>
          /^\d{12}$/.test(value) ? null : "Invalid Aadhaar number",
        pincode: (value) =>
          /^\d{6}$/.test(value.toString()) ? null : "Invalid pincode",
      },
      bankDetails: {
        bankAccountNumber: (value) =>
          /^\d{9,18}$/.test(value) ? null : "Invalid account number",
        ifscCode: (value) =>
          /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? null : "Invalid IFSC code",
      },
      additionalDetails: {
        pfUanNumber: (value) =>
          /^\w{12}$/.test(value) ? null : "Invalid PF UAN number",
        esicNumber: (value) =>
          /^\d{10}$/.test(value) ? null : "Invalid ESIC number",
      },
      referenceDetails: {
        referenceNumber: (value) =>
          /^\d{10}$/.test(value) ? null : "Invalid reference number",
      },
      employmentHistory: {
        salary: (value) => (value > 0 ? null : "Salary must be greater than 0"),
      },
    },
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const [
          contactDetails,
          bankDetails,
          additionalDetails,
          referenceDetails,
          documentUploads,
          employmentHistory,
        ] = await Promise.all([
          axios.get<{ data: ContactDetails }>(
            `${API_BASE_URL}/${id}/contact-details`
          ),
          axios.get<{ data: BankDetails }>(
            `${API_BASE_URL}/${id}/bank-details`
          ),
          axios.get<{ data: AdditionalDetails }>(
            `${API_BASE_URL}/${id}/additional-details`
          ),
          axios.get<{ data: ReferenceDetails }>(
            `${API_BASE_URL}/${id}/reference-details`
          ),
          axios.get<{ data: DocumentUploads }>(
            `${API_BASE_URL}/${id}/document-uploads`
          ),
          axios.get<{ data: EmploymentHistory[] }>(
            `${API_BASE_URL}/${id}/employment-history`
          ),
        ]);

        const data: EmployeeData = {
          contactDetails: contactDetails.data.data,
          bankDetails: bankDetails.data.data,
          additionalDetails: additionalDetails.data.data,
          referenceDetails: referenceDetails.data.data,
          documentUploads: documentUploads.data.data,
          employmentHistory: employmentHistory.data.data,
        };

        setEmployeeData(data);
        form.setValues(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        notifications.show({
          title: "Error",
          message: "Failed to fetch employee data. Please try again.",
          color: "red",
          icon: <IconAlertCircle />,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const handleDocumentChange = (field: string) => (file: File | null) => {
    form.setFieldValue(`documentUploads.${field}`, file);
  };

  const handleDocumentRemove = (field: keyof DocumentUploads) => () => {
    form.setFieldValue(`documentUploads.${field}`, null as any);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      notifications.show({
        title: "Success",
        message: "Employee deleted successfully",
        color: "green",
        icon: <IconCheck />,
      });
      navigate("/employees");
    } catch (error) {
      console.error("Error deleting employee:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete employee. Please try again.",
        color: "red",
        icon: <IconAlertCircle />,
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };
  const kebabCase = (str: string) =>
    str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  function convertToTitleCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before each uppercase letter
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // Handle multiple consecutive uppercase letters
      .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
  }
  const handleTabSubmit = async (tabName: TabName) => {
    setSaving(true);
    try {
      const tabData = form.values[tabName] as any;

      if (tabName === "documentUploads") {
        const formData = new FormData();

        // Append file fields
        const fileFields = [
          "photo",
          "aadhaar",
          "panCard",
          "bankPassbook",
          "markSheet",
          "otherDocument",
        ];
        fileFields.forEach((field) => {
          if (tabData[field] && tabData[field] instanceof File) {
            formData.append(field, tabData[field]);
          }
        });

        // Append other fields
        if (tabData.otherDocumentRemarks) {
          formData.append("otherDocumentRemarks", tabData.otherDocumentRemarks);
        }

        const response = await axios.patch(
          `${API_BASE_URL}/${id}/document-uploads`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (tabName === "employmentHistory") {
        // Handle employment history separately as it's an array
        await axios.patch(
          `${API_BASE_URL}/${id}/${kebabCase(tabName)}`,
          tabData
        );
      } else {
        const { id, employeeId, createdAt, updatedAt, ...filteredObject } =
          tabData as any;
        await axios.patch(
          `${API_BASE_URL}/${employeeId}/${kebabCase(tabName)}`,
          filteredObject
        );
      }

      notifications.show({
        title: "Success",
        message: `${convertToTitleCase(tabName)} updated successfully`,
        color: "green",
        icon: <IconCheck />,
      });
    } catch (error) {
      console.error(`Error updating ${convertToTitleCase(tabName)}:`, error);
      notifications.show({
        title: "Error",
        message: `Failed to update ${convertToTitleCase(
          tabName
        )}. Please try again.`,
        color: "red",
        icon: <IconAlertCircle />,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Container
        size="xl"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="xl" />
      </Container>
    );

  if (!employeeData)
    return (
      <Container size="xl">
        <Text size="xl" fw={700} c="red">
          No employee data found
        </Text>
      </Container>
    );

  return (
    <Container size="xl">
      <Paper shadow="xs" p="md" mb="md">
        <Grid align="center">
          <Grid.Col span={8}>
            <Text size="xl" fw={700}>
              Edit Employee: {employeeData.contactDetails.employeeId}
            </Text>
          </Grid.Col>
          <Grid.Col
            span={4}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button color="red" onClick={() => setDeleteModalOpen(true)}>
              Delete Employee
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>

      <form>
        <Paper shadow="xs" p="md">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List grow>
              <Tabs.Tab value="contactDetails">Contact Details</Tabs.Tab>
              <Tabs.Tab value="bankDetails">Bank Details</Tabs.Tab>
              <Tabs.Tab value="additionalDetails">Additional Details</Tabs.Tab>
              <Tabs.Tab value="referenceDetails">Reference Details</Tabs.Tab>
              <Tabs.Tab value="documentUploads">Document Uploads</Tabs.Tab>
              <Tabs.Tab value="employmentHistory">Employment History</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="contactDetails">
              <Stack mt="md">
                <TextInput
                  label="Mobile Number"
                  {...form.getInputProps("contactDetails.mobileNumber")}
                />
                <TextInput
                  label="Aadhaar Number"
                  {...form.getInputProps("contactDetails.aadhaarNumber")}
                />
                <Textarea
                  label="Permanent Address"
                  {...form.getInputProps("contactDetails.permanentAddress")}
                />
                <Textarea
                  label="Present Address"
                  {...form.getInputProps("contactDetails.presentAddress")}
                />
                <TextInput
                  label="City"
                  {...form.getInputProps("contactDetails.city")}
                />
                <TextInput
                  label="District"
                  {...form.getInputProps("contactDetails.district")}
                />
                <TextInput
                  label="State"
                  {...form.getInputProps("contactDetails.state")}
                />
                <NumberInput
                  label="Pincode"
                  {...form.getInputProps("contactDetails.pincode")}
                />
              </Stack>
              <Divider labelPosition="center" my="lg" />

              <Button
                onClick={() => handleTabSubmit("contactDetails")}
                loading={saving}
              >
                Save Contact Details
              </Button>
            </Tabs.Panel>

            <Tabs.Panel value="bankDetails">
              <Stack mt="md">
                <TextInput
                  label="Bank Account Number"
                  {...form.getInputProps("bankDetails.bankAccountNumber")}
                />
                <TextInput
                  label="IFSC Code"
                  {...form.getInputProps("bankDetails.ifscCode")}
                />
                <TextInput
                  label="Bank Name"
                  {...form.getInputProps("bankDetails.bankName")}
                />
                <TextInput
                  label="Bank City"
                  {...form.getInputProps("bankDetails.bankCity")}
                />
              </Stack>
              <Divider labelPosition="center" my="lg" />

              <Button
                onClick={() => handleTabSubmit("bankDetails")}
                loading={saving}
              >
                Save Bank Details
              </Button>
            </Tabs.Panel>

            <Tabs.Panel value="additionalDetails">
              <Stack mt="md">
                <TextInput
                  label="PF UAN Number"
                  {...form.getInputProps("additionalDetails.pfUanNumber")}
                />
                <TextInput
                  label="ESIC Number"
                  {...form.getInputProps("additionalDetails.esicNumber")}
                />
                <TextInput
                  label="Police Verification Number"
                  {...form.getInputProps(
                    "additionalDetails.policeVerificationNumber"
                  )}
                />

                <TextInput
                  label="Training Certificate Number"
                  {...form.getInputProps(
                    "additionalDetails.trainingCertificateNumber"
                  )}
                />

                <TextInput
                  label="Medical Certificate Number"
                  {...form.getInputProps(
                    "additionalDetails.medicalCertificateNumber"
                  )}
                />
                <DateInput
                  clearable
                  defaultValue={
                    form.values.additionalDetails?.medicalCertificateDate
                      ? parseDateString(
                          form.values.additionalDetails.medicalCertificateDate
                        )
                      : null
                  }
                  label="Medical Certificate Date"
                  placeholder="Select date"
                />

                <DateInput
                  clearable
                  defaultValue={
                    form.values.additionalDetails?.trainingCertificateDate
                      ? parseDateString(
                          form.values.additionalDetails.trainingCertificateDate
                        )
                      : null
                  }
                  label="Training Certificate Date"
                  placeholder="Select date"
                />

                <DateInput
                  clearable
                  defaultValue={
                    form.values.additionalDetails?.policeVerificationDate
                      ? parseDateString(
                          form.values.additionalDetails.policeVerificationDate
                        )
                      : null
                  }
                  label="Police Verification Date"
                  placeholder="Select date"
                />
              </Stack>
              <Divider labelPosition="center" my="lg" />

              <Button
                onClick={() => handleTabSubmit("additionalDetails")}
                loading={saving}
              >
                Save Additional Details
              </Button>
            </Tabs.Panel>

            <Tabs.Panel value="referenceDetails">
              <Stack mt="md">
                <TextInput
                  label="Reference Name"
                  {...form.getInputProps("referenceDetails.referenceName")}
                />
                <Textarea
                  label="Reference Address"
                  {...form.getInputProps("referenceDetails.referenceAddress")}
                />
                <TextInput
                  label="Reference Number"
                  {...form.getInputProps("referenceDetails.referenceNumber")}
                />
              </Stack>
              <Divider labelPosition="center" my="lg" />

              <Button
                onClick={() => handleTabSubmit("referenceDetails")}
                loading={saving}
              >
                Save Reference Details
              </Button>
            </Tabs.Panel>

            <Tabs.Panel value="documentUploads">
              <Stack mt="md">
                <DocumentUpload
                  label="Photo"
                  value={form.values.documentUploads.photo}
                  onChange={handleDocumentChange("photo")}
                  onRemove={handleDocumentRemove("photo")}
                />
                <DocumentUpload
                  label="Aadhaar"
                  value={form.values.documentUploads.aadhaar}
                  onChange={handleDocumentChange("aadhaar")}
                  onRemove={handleDocumentRemove("aadhaar")}
                />
                <DocumentUpload
                  label="PAN Card"
                  value={form.values.documentUploads.panCard}
                  onChange={handleDocumentChange("panCard")}
                  onRemove={handleDocumentRemove("panCard")}
                />
                <DocumentUpload
                  label="Bank Passbook"
                  value={form.values.documentUploads.bankPassbook}
                  onChange={handleDocumentChange("bankPassbook")}
                  onRemove={handleDocumentRemove("bankPassbook")}
                />
                <DocumentUpload
                  label="Mark Sheet"
                  value={form.values.documentUploads.markSheet}
                  onChange={handleDocumentChange("markSheet")}
                  onRemove={handleDocumentRemove("markSheet")}
                />
                <DocumentUpload
                  label="Other Document"
                  value={form.values.documentUploads.otherDocument}
                  onChange={handleDocumentChange("otherDocument")}
                  onRemove={handleDocumentRemove("otherDocument")}
                />
                <Textarea
                  label="Other Document Remarks"
                  {...form.getInputProps(
                    "documentUploads.otherDocumentRemarks"
                  )}
                />
              </Stack>
              <Divider labelPosition="center" my="lg" />

              <Button
                onClick={() => handleTabSubmit("documentUploads")}
                loading={saving}
              >
                Save Documents
              </Button>
            </Tabs.Panel>
            <Tabs.Panel value="employmentHistory">
              <EmploymentHistoryDisplay
                initialValues={form.values.employmentHistory}
              />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </form>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <Text>
          Are you sure you want to delete this employee? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

const EmploymentHistoryForm = ({ index, form }: any) => (
  <Stack mt="md">
    <TextInput
      label="Company Name"
      {...form.getInputProps(`employmentHistory.${index}.companyName`)}
    />
    <TextInput
      label="Designation Name"
      {...form.getInputProps(`employmentHistory.${index}.designationName`)}
    />
    <TextInput
      label="Department Name"
      {...form.getInputProps(`employmentHistory.${index}.departmentName`)}
    />
    <NumberInput
      label="Salary"
      {...form.getInputProps(`employmentHistory.${index}.salary`)}
    />
    <DateInput
      clearable
      label="Joining Date"
      placeholder="Select date"
      value={parseDateString(form.values.employmentHistory[index].joiningDate)}
      onChange={(date) => {
        form.setFieldValue(
          `employmentHistory.${index}.joiningDate`,
          formatDateToString(date)
        );
      }}
    />

    <DateInput
      clearable
      label="Leaving Date"
      placeholder="Select date"
      value={parseDateString(form.values.employmentHistory[index].leavingDate)}
      onChange={(date) => {
        form.setFieldValue(
          `employmentHistory.${index}.leavingDate`,
          formatDateToString(date)
        );
      }}
    />
    <Select
      label="Status"
      data={[
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
      ]}
      {...form.getInputProps(`employmentHistory.${index}.status`)}
    />
  </Stack>
);
