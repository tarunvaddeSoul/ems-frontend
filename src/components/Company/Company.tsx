import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Checkbox,
  Stepper,
  Group,
  Box,
  Title,
  Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { createStyles } from '@mantine/emotion';

const useStyles = createStyles((theme) => ({
  formContainer: {
    maxWidth: 800,
    margin: '0 auto',
    padding: theme.spacing.xl,
  },
  stepContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
  },
}));

interface SalaryTemplateField {
  id: string;
  label: string;
  required?: boolean;
}

const salaryTemplateFields: SalaryTemplateField[] = [
  { id: "name", label: "Employee Name", required: true },
  { id: "fatherName", label: "Father Name" },
  { id: "companyName", label: "Company Name", required: true },
  { id: "designation", label: "Designation", required: true },
  { id: "monthlyRate", label: "Monthly Rate", required: true },
  { id: "basicDuty", label: "Basic Duty", required: true },
  { id: "dutyDone", label: "Duty Done", required: true },
  { id: "wagesPerDay", label: "Wages per Day" },
  { id: "basicPay", label: "Basic Pay", required: true },
  { id: "epfWages", label: "EPF Wages" },
  { id: "otherAllowance", label: "Other Allowance" },
  { id: "otherAllowanceRemark", label: "Other Allowance Remark" },
  { id: "bonus", label: "Bonus 8.33%" },
  { id: "grossSalary", label: "Gross Salary", required: true },
  { id: "pf", label: "PF 12%", required: true },
  { id: "esic", label: "ESIC 0.75%", required: true },
  { id: "advance", label: "Advance" },
  { id: "uniform", label: "Uniform" },
  { id: "advanceGivenBy", label: "Advance Given By" },
  { id: "penalty", label: "Penalty" },
  { id: "lwf", label: "LWF 10 rupees" },
  { id: "otherDeductions", label: "Other Deductions" },
  { id: "otherDeductionsRemark", label: "Other Deductions Remark" },
  { id: "totalDeductions", label: "Total Deductions", required: true },
  { id: "netSalary", label: "Net Salary", required: true },
  { id: "uanNumber", label: "UAN Number" },
  { id: "pfPaidStatus", label: "PF Paid Status" },
  { id: "esicNumber", label: "ESIC Number" },
  { id: "esicFilingStatus", label: "ESIC Filing Status" },
];

const CompanyForm: React.FC = () => {
  const { classes } = useStyles();
  const [active, setActive] = useState(0);
  const [selectedFields, setSelectedFields] = useState<string[]>(
    salaryTemplateFields.filter(field => field.required).map(field => field.id)
  );

  const form = useForm({
    initialValues: {
      companyName: '',
      companyAddress: '',
      contactPersonName: '',
      contactPersonNumber: '',
    },
    validate: {
      companyName: (value) => value.trim().length > 0 ? null : 'Company Name is required',
      companyAddress: (value) => value.trim().length > 0 ? null : 'Company Address is required',
      contactPersonName: (value) => value.trim().length > 0 ? null : 'Contact Person Name is required',
      contactPersonNumber: (value) => /^\d{10}$/.test(value) ? null : 'Invalid phone number',
    },
  });

  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = (values: typeof form.values) => {
    console.log({
      ...values,
      selectedFields: selectedFields,
    });
    // Here you would typically send the data to your backend
  };

  return (
    <Paper className={classes.formContainer}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Company Details">
            <Box className={classes.stepContainer}>
              <Title order={2}>Company Details</Title>
              <TextInput
                label="Company Name"
                required
                {...form.getInputProps('companyName')}
              />
              <TextInput
                label="Company Address"
                required
                {...form.getInputProps('companyAddress')}
              />
              <TextInput
                label="Contact Person Name"
                required
                {...form.getInputProps('contactPersonName')}
              />
              <TextInput
                label="Contact Person Number"
                required
                {...form.getInputProps('contactPersonNumber')}
              />
            </Box>
          </Stepper.Step>

          <Stepper.Step label="Select Fields">
            <Box className={classes.stepContainer}>
              <Title order={2}>Select Salary Template Fields</Title>
              {salaryTemplateFields.map((field) => (
                <Checkbox
                  key={field.id}
                  label={field.label}
                  checked={selectedFields.includes(field.id)}
                  onChange={(event) => {
                    if (event.currentTarget.checked) {
                      setSelectedFields([...selectedFields, field.id]);
                    } else {
                      setSelectedFields(selectedFields.filter(id => id !== field.id));
                    }
                  }}
                  disabled={field.required}
                />
              ))}
            </Box>
          </Stepper.Step>

          <Stepper.Completed>
            <Box className={classes.stepContainer}>
              <Title order={2}>Review and Submit</Title>
              <p>Company Name: {form.values.companyName}</p>
              <p>Company Address: {form.values.companyAddress}</p>
              <p>Contact Person: {form.values.contactPersonName}</p>
              <p>Contact Number: {form.values.contactPersonNumber}</p>
              <Title order={3} mt="md">Selected Salary Template Fields:</Title>
              <ul>
                {selectedFields.map(fieldId => (
                  <li key={fieldId}>{salaryTemplateFields.find(f => f.id === fieldId)?.label}</li>
                ))}
              </ul>
            </Box>
          </Stepper.Completed>
        </Stepper>

        <Group className={classes.buttonContainer}>
          {active > 0 && <Button onClick={prevStep}>Back</Button>}
          {active < 2 && <Button onClick={nextStep}>Next</Button>}
          {active === 2 && <Button type="submit">Submit</Button>}
        </Group>
      </form>
    </Paper>
  );
};

export default CompanyForm;