// import React from 'react';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// import { Company } from './interface/company.interface';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#E4E4E4',
//     padding: 30,
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 12,
//     marginBottom: 5,
//   },
// });

// const ViewCompanyInPDF: React.FC<{ company: Company }> = ({ company }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text style={styles.title}>{company.name}</Text>
//         <Text style={styles.text}>Address: {company.address}</Text>
//         <Text style={styles.text}>Contact Person: {company.contactPersonName}</Text>
//         <Text style={styles.text}>Contact Number: {company.contactPersonNumber}</Text>
//         {/* <Text style={styles.text}>Created At: {new Date(company.createdAt).toLocaleString()}</Text> */}
//         <Text style={styles.text}>Present Days Count: {company.presentDaysCount}</Text>
//         <Text style={styles.text}>PF: {company.PF}</Text>
//         <Text style={styles.text}>ESIC: {company.ESIC}</Text>
//         <Text style={styles.text}>BONUS: {company.BONUS}</Text>
//         <Text style={styles.text}>LWF: {company.LWF}</Text>
//         <Text style={styles.text}>Other Allowance: {company.otherAllowance}</Text>
//         <Text style={styles.text}>Other Allowance Remark: {company.otherAllowanceRemark}</Text>
//       </View>
//     </Page>
//   </Document>
// );

const ViewCompanyInPDF = () => {}
export default ViewCompanyInPDF;
