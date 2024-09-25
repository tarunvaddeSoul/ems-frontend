import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Stepper,
  Select,
  Button,
  Text,
  Loader,
  Alert,
  Group,
  Modal,
  Table,
  Paper,
  LoadingOverlay,
  Title,
  ComboboxItem,
  Progress,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconDownload,
  IconEye,
  IconX,
} from "@tabler/icons-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// Types
interface Company {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  month: string;
  presentCount: number;
  companyId: string;
}

interface AttendanceData {
  employeeID: string;
  employeeName: string;
  companyName: string;
  designationName: string;
  departmentName: string;
  presentCount: number;
  attendanceSheetUrl: string;
}

// Constants
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3003";

// Utility functions
const formatMonthLabel = (monthString: string): string => {
  const [year, month] = monthString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

// Custom hooks
const useAttendanceData = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendanceData = useCallback(
    async (companyId: string, month: string) => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<{ data: AttendanceData[] }>(
          `${API_BASE_URL}/attendance/records-by-company-and-month`,
          { params: { companyId, month } }
        );
        setAttendanceData(response.data.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to fetch attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { attendanceData, loading, error, fetchAttendanceData };
};

// Components
const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Alert
    icon={<IconAlertCircle size="1rem" />}
    title="Error"
    color="red"
    mt="xl"
  >
    {message}
  </Alert>
);

const SuccessAlert: React.FC<{ message: string }> = ({ message }) => (
  <Alert icon={<IconCheck size="1rem" />} title="Success" color="green" mt="xl">
    {message}
  </Alert>
);

const AttendanceTable: React.FC<{ data: AttendanceData[] }> = ({ data }) => (
  <Table>
    <thead>
      <tr>
        <th>Employee ID</th>
        <th>Employee Name</th>
        <th>Company Name</th>
        <th>Designation</th>
        <th>Department</th>
        <th>Present Count</th>
        <th>Attendance Sheet</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.employeeID}</td>
          <td>{item.employeeName}</td>
          <td>{item.companyName}</td>
          <td>{item.designationName}</td>
          <td>{item.departmentName}</td>
          <td>{item.presentCount}</td>
          <td>
            <Button
              component="a"
              href={item.attendanceSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              variant="outline"
              leftSection={<IconDownload size="1rem" />}
            >
              Download
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const AttendanceReports: React.FC = () => {
  const [active, setActive] = useState(0);
  const [companies, setCompanies] = useState<ComboboxItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useLocalStorage<string | null>({
    key: "selectedCompany",
    defaultValue: null,
  });
  const [months, setMonths] = useState<ComboboxItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useLocalStorage<string | null>({
    key: "selectedMonth",
    defaultValue: null,
  });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [monthLoading, setMonthLoading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportType, setReportType] = useState<"pdf" | "excel">("pdf");

  const { attendanceData, loading, error, fetchAttendanceData } =
    useAttendanceData();

  const fetchCompanies = useCallback(async () => {
    setCompanyLoading(true);
    try {
      const response = await axios.get<{ data: { companies: Company[] } }>(
        `${API_BASE_URL}/companies`
      );
      setCompanies(
        response.data.data.companies.map((company) => ({
          value: company.id,
          label: company.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  const fetchAttendanceMonths = useCallback(async (companyId: string) => {
    setMonthLoading(true);
    setMonths([]);
    setSelectedMonth(null);

    try {
      const response = await axios.get<{ data: AttendanceRecord[] }>(
        `${API_BASE_URL}/attendance/${companyId}`
      );
      const attendanceRecords = response.data.data;

      if (attendanceRecords.length === 0) {
        throw new Error("No attendance records found for this company.");
      }

      const uniqueMonths = Array.from(
        new Set(attendanceRecords.map((record) => record.month))
      );
      const formattedMonths: ComboboxItem[] = uniqueMonths.map((month) => ({
        value: month,
        label: formatMonthLabel(month),
      }));
      setMonths(formattedMonths);
    } catch (error: any) {
      console.error("Error fetching attendance months:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message ?  error.response?.data?.message : "Error in fetching attendance months",
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setMonthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (selectedCompany) {
      fetchAttendanceMonths(selectedCompany);
    }
  }, [selectedCompany, fetchAttendanceMonths]);

  const handleNext = () => {
    if (active === 0 && selectedCompany) {
      setActive(1);
    } else if (active === 1 && selectedMonth) {
      fetchAttendanceData(selectedCompany as any, selectedMonth);
      setActive(2);
    }
  };

  const handleBack = () => setActive((prevActive) => prevActive - 1);

  const handleCompanyChange = (value: string | null) => {
    setSelectedCompany(value);
    setMonths([]);
    setSelectedMonth(null);
    if (value) {
      fetchAttendanceMonths(value);
    }
  };

  const handleMonthChange = (value: string | null) => setSelectedMonth(value);

  const handleGenerateReport = (type: "pdf" | "excel") => {
    setConfirmModalOpen(true);
    setReportType(type);
  };

  const confirmGenerateReport = () => {
    setConfirmModalOpen(false);
    setReportProgress(0);

    if (reportType === "pdf") {
      generatePDF();
    } else {
      generateExcel();
    }
  };

  const generatePDF = () => {
    const totalSteps = attendanceData.length + 2;
    let currentStep = 0;

    const doc = new jsPDF();

    currentStep++;
    setReportProgress((currentStep / totalSteps) * 100);

    autoTable(doc, {
      head: [
        [
          "Employee ID",
          "Employee Name",
          "Company Name",
          "Designation",
          "Department",
          "Present Count",
        ],
      ],
      body: attendanceData.map((item) => {
        currentStep++;
        setReportProgress((currentStep / totalSteps) * 100);
        return [
          item.employeeID,
          item.employeeName,
          item.companyName,
          item.designationName,
          item.departmentName,
          item.presentCount,
        ];
      }),
    });

    doc.save(`attendance_report_${selectedCompany}_${selectedMonth}.pdf`);
    setReportProgress(100);
  };

  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(
      workbook,
      `attendance_report_${selectedCompany}_${selectedMonth}.xlsx`
    );
    setReportProgress(100);
  };

  const canProceed = () => {
    if (active === 0) return !!selectedCompany;
    if (active === 1) return !!selectedMonth;
    return false;
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" withBorder>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Title order={2} mb="lg">
          Attendance Reports
        </Title>

        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Select Company" description="Choose a company">
            <Select
              label="Select Company"
              placeholder="Choose a company"
              data={companies}
              value={selectedCompany}
              onChange={handleCompanyChange}
              required
              disabled={companyLoading}
            />
            {companyLoading && <Loader size="sm" mt="xs" />}
          </Stepper.Step>

          <Stepper.Step label="Select Month" description="Choose a month">
            <Select
              label="Select Month"
              placeholder="Choose a month"
              data={months}
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={months.length === 0 || monthLoading}
              required
            />
            {monthLoading && <Loader size="sm" mt="xs" />}
          </Stepper.Step>

          <Stepper.Step
            label="Generate Report"
            description="Choose report format"
          >
            <Group justify="center">
              <Button
                leftSection={<IconEye size="1rem" />}
                onClick={() => setPreviewModalOpen(true)}
              >
                Preview Data
              </Button>
              <Button
                leftSection={<IconDownload size="1rem" />}
                onClick={() => handleGenerateReport("pdf")}
              >
                Generate PDF
              </Button>
              <Button
                leftSection={<IconDownload size="1rem" />}
                onClick={() => handleGenerateReport("excel")}
              >
                Generate Excel
              </Button>
            </Group>
          </Stepper.Step>
        </Stepper>

        <Group mt="xl">
          {active > 0 && (
            <Button variant="default" onClick={handleBack}>
              Back
            </Button>
          )}
          {active < 2 && (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next step
            </Button>
          )}
        </Group>

        {error && <ErrorAlert message={error} />}

        <Modal
          opened={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          title="Data Preview"
          size="xl"
        >
          {attendanceData.length > 0 ? (
            <AttendanceTable data={attendanceData} />
          ) : (
            <Text>No data available for the selected company and month.</Text>
          )}
        </Modal>

        <Modal
          opened={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title="Confirm Report Generation"
        >
          <Text>Are you sure you want to generate the report?</Text>
          <Group mt="md">
            <Button onClick={confirmGenerateReport}>
              Yes, generate report
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmModalOpen(false)}
            >
              Cancel
            </Button>
          </Group>
        </Modal>

        {reportProgress > 0 && reportProgress < 100 && (
          <Progress
            value={reportProgress}
            size="xl"
            mt="md"
            transitionDuration={200}
          />
        )}

        {reportProgress === 100 && (
          <SuccessAlert message="Report generated successfully!" />
        )}
      </Paper>
    </Container>
  );
};

export default AttendanceReports;
