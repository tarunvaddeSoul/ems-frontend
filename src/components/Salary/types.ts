export interface Employee {
    employeeId: string;
    firstName: string;
    lastName: string;
    designation: string;
    salary: number;
  }
  
  export interface Company {
    id: string;
    name: string;
  }
  
  export interface PayslipData {
    employeeId: string;
    companyId: string;
    month: string;
    basicPay: number;
    bonus: number;
    allowance: number;
    grossSalary: number;
    pf: number;
    esic: number;
    advance: number;
    uniform: number;
    penalty: number;
    lwf: number;
    otherDeductions: number;
    totalDeductions: number;
    netSalary: number;
  }