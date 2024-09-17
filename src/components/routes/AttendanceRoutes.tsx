import { Route, Routes } from "react-router-dom";
import MarkAttendanceBySite from "../Attendance/MarkAttendanceBySite";
import UploadAttendance from "../Attendance/UploadAttendance";
import AttendanceReports from "../Attendance/AttendanceReports";

const AttendanceRoutes = () => (
  <Routes>
    <Route path="mark" element={<MarkAttendanceBySite />} />
    <Route path="upload" element={<UploadAttendance />} />
    <Route path="reports" element={<AttendanceReports />} />
  </Routes>
);

export default AttendanceRoutes;