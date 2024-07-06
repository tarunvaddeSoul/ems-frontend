export interface Company {
  id: string;
  name: string;
  address: string;
  contactPersonName: string;
  contactPersonNumber: string;
  createdAt: string;
  presentDaysCount: string;
  PF: string;
  ESIC: string;
  BONUS: string;
  LWF: string;
  otherAllowance: number;
  otherAllowanceRemark: string;
  total?: number;
}

export interface CompanySearchParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  searchText?: string;
}

export interface CompanyFormProps {
    onSubmit: (values: any) => void;
    initialValues?: any;
  }