interface Company {
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
  }
  
  const ViewCompanyInExcel = (company: Company) => {
    return {
      'Company Name': company.name,
      'Address': company.address,
      'Contact Person': company.contactPersonName,
      'Contact Number': company.contactPersonNumber,
      'Created At': new Date(company.createdAt).toLocaleString(),
      'Present Days Count': company.presentDaysCount,
      'PF': company.PF,
      'ESIC': company.ESIC,
      'BONUS': company.BONUS,
      'LWF': company.LWF,
      'Other Allowance': company.otherAllowance,
      'Other Allowance Remark': company.otherAllowanceRemark,
    };
  };
  
  export default ViewCompanyInExcel;