import React from "react";
import { Modal } from "@mantine/core";
import {
  Document,
  Page,
  View,
  Text as PDFText,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { PayslipData, Employee, Company } from "./types";

interface PayslipModalProps {
  opened: boolean;
  onClose: () => void;
  payslip: PayslipData | null;
  employees: Employee[];
  companies: Company[];
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  opened,
  onClose,
  payslip,
  employees,
  companies,
}) => {
  const findEmployee = (employeeId: string) =>
    employees.find((e) => e.employeeId === employeeId);
  const findCompany = (companyId: string) =>
    companies.find((c) => c.id === companyId);

    const formatCurrency = (amount: number) => {
      return `₹ ${amount.toFixed(2)}`;
    };
    
    

  const PayslipPDF = () => {
    if (!payslip) return null;

    const employee = findEmployee(payslip.employeeId);
    const company = findCompany(payslip.companyId);

    if (!employee || !company) return null;

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                src="logo512.png"
                style={styles.logo}
              />
            </View>
            <View style={styles.companyInfo}>
              <PDFText style={styles.companyName}>{company.name}</PDFText>
              <PDFText style={styles.companyAddress}>123 Company Street, City, Country</PDFText>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <PDFText style={styles.title}>PAYSLIP</PDFText>
            <PDFText style={styles.subtitle}>For the month of {payslip.month}</PDFText>
          </View>

          {/* Employee Information */}
          <View style={styles.employeeInfo}>
            <View style={styles.infoColumn}>
              <PDFText style={styles.label}>Employee Name:</PDFText>
              <PDFText style={styles.value}>{`${employee.firstName} ${employee.lastName}`}</PDFText>
              <PDFText style={styles.label}>Employee ID:</PDFText>
              <PDFText style={styles.value}>{employee.employeeId}</PDFText>
            </View>
            <View style={styles.infoColumn}>
              <PDFText style={styles.label}>Department:</PDFText>
              <PDFText style={styles.value}>Engineering</PDFText>
              <PDFText style={styles.label}>Pay Period:</PDFText>
              <PDFText style={styles.value}>{`01 ${payslip.month} - 30 ${payslip.month}`}</PDFText>
            </View>
          </View>

          {/* Salary Details */}
          <View style={styles.salaryDetails}>
            <View style={styles.column}>
              <PDFText style={styles.sectionTitle}>Earnings</PDFText>
              <View style={styles.row}>
                <PDFText style={styles.label}>Basic Pay</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.basicPay)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>Bonus</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.bonus)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>Allowance</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.allowance)}</PDFText>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <PDFText style={styles.label}>Gross Salary</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.grossSalary)}</PDFText>
              </View>
            </View>

            <View style={styles.column}>
              <PDFText style={styles.sectionTitle}>Deductions</PDFText>
              <View style={styles.row}>
                <PDFText style={styles.label}>PF</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.pf)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>ESIC</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.esic)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>Advance</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.advance)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>Uniform</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.uniform)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>Penalty</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.penalty)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>LWF</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.lwf)}</PDFText>
              </View>
              <View style={styles.row}>
                <PDFText style={styles.label}>Other Deductions</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.otherDeductions)}</PDFText>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <PDFText style={styles.label}>Total Deductions</PDFText>
                <PDFText style={styles.value}>{formatCurrency(payslip.totalDeductions)}</PDFText>
              </View>
            </View>
          </View>

          {/* Net Salary */}
          <View style={styles.netSalary}>
            <PDFText style={styles.netSalaryLabel}>Net Salary</PDFText>
            <PDFText style={styles.netSalaryValue}>{formatCurrency(payslip.netSalary)}</PDFText>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <PDFText style={styles.footerText}>This is a computer-generated document. No signature is required.</PDFText>
          </View>
        </Page>
      </Document>
    );
  };

  const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#007bff', paddingBottom: 10 },
    logoContainer: { width: 100, height: 50, marginRight: 20 },
    logo: { width: '100%', height: '100%' },
    companyInfo: { flex: 1 },
    companyName: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
    companyAddress: { fontSize: 10, color: '#666' },
    titleContainer: { alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#007bff' },
    subtitle: { fontSize: 14, color: '#666' },
    employeeInfo: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 },
    infoColumn: { flex: 1 },
    label: { fontSize: 10, color: '#666', marginBottom: 2 },
    value: { fontSize: 12, marginBottom: 5 },
    salaryDetails: { flexDirection: 'row', marginBottom: 20 },
    column: { flex: 1, marginRight: 10 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#007bff', borderBottomWidth: 1, borderBottomColor: '#007bff', paddingBottom: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    totalRow: { borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 5, marginTop: 5 },
    netSalary: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    netSalaryLabel: { fontSize: 16, fontWeight: 'bold', color: 'white' },
    netSalaryValue: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    footer: { position: 'absolute', bottom: 30, left: 30, right: 30, borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 10 },
    footerText: { fontSize: 8, color: '#666', textAlign: 'center' },
  });

  return (
    <Modal opened={opened} onClose={onClose} size="90%" title={null} centered>
      {payslip && (
        <PDFViewer width="100%" height={700}>
          <PayslipPDF />
        </PDFViewer>
      )}
    </Modal>
  );
};