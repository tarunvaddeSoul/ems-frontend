import React from 'react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

const ViewAttendanceReportInPDF = ({ data }: any) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Employee ID', 'Employee Name', 'Company Name', 'Designation', 'Present Count']],
      body: data.map((item: any) => [
        item.employeeID,
        item.employeeName,
        item.companyName,
        item.designationName,
        item.presentCount
      ]),
    });
    doc.save("attendance_report.pdf");
  };

  return (
    <div>
      <h2>View Attendance Report in PDF</h2>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default ViewAttendanceReportInPDF;