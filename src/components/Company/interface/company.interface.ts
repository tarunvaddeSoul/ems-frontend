export interface Company {
  // data(data: any): unknown;
  id?: string;
  name: string;
  address: string;
  contactPersonName: string;
  contactPersonNumber: string;
  salaryTemplate: {
    [key: string]: {
      enabled: boolean;
      value: string | number;
    };
  };
}
export interface SalaryTemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'special';
  required?: boolean;
  options?: string[];
}


export enum BasicDuty {
  D26 = "26 days",
  D27 = "27 days",
  D28 = "28 days",
  D29 = "29 days",
  D30 = "30 days",
  D31 = "31 days",
}

// Form related interfaces
export interface CompanyFormProps {
  onSubmit: (company: Company) => void;
  initialValues?: Partial<Company>;
  isLoading?: boolean;
}

// Search related interface
export interface CompanySearchParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  searchText?: string;
}

// Salary field interface
export interface SalaryField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'calculated';
  required?: boolean;
}