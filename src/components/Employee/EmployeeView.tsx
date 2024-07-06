import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Employee } from "./interface/employee.interface";

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#D12702',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D12702',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#D12702',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flexDirection: 'column',
    flexGrow: 1,
    flexBasis: 0,
    marginRight: 10,
  },
  heading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 3,
  },
  text: {
    fontSize: 11,
    color: '#2d3748',
  },
});

const EmployeeView = ({ employee }: { employee: Employee }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
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
            <Text style={styles.text}>{employee.employeeDepartmentName}</Text>
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

export default EmployeeView;