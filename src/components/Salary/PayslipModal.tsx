import React from 'react';
import { Modal } from '@mantine/core';
import { Document, Page, View, Text as PDFText, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { PayslipData, Employee, Company } from './types';

interface PayslipModalProps {
  opened: boolean;
  onClose: () => void;
  payslip: any | null;
  employees: Employee[];
  companies: Company[];
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ opened, onClose, payslip, employees, companies }) => {
  const findEmployee = (employeeId: string) => employees.find((e) => e.employeeId === employeeId);
  const findCompany = (companyId: string) => companies.find((c) => c.id === companyId);

  const PayslipPDF = () => {
    if (!payslip) return null;

    const employee = findEmployee(payslip.employeeId);
    const company = findCompany(payslip.companyId);

    if (!employee || !company) return null;

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <PDFText style={styles.title}>Employee Payslip</PDFText>
            <PDFText style={styles.subtitle}>{company.name}</PDFText>
            <PDFText style={styles.text}>
              Employee: {employee.firstName} {employee.lastName}
            </PDFText>
            <PDFText style={styles.text}>Employee ID: {employee.employeeId}</PDFText>
            <PDFText style={styles.text}>Month: {payslip.month}</PDFText>
          </View>
          <View style={styles.section}>
            <PDFText style={styles.sectionTitle}>Earnings</PDFText>
            <PDFText style={styles.text}>Basic Pay: ₹{payslip.basicPay.toFixed(2)}</PDFText>
            <PDFText style={styles.text}>Bonus: ₹{payslip.bonus.toFixed(2)}</PDFText>
            <PDFText style={styles.text}>Allowance: ₹{payslip.allowance.toFixed(2)}</PDFText>
            <PDFText style={styles.text}>Gross Salary: ₹{payslip.grossSalary.toFixed(2)}</PDFText>
          </View>
          <View style={styles.section}>
            <PDFText style={styles.sectionTitle}>Deductions</PDFText>
            <PDFText style={styles.text}>PF: ₹{payslip.pf.toFixed(2)}</PDFText>
            <PDFText style={styles.text}>ESIC: ₹{payslip.esic.toFixed(2)}</PDFText>
            <PDFText style={styles.text}>Advance: ₹{payslip.advance.toFixed(2)}</PDFText>
            <PDFText style={styles.text}>Uniform: ₹{payslip.uniform.toFixed(2)}</PDFText>
            <PDFText style={styles.text}>Penalty: ₹{payslip.penalty.toFixed(2)}</PDFText>
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
  };

  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    title: { fontSize: 24, marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
    sectionTitle: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
    text: { fontSize: 12, marginBottom: 3 },
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Employee Payslip" size="xl">
      {payslip && <PDFViewer width="100%" height={500}><PayslipPDF /></PDFViewer>}
    </Modal>
  );
};