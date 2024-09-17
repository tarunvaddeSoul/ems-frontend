import React from 'react';
import * as XLSX from 'xlsx';

const ViewAttendanceReportInExcel = ({ data }: any) => {
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_report.xlsx");
  };

  return (
    <div>
      <h2>View Attendance Report in Excel</h2>
      <button onClick={generateExcel}>Generate Excel</button>
    </div>
  );
};

export default ViewAttendanceReportInExcel;