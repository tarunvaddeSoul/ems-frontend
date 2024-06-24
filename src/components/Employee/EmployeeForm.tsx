import React from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Stack, Group } from '@mantine/core';

function EmployeeForm() {
  const form = useForm({
    initialValues: {
      title: '',
      firstName: '',
      lastName: '',
      designationId: '',
      departmentId: '',
      mobileNumber: '',
      companyName: '',
      companyId: '',
      recruitedBy: '',
    },

    validate: {
      firstName: (value) => (value.length < 2 ? 'First name must have at least 2 letters' : null),
      lastName: (value) => (value.length < 2 ? 'Last name must have at least 2 letters' : null),
      mobileNumber: (value) => (/^\d{10}$/.test(value) ? null : 'Invalid mobile number'),
    },
  });

  const handleSubmit = (values: any) => {
    console.log(values);
    // Perform the API call to create the employee
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack style={{ gap: '2.5rem' }}>
        <TextInput
          label="Title"
          placeholder="Mr./Ms."
          {...form.getInputProps('title')}
        />
        <TextInput
          label="First Name"
          placeholder="First Name"
          required
          {...form.getInputProps('firstName')}
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          required
          {...form.getInputProps('lastName')}
        />
        <TextInput
          label="Designation ID"
          placeholder="Designation ID"
          {...form.getInputProps('designationId')}
        />
        <TextInput
          label="Department ID"
          placeholder="Department ID"
          {...form.getInputProps('departmentId')}
        />
        <TextInput
          label="Mobile Number"
          placeholder="Mobile Number"
          required
          {...form.getInputProps('mobileNumber')}
        />
        <TextInput
          label="Company Name"
          placeholder="Company Name"
          {...form.getInputProps('companyName')}
        />
        <TextInput
          label="Company ID"
          placeholder="Company ID"
          {...form.getInputProps('companyId')}
        />
        <TextInput
          label="Recruited By"
          placeholder="Recruited By"
          {...form.getInputProps('recruitedBy')}
        />
      </Stack>
      <Group mt="md">
        <Button type="submit">Create Employee</Button>
      </Group>
    </form>
  );
}

export default EmployeeForm;
