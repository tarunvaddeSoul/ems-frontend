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
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useLocalStorage } from "@mantine/hooks";

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
  presentCount: number;
}

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3003";

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
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [monthLoading, setMonthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportType, setReportType] = useState<"pdf" | "excel">("pdf");
  const fetchCompanies = useCallback(async () => {
    setCompanyLoading(true);
    setErrorMessage("");
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
      setErrorMessage(
        "Failed to fetch companies. Please check your internet connection and try again."
      );
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (selectedCompany) {
      fetchAttendanceMonths(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchAttendanceMonths = useCallback(async (companyId: string) => {
    setMonthLoading(true);
    setErrorMessage("");
    setMonths([]);
    setSelectedMonth(null);

    try {
      const response = await axios.get<{ data: AttendanceRecord[] }>(
        `${API_BASE_URL}/attendance/${companyId}`
      );
      const attendanceRecords = response.data.data;

      if (attendanceRecords.length === 0) {
        setErrorMessage(
          "No attendance records found for this company. Please select a different company or contact support."
        );
      } else {
        const uniqueMonths = Array.from(
          new Set(attendanceRecords.map((record) => record.month))
        );
        const formattedMonths: ComboboxItem[] = uniqueMonths.map((month) => ({
          value: month,
          label: formatMonthLabel(month),
        }));
        setMonths(formattedMonths);
      }
    } catch (error) {
      console.error("Error fetching attendance months:", error);
      setErrorMessage(
        "Failed to fetch attendance months. Please try again or contact support if the problem persists."
      );
    } finally {
      setMonthLoading(false);
    }
  }, []);

  const formatMonthLabel = (monthString: string): string => {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };
  const handleGenerateReport = (type: "pdf" | "excel") => {
    setConfirmModalOpen(true);
    // Store the report type to use in the confirmation
    setReportType(type);
  };

  const confirmGenerateReport = () => {
    setConfirmModalOpen(false);
    if (reportType === "pdf") {
      generatePDF();
    } else {
      generateExcel();
    }
  };

  const fetchAttendanceData = useCallback(async () => {
    if (!selectedCompany || !selectedMonth) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get<{ data: AttendanceData[] }>(
        `${API_BASE_URL}/attendance/records-by-company-and-month`,
        {
          params: { companyId: selectedCompany, month: selectedMonth },
        }
      );
      setAttendanceData(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setErrorMessage("Failed to fetch attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCompany, selectedMonth]);

  const handleNext = () => {
    if (active === 0 && selectedCompany) {
      setActive(1);
    } else if (active === 1 && selectedMonth) {
      fetchAttendanceData();
      setActive(2);
    }
  };

  const handleMonthChange = (value: string | null) => {
    setSelectedMonth(value);
  };

  const handleCompanyChange = (value: string | null) => {
    setSelectedCompany(value);
    setMonths([]);
    setSelectedMonth(null);
    if (value) {
      fetchAttendanceMonths(value);
    }
  };

  const handleBack = () => {
    setActive((prevActive) => prevActive - 1);
  };

  const generatePDF = () => {
    setReportProgress(0);
    const totalSteps = attendanceData.length + 2; // +2 for initialization and saving
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
          "Present Count",
        ],
      ],
      body: attendanceData.map((item, index) => {
        currentStep++;
        setReportProgress((currentStep / totalSteps) * 100);
        return [
          item.employeeID,
          item.employeeName,
          item.companyName,
          item.designationName,
          item.presentCount,
        ];
      }),
    });

    doc.save(`attendance_report_${companies[0].label}_${months[0].label}.pdf`);
    setReportProgress(100);
  };
  const canProceed = () => {
    if (active === 0) {
      return !!selectedCompany;
    } else if (active === 1) {
      return !!selectedMonth;
    }
    return false;
  };
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance_report_${companies[0].label}_${months[0].label}.xlsx`);
  };

  const previewData = () => {
    setPreviewModalOpen(true);
  };

  return (
    <Container size="xl" py="xl">
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
              error={errorMessage && active === 0 ? errorMessage : null}
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
              error={errorMessage && active === 1 ? errorMessage : null}
            />
            {monthLoading && <Loader size="sm" mt="xs" />}
          </Stepper.Step>
          <Stepper.Step
            label="Generate Report"
            description="Choose report format"
          >
            <Group>
              <Button onClick={previewData}>Preview Data</Button>
              <Button onClick={() => handleGenerateReport("pdf")}>
                Generate PDF
              </Button>
              <Button onClick={() => handleGenerateReport("excel")}>
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

        {errorMessage && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            mt="xl"
          >
            {errorMessage}
          </Alert>
        )}

        <Modal
          opened={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          title="Data Preview"
          size="xl"
        >
          {attendanceData.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Company Name</th>
                  <th>Designation</th>
                  <th>Present Count</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.employeeID}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.companyName}</td>
                    <td>{item.designationName}</td>
                    <td>{item.presentCount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
          <Progress.Root size="xl">
            <Progress.Section value={35} color="cyan">
              <Progress.Label>{`${Math.round(
                reportProgress
              )}%`}</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        )}

        {reportProgress === 100 && (
          <Alert
            icon={<IconCheck size="1rem" />}
            title="Success"
            color="green"
            mt="xl"
          >
            Report generated successfully!
          </Alert>
        )}
      </Paper>
    </Container>
  );
};
export default AttendanceReports;
