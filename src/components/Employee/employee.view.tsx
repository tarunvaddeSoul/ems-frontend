import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
  } from "@react-pdf/renderer";
  import { Employee } from "./interface/employee.interface";


  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: '#1c7ed6',
      paddingBottom: 10,
    },
    logo: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1c7ed6',
    },
    section: {
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#1c7ed6',
      borderBottomWidth: 1,
      borderBottomColor: '#1c7ed6',
      paddingBottom: 5,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    column: {
      flexDirection: 'column',
      flexGrow: 1,
      flexBasis: 0,
    },
    heading: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#4a4a4a',
    },
    text: {
      fontSize: 10,
      color: '#4a4a4a',
    },
  });
  
  const EmployeePDF = ({ employee }: { employee: Employee }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* <Image style={styles.logo} src={logo} /> */}
          <Text style={styles.title}>Employee Details</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Name</Text>
              <Text style={styles.text}>{`${employee.title || ''} ${employee.firstName} ${employee.lastName}`}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Employee ID</Text>
              <Text style={styles.text}>{employee.id}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Date of Birth</Text>
              <Text style={styles.text}>{employee.dateOfBirth}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Gender</Text>
              <Text style={styles.text}>{employee.gender}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Father's Name</Text>
              <Text style={styles.text}>{employee.fatherName}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Mother's Name</Text>
              <Text style={styles.text}>{employee.motherName}</Text>
            </View>
          </View>
          {employee.husbandName && (
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.heading}>Husband's Name</Text>
                <Text style={styles.text}>{employee.husbandName}</Text>
              </View>
            </View>
          )}
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Details</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Designation</Text>
              <Text style={styles.text}>{employee.designationName}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Department</Text>
              <Text style={styles.text}>{employee.employeeDepartmentId}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Company</Text>
              <Text style={styles.text}>{employee.companyName}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Date of Joining</Text>
              <Text style={styles.text}>{employee.dateOfJoining}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Recruited By</Text>
              <Text style={styles.text}>{employee.recruitedBy}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Salary</Text>
              <Text style={styles.text}>{employee.salary}</Text>
            </View>
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Mobile Number</Text>
              <Text style={styles.text}>{employee.mobileNumber}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Email</Text>
              <Text style={styles.text}>{employee.age}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Present Address</Text>
              <Text style={styles.text}>{employee.presentAddress}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Permanent Address</Text>
              <Text style={styles.text}>{employee.permanentAddress}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>City</Text>
              <Text style={styles.text}>{employee.city}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>District</Text>
              <Text style={styles.text}>{employee.district}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>State</Text>
              <Text style={styles.text}>{employee.state}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Pincode</Text>
              <Text style={styles.text}>{employee.pincode}</Text>
            </View>
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Category</Text>
              <Text style={styles.text}>{employee.category}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Blood Group</Text>
              <Text style={styles.text}>{employee.bloodGroup}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Highest Education</Text>
              <Text style={styles.text}>{employee.highestEducationQualification}</Text>
            </View>
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Details</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Bank Name</Text>
              <Text style={styles.text}>{employee.bankName}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Account Number</Text>
              <Text style={styles.text}>{employee.bankAccountNumber}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>IFSC Code</Text>
              <Text style={styles.text}>{employee.ifscCode}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Bank City</Text>
              <Text style={styles.text}>{employee.bankCity}</Text>
            </View>
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Details</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>PF UAN Number</Text>
              <Text style={styles.text}>{employee.pfUanNumber}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>ESIC Number</Text>
              <Text style={styles.text}>{employee.esicNumber}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>Aadhaar Number</Text>
              <Text style={styles.text}>{employee.aadhaarNumber}</Text>
            </View>
          </View>
        </View>
  
      </Page>
    </Document>
  );
  
  export default EmployeePDF;