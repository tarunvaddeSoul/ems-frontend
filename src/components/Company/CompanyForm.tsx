import React from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Select,
  NumberInput,
  Button,
  Box,
  Grid,
  Paper,
  Title,
  Text,
  Divider,
  Group,
  Stack,
} from '@mantine/core';
import { IconBuilding, IconUser, IconPhone, IconCalendar, IconCash, IconNotes } from '@tabler/icons-react';
import { PresentDaysCount, PFOptions, ESICOptions, BONUSOptions, LWFOptions } from './enum/company.enum';
import { Company, CompanyFormProps } from './interface/company.interface';

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, initialValues = {} }) => {
  const form = useForm({
    initialValues: {
      name: '',
      address: '',
      contactPersonName: '',
      contactPersonNumber: '',
      presentDaysCount: PresentDaysCount.D26,
      PF: PFOptions.NO,
      ESIC: ESICOptions.NO,
      BONUS: BONUSOptions.NO,
      LWF: LWFOptions.NO,
      otherAllowance: 0,
      otherAllowanceRemark: '',
      ...initialValues,
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
      otherAllowance: (value) => (value < 0 ? 'Other allowance must be non-negative' : null),
    },
  });

  const handleSubmit = (values: Company) => {
    onSubmit({
      ...values,
      name: values.name.toUpperCase(),
      address: values.address.toUpperCase(),
      contactPersonName: values.contactPersonName.toUpperCase(),
      contactPersonNumber: values.contactPersonNumber.toUpperCase(),
      otherAllowanceRemark: values.otherAllowanceRemark?.toUpperCase(),
    });
  };

  return (
    <Paper shadow="sm" p="xl" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          <Title order={2}>Company Information</Title>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <TextInput
                required
                label="Company Name"
                placeholder="Enter company name"
                leftSection={<IconBuilding size="1rem" />}
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                required
                label="Address"
                placeholder="Enter company address"
                leftSection={<IconBuilding size="1rem" />}
                {...form.getInputProps('address')}
              />
            </Grid.Col>
          </Grid>

          <Divider my="sm" />

          <Title order={3}>Contact Information</Title>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <TextInput
                required
                label="Contact Person Name"
                placeholder="Enter contact person name"
                leftSection={<IconUser size="1rem" />}
                {...form.getInputProps('contactPersonName')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                required
                label="Contact Person Number"
                placeholder="Enter 10-digit contact number"
                leftSection={<IconPhone size="1rem" />}
                {...form.getInputProps('contactPersonNumber')}
              />
            </Grid.Col>
          </Grid>

          <Divider my="sm" />

          <Title order={3}>Company Policies</Title>
          <Grid gutter="md">
            <Grid.Col span={4}>
              <Select
                required
                label="Present Days Count"
                placeholder="Select present days count"
                leftSection={<IconCalendar size="1rem" />}
                data={Object.values(PresentDaysCount).map((value) => ({ value, label: value }))}
                {...form.getInputProps('presentDaysCount')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="PF"
                required
                placeholder="Select PF option"
                leftSection={<IconCash size="1rem" />}
                data={Object.values(PFOptions).map((value) => ({ value, label: value }))}
                {...form.getInputProps('PF')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="ESIC"
                required
                placeholder="Select ESIC option"
                leftSection={<IconCash size="1rem" />}
                data={Object.values(ESICOptions).map((value) => ({ value, label: value }))}
                {...form.getInputProps('ESIC')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="BONUS"
                required
                placeholder="Select BONUS option"
                leftSection={<IconCash size="1rem" />}
                data={Object.values(BONUSOptions).map((value) => ({ value, label: value }))}
                {...form.getInputProps('BONUS')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="LWF"
                required
                placeholder="Select LWF option"
                leftSection={<IconCash size="1rem" />}
                data={Object.values(LWFOptions).map((value) => ({ value, label: value }))}
                {...form.getInputProps('LWF')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                required
                label="Other Allowance"
                placeholder="Enter amount"
                min={0}
                leftSection={<IconCash size="1rem" />}
                {...form.getInputProps('otherAllowance')}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Other Allowance Remark"
            placeholder="Enter remark (optional)"
            leftSection={<IconNotes size="1rem" />}
            {...form.getInputProps('otherAllowanceRemark')}
          />

          <Group justify="right" mt="xl">
            <Button type="submit" size="md">
              Submit Company Information
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default CompanyForm;