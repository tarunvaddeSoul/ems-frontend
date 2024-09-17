// src/services/api.ts

import axios from 'axios';

const BASE_URL = 'http://localhost:3003';

export interface Employee {}
export interface Designation {}
export interface EmployeeDepartments {}
export interface Company {}

const api = {
  getEmployees: async (searchParams: any) => {
    const response = await axios.get<{ data: { data: Employee[]; total: number } }>
      (`${BASE_URL}/employees`, { params: searchParams });
    return response.data;
  },

  getDesignations: async () => {
    const response = await axios.get<{ data: Designation[] }>(`${BASE_URL}/designation`);
    return response.data;
  },

  getEmployeeDepartments: async () => {
    const response = await axios.get<{ data: EmployeeDepartments[] }>
      (`${BASE_URL}/departments/employee-departments`);
    return response.data;
  },

  getCompanies: async () => {
    const response = await axios.get(`${BASE_URL}/companies`);
    return response.data;
  },

  postAttendanceBulk: async (payload: any) => {
    const response = await axios.post(`${BASE_URL}/attendance/bulk`, payload);
    return response.data;
  },

  uploadAttendance: async (formData: FormData) => {
    const response = await axios.post(`${BASE_URL}/attendance/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;