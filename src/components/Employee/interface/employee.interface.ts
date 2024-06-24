import { EmployeeTitle, Gender, Category, EducationQualification } from "../enum/employee.enum";

// Interface for Employee
export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  avatar?: string;
    // Add other properties as needed
  }

  export interface Employee {
    id: string;
    title?: EmployeeTitle;
    firstName: string;
    lastName: string;
    avatar?: string;
    designationName?: string;
    designationId?: string;
    employeeDepartmentId?: string;
    mobileNumber?: string;
    companyName?: string;
    companyId?: string;
    recruitedBy?: string;
    gender?: Gender;
    fatherName?: string;
    motherName?: string;
    husbandName?: string | null;
    category?: Category;
    dateOfBirth?: string;
    age?: number;
    dateOfJoining?: string;
    highestEducationQualification?: EducationQualification;
    bloodGroup?: string;
    permanentAddress?: string;
    presentAddress?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: number;
    referenceName?: string;
    referenceAddress?: string;
    referenceNumber?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    bankCity?: string;
    bankName?: string;
    pfUanNumber?: string;
    esicNumber?: string;
    policeVerificationNumber?: string;
    policeVerificationDate?: string;
    trainingCertificateNumber?: string;
    trainingCertificateDate?: string;
    medicalCertificateNumber?: string;
    medicalCertificateDate?: string;
    photoUpload?: string;
    aadhaarUpload?: string;
    panCardUpload?: string;
    bankPassbook?: string;
    markSheet?: string;
    otherDocument?: string;
    salary?: number;
    aadhaarNumber?: string;
  }

export interface Designation {
    id: string;
    name: string;
}

export interface EmployeeDepartments {
  id: string;
  name: string;
}

export interface Companies {
  id: string;
  name: string;
  address: string;
}

export interface EmployeeFormValues {
    title: EmployeeTitle | '';
    firstName: string;
    lastName: string;
    designationId: string;
    employeeDepartmentId: string;
    mobileNumber: string;
    companyName: string;
    companyId: string;
    recruitedBy: string;
    gender: Gender | '';
    fatherName: string;
    motherName: string;
    husbandName: string | null;
    category: Category | '';
    dateOfBirth: Date | null;
    age: number;
    dateOfJoining: Date | null;
    highestEducationQualification: EducationQualification | '';
    bloodGroup: string;
    permanentAddress: string;
    presentAddress: string;
    city: string;
    district: string;
    state: string;
    pincode: number;
    referenceName: string;
    referenceAddress: string;
    referenceNumber: string;
    bankAccountNumber: string;
    ifscCode: string;
    bankCity: string;
    bankName: string;
    pfUanNumber: string;
    esicNumber: string;
    policeVerificationNumber: string;
    policeVerificationDate: Date | null;
    trainingCertificateNumber: string;
    trainingCertificateDate: Date | null;
    medicalCertificateNumber: string;
    medicalCertificateDate: Date | null;
    photoUpload: File | null;
    aadhaarUpload: File | null;
    panCardUpload: File | null;
    bankPassbook: File | null;
    markSheet: File | null;
    otherDocument: File | null;
    salary: number;
    aadhaarNumber: string;
  }

  