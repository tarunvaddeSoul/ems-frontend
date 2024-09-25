import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import {
  IconCalculator,
  IconSearch,
  IconCheck,
  IconX,
  IconFileText,
  IconFileSpreadsheet,
  IconDownload,
} from "@tabler/icons-react";
import {
  Select,
  Table,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Group,
  Card,
  Text,
  Loader,
  ActionIcon,
  Tooltip,
  Divider,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text as PDFText,
  StyleSheet,
} from "@react-pdf/renderer";
import { CSVLink } from "react-csv";
import { PayslipModal } from "./PayslipModal";

const API_BASE_URL = "http://localhost:3003";

const fetchCompanies = async () => {
  const response = await axios.get(`${API_BASE_URL}/companies`);
  return response.data.data.companies;
};

const fetchEmployees = async ({ queryKey }) => {
  const [_, companyId] = queryKey;
  if (!companyId) return [];
  const response = await axios.get(
    `${API_BASE_URL}/companies/${companyId}/employees`
  );
  return response.data.data || [];
};

const calculateSalary = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/salary/calculate`, data);
  return response.data.data;
};

const PayrollManagementSystem = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [calculatedSalaries, setCalculatedSalaries] = useState({});
  const [calculationModalOpen, setCalculationModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [currentPayslip, setCurrentPayslip] = useState(null);

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery(
    ["companies"],
    fetchCompanies
  );
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery(
    ["employees", selectedCompany],
    fetchEmployees,
    { enabled: !!selectedCompany }
  );

  const form = useForm({
    initialValues: {
      dutyDone: 0,
      advance: 0,
      uniform: 0,
      penalty: 0,
      otherDeductions: 0,
      otherDeductionsRemark: "",
      allowance: 0,
      allowanceRemark: "",
    },
    validate: {
      dutyDone: (value) =>
        value < 0 || value > 31 ? "Must be between 0 and 31" : null,
      advance: (value) => (value < 0 ? "Must not be less than 0" : null),
      uniform: (value) => (value < 0 ? "Must not be less than 0" : null),
      penalty: (value) => (value < 0 ? "Must not be less than 0" : null),
      otherDeductions: (value) =>
        value < 0 ? "Must not be less than 0" : null,
      allowance: (value) => (value < 0 ? "Must not be less than 0" : null),
    },
  });

  const calculateSalaryMutation = useMutation(calculateSalary, {
    onSuccess: (data) => {
      setCalculatedSalaries((prev) => ({
        ...prev,
        [data.employeeId]: data,
      }));
      setCurrentPayslip(data);
      setPdfModalOpen(true);
      notifications.show({
        title: "Success",
        message: `Salary calculated for ${currentEmployee.firstName} ${currentEmployee.lastName}`,
        color: "green",
      });
      setCalculationModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessages = error?.response?.data?.message || [
        "An error occurred",
      ];
      errorMessages.forEach((message) => {
        notifications.show({
          title: "Error",
          message,
          color: "red",
        });
      });
    },
  });

  const handleViewPayslip = (employee) => {
    setCurrentPayslip(calculatedSalaries[employee.employeeId]);
    setPdfModalOpen(true);
  };

  const generateCSVData = (employees) => {
    return employees.map((employee) => ({
      "Employee ID": employee.employeeId,
      Name: `${employee.firstName} ${employee.lastName}`,
      Designation: employee.designation,
      "Base Salary": employee.salary,
      "Calculated Salary":
        calculatedSalaries[employee.employeeId]?.netSalary || "-",
      // Add more fields as needed
    }));
  };

  const handleCalculateSalary = (employee) => {
    setCurrentEmployee(employee);
    setCalculationModalOpen(true);
  };

  const handleSalaryCalculation = (values) => {
    if (!selectedCompany || !selectedMonth) {
      notifications.show({
        title: "Error",
        message: "Please select a company and month",
        color: "red",
      });
      return;
    }
    const formattedMonth = dayjs(selectedMonth).format("MM-YYYY");

    calculateSalaryMutation.mutate({
      ...values,
      companyId: selectedCompany,
      month: formattedMonth,
      employeeId: currentEmployee.employeeId,
    });
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "employeeId", label: "Employee ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "designation", label: "Designation" },
    { key: "salary", label: "Base Salary" },
    { key: "calculatedSalary", label: "Calculated Salary" },
    { key: "actions", label: "Actions" },
  ];

  const rows = filteredEmployees.map((employee) => (
    <Table.Tr key={employee.employeeId}>
      <Table.Td>{employee.employeeId}</Table.Td>
      <Table.Td>{employee.firstName}</Table.Td>
      <Table.Td>{employee.lastName}</Table.Td>
      <Table.Td>{employee.designation}</Table.Td>
      <Table.Td>₹{employee.salary.toFixed(2)}</Table.Td>
      <Table.Td>
        {calculatedSalaries[employee.employeeId]?.netSalary
          ? `₹${calculatedSalaries[employee.employeeId].netSalary.toFixed(2)}`
          : "-"}
      </Table.Td>
      <Table.Td>
        <Group gap={5}>
          <Tooltip label="Calculate Salary">
            <ActionIcon
              color="blue"
              onClick={() => handleCalculateSalary(employee)}
              disabled={!selectedMonth}
            >
              <IconCalculator size={18} />
            </ActionIcon>
          </Tooltip>
          {calculatedSalaries[employee.employeeId] && (
            <>
              <Tooltip label="View Payslip">
                <ActionIcon
                  color="green"
                  onClick={() => handleViewPayslip(employee)}
                >
                  <IconFileText size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Download CSV">
                <CSVLink
                  data={generateCSVData([employee])}
                  filename={`${employee.firstName}_${employee.lastName}_payslip.csv`}
                >
                  <ActionIcon color="orange">
                    <IconFileSpreadsheet size={18} />
                  </ActionIcon>
                </CSVLink>
              </Tooltip>
            </>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const PayslipPDF = ({ payslip, employee, company }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <PDFText style={styles.title}>Employee Payslip</PDFText>
          <PDFText style={styles.subtitle}>{company.name}</PDFText>
          <PDFText style={styles.text}>
            Employee: {employee.firstName} {employee.lastName}
          </PDFText>
          <PDFText style={styles.text}>
            Employee ID: {employee.employeeId}
          </PDFText>
          <PDFText style={styles.text}>Month: {payslip.month}</PDFText>
        </View>
        <View style={styles.section}>
          <PDFText style={styles.sectionTitle}>Earnings</PDFText>
          <PDFText style={styles.text}>
            Basic Pay: ₹{payslip.basicPay.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>
            Bonus: ₹{payslip.bonus.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>
            Allowance: ₹{payslip.allowance.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>
            Gross Salary: ₹{payslip.grossSalary.toFixed(2)}
          </PDFText>
        </View>
        <View style={styles.section}>
          <PDFText style={styles.sectionTitle}>Deductions</PDFText>
          <PDFText style={styles.text}>PF: ₹{payslip.pf.toFixed(2)}</PDFText>
          <PDFText style={styles.text}>
            ESIC: ₹{payslip.esic.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>
            Advance: ₹{payslip.advance.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>
            Uniform: ₹{payslip.uniform.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>
            Penalty: ₹{payslip.penalty.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>LWF: ₹{payslip.lwf.toFixed(2)}</PDFText>
          <PDFText style={styles.text}>
            Other Deductions: ₹{payslip.otherDeductions.toFixed(2)}
          </PDFText>
          <PDFText style={styles.text}>
            Total Deductions: ₹{payslip.totalDeductions.toFixed(2)}
          </PDFText>
        </View>
        <View style={styles.section}>
          <PDFText style={styles.sectionTitle}>Net Salary</PDFText>
          <PDFText style={styles.text}>
            Net Salary: ₹{payslip.netSalary.toFixed(2)}
          </PDFText>
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    title: { fontSize: 24, marginBottom: 10, textAlign: "center" },
    subtitle: { fontSize: 18, marginBottom: 10, textAlign: "center" },
    sectionTitle: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
    text: { fontSize: 12, marginBottom: 3 },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group gap="apart">
            <Text fw={500} size="lg">
              Payroll Management System
            </Text>
          </Group>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="xs">
          <Group grow>
            <Select
              label="Select Company"
              placeholder="Choose a company"
              data={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
              value={selectedCompany}
              onChange={setSelectedCompany}
              searchable
              clearable
              disabled={isLoadingCompanies}
            />

            <MonthPickerInput
              className="w-1/3"
              valueFormat="MM-YYYY"
              placeholder="Pick month"
              label="Pick month"
              value={selectedMonth}
              onChange={setSelectedMonth}
            />
          </Group>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="xs">
          <TextInput
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            leftSection={<IconSearch size={14} />}
          />
        </Card.Section>

        <Card.Section>
          {isLoadingEmployees ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    {columns.map((column) => (
                      <Table.Th key={column.key}>{column.label}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
              {filteredEmployees.length > 0 && (
                <Group align="right" mt="md">
                  <CSVLink
                    data={generateCSVData(filteredEmployees)}
                    filename={`all_employees_payslip.csv`}
                  >
                    <Button leftSection={<IconDownload size={14} />}>
                      Download All as CSV
                    </Button>
                  </CSVLink>
                </Group>
              )}
            </>
          )}
        </Card.Section>
      </Card>

      <Modal
        opened={calculationModalOpen}
        onClose={() => setCalculationModalOpen(false)}
        title={`Calculate Salary for ${currentEmployee?.firstName} ${currentEmployee?.lastName}`}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSalaryCalculation)}>
          <Group grow>
            <NumberInput
              label="Duty Days"
              {...form.getInputProps("dutyDone")}
              min={0}
              max={31}
              required
            />
            <NumberInput
              label="Advance"
              {...form.getInputProps("advance")}
              min={0}
              leftSection={<Text size="xs">₹</Text>}
            />
          </Group>
          <Group grow mt="sm">
            <NumberInput
              label="Uniform"
              {...form.getInputProps("uniform")}
              min={0}
              leftSection={<Text size="xs">₹</Text>}
            />
            <NumberInput
              label="Penalty"
              {...form.getInputProps("penalty")}
              min={0}
              leftSection={<Text size="xs">₹</Text>}
            />
          </Group>
          <Group grow mt="sm">
            <NumberInput
              label="Other Deductions"
              {...form.getInputProps("otherDeductions")}
              min={0}
              leftSection={<Text size="xs">₹</Text>}
            />
            <TextInput
              label="Other Deductions Remark"
              {...form.getInputProps("otherDeductionsRemark")}
            />
          </Group>
          <Group grow mt="sm">
            <NumberInput
              label="Allowance"
              {...form.getInputProps("allowance")}
              min={0}
              leftSection={<Text size="xs">₹</Text>}
            />
            <TextInput
              label="Allowance Remark"
              {...form.getInputProps("allowanceRemark")}
            />
          </Group>
          <Group align="right" mt="xl">
            <Button
              variant="outline"
              onClick={() => setCalculationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={calculateSalaryMutation.isLoading}>
              Calculate
            </Button>
          </Group>
        </form>
      </Modal>
      {/* <Modal
        opened={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title="Employee Payslip"
        size="xl"
      >
        {currentPayslip && (
          <PDFViewer width="100%" height={500}>
            <PayslipPDF
              payslip={currentPayslip}
              employee={employees.find(
                (e) => e.employeeId === currentPayslip.employeeId
              )}
              company={companies.find((c) => c.id === currentPayslip.companyId)}
            />
          </PDFViewer>
        )}
      </Modal> */}
      <PayslipModal
        opened={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        payslip={
          currentPayslip && (
            <PDFViewer width="100%" height={500}>
              <PayslipPDF
                payslip={currentPayslip}
                employee={employees.find(
                  (e) => e.employeeId === currentPayslip.employeeId
                )}
                company={companies.find(
                  (c) => c.id === currentPayslip.companyId
                )}
              />
            </PDFViewer>
          )
        }
        employees={employees}
        companies={companies}
      />
    </div>
  );
};

export default PayrollManagementSystem;
