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
    employeeDepartmentName?: string;
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
    photo?: string;
    aadhaar?: string;
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
    companyId: string;
    recruitedBy: string;
    gender: Gender | '';
    fatherName: string;
    motherName: string;
    husbandName: string | null;
    category: Category | '';
    dateOfBirth: Date;
    dateOfJoining: Date;
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
    policeVerificationDate: Date;
    trainingCertificateNumber: string;
    trainingCertificateDate: Date;
    medicalCertificateNumber: string;
    medicalCertificateDate: Date;
    photo: File | null | undefined | string;
    aadhaar: File | null | undefined | string;
    panCardUpload: File | null | undefined | string;
    bankPassbook: File | null | undefined | string;
    markSheet: File | null | undefined | string;
    otherDocument: File | null | undefined | string;
    salary: number;
    aadhaarNumber: string;
  }

  