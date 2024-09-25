import React from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Button,
  Paper,
  Title,
  Grid,
  Stack,
  Group,
  Divider,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { convertToCustomDateFormat } from '../utils/date.converter';

interface SalaryTemplateField {
  enabled: boolean;
  value: string;
}

export interface CompanyFormValues {
  name: string;
  address: string;
  contactPersonName: string;
  contactPersonNumber: string;
  status: 'ACTIVE' | 'INACTIVE';
  companyOnboardingDate: Date | null;
  salaryTemplates: {
    [key: string]: SalaryTemplateField;
  };
}

interface CompanyFormProps {
  initialValues?: any;
  onSubmit: any;
  isLoading?: boolean;
}

const salaryTemplateFields = [
  { id: 'name', label: 'Employee Name', type: 'text' },
  { id: 'fatherName', label: 'Father Name', type: 'text' },
  { id: 'companyName', label: 'Company Name', type: 'text' },
  { id: 'designation', label: 'Designation', type: 'text' },
  { id: 'monthlyRate', label: 'Monthly Rate', type: 'number' },
  { id: 'basicDuty', label: 'Basic Duty', type: 'select', options: ['Full Time', 'Part Time', 'Contract'] },
  { id: 'dutyDone', label: 'Duty Done', type: 'number' },
  { id: 'wagesPerDay', label: 'Wages per Day', type: 'number' },
  { id: 'basicPay', label: 'Basic Pay', type: 'number' },
  { id: 'epfWages', label: 'EPF Wages', type: 'number' },
  { id: 'otherAllowance', label: 'Other Allowance', type: 'number' },
  { id: 'otherAllowanceRemark', label: 'Other Allowance Remark', type: 'text' },
  { id: 'bonus', label: 'Bonus 8.33%', type: 'number' },
  { id: 'grossSalary', label: 'Gross Salary', type: 'number' },
  { id: 'pf', label: 'PF 12%', type: 'number' },
  { id: 'esic', label: 'ESIC 0.75%', type: 'number' },
  { id: 'advance', label: 'Advance', type: 'number' },
  { id: 'uniform', label: 'Uniform', type: 'number' },
  { id: 'advanceGivenBy', label: 'Advance Given By', type: 'text' },
  { id: 'penalty', label: 'Penalty', type: 'number' },
  { id: 'lwf', label: 'LWF 10 rupees', type: 'number' },
  { id: 'otherDeductions', label: 'Other Deductions', type: 'number' },
  { id: 'otherDeductionsRemark', label: 'Other Deductions Remark', type: 'text' },
  { id: 'totalDeductions', label: 'Total Deductions', type: 'number' },
  { id: 'netSalary', label: 'Net Salary', type: 'number' },
  { id: 'uanNumber', label: 'UAN Number', type: 'text' },
  { id: 'pfPaidStatus', label: 'PF Paid Status', type: 'text' },
  { id: 'esicNumber', label: 'ESIC Number', type: 'text' },
  { id: 'esicFilingStatus', label: 'ESIC Filing Status', type: 'text' },
];

const CompanyForm: React.FC<CompanyFormProps> = ({ initialValues, onSubmit, isLoading = false }) => {
  const form = useForm<CompanyFormValues>({
    initialValues: initialValues || {
      name: '',
      address: '',
      contactPersonName: '',
      contactPersonNumber: '',
      status: 'ACTIVE',
      companyOnboardingDate: null,
      salaryTemplates: Object.fromEntries(
        salaryTemplateFields.map((field) => [
          field.id,
          { enabled: true, value: '' }
        ])
      ),
    },
    validate: {
      name: (value) => (value ? null : 'Company name is required'),
      address: (value) => (value ? null : 'Address is required'),
      contactPersonName: (value) => (value ? null : 'Contact person name is required'),
      contactPersonNumber: (value) => {
        if (!value) return 'Contact number is required';
        if (!/^\d{10}$/.test(value)) return 'Contact number must be 10 digits';
        return null;
      },
      companyOnboardingDate: (value) => (value ? null : 'Onboarding date is required'),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const formattedValues = {
      ...values,
      companyOnboardingDate: values.companyOnboardingDate 
        ? convertToCustomDateFormat(values.companyOnboardingDate)
        : null,
    };
    onSubmit(formattedValues as unknown as CompanyFormValues);
  });

  return (
    <Paper shadow="sm" p="xl" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="xl">
          <Title order={2}>{initialValues ? 'Edit Company' : 'Add Company'}</Title>
          
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Company Name"
                required
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Address"
                required
                {...form.getInputProps('address')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Contact Person Name"
                required
                {...form.getInputProps('contactPersonName')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Contact Person Number"
                required
                {...form.getInputProps('contactPersonNumber')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Status"
                required
                data={[
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' },
                ]}
                {...form.getInputProps('status')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateInput
                label="Company Onboarding Date"
                required
                {...form.getInputProps('companyOnboardingDate')}
              />
            </Grid.Col>
          </Grid>

          <Divider my="lg" />
          
          <Title order={3}>Salary Template</Title>
          
          <Grid>
            {salaryTemplateFields.map((field) => (
              <Grid.Col key={field.id} span={6}>
                <Group align="center" gap="xs">
                  <Checkbox
                    {...form.getInputProps(`salaryTemplates.${field.id}.enabled`, { type: 'checkbox' })}
                  />
                  {field.type === 'text' && (
                    <TextInput
                      label={field.label}
                      {...form.getInputProps(`salaryTemplates.${field.id}.value`)}
                      disabled={!form.values.salaryTemplates[field.id].enabled}
                      style={{ flex: 1 }}
                    />
                  )}
                  {field.type === 'number' && (
                    <NumberInput
                      label={field.label}
                      {...form.getInputProps(`salaryTemplates.${field.id}.value`)}
                      disabled={!form.values.salaryTemplates[field.id].enabled}
                      style={{ flex: 1 }}
                    />
                  )}
                  {field.type === 'select' && (
                    <Select
                      label={field.label}
                      data={(field.options as string[]).map((option) => ({ value: option, label: option }))}
                      {...form.getInputProps(`salaryTemplates.${field.id}.value`)}
                      disabled={!form.values.salaryTemplates[field.id].enabled}
                      style={{ flex: 1 }}
                    />
                  )}
                </Group>
              </Grid.Col>
            ))}
          </Grid>

          <Group mt="xl">
            <Button type="submit" loading={isLoading}>
              {initialValues ? 'Update Company' : 'Add Company'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default CompanyForm;