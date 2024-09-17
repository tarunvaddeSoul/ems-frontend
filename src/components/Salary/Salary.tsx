import React, { useState, useEffect } from 'react';
import {
  Stepper,
  Button,
  Select,
  TextInput,
  Box,
  Group,
  Text,
  Paper,
  Title,
  ScrollArea,
} from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { IconSearch } from '@tabler/icons-react';
import axios from 'axios';

// Type definitions (same as before)
type Company = {
  id: string;
  name: string;
  salaryTemplates: SalaryTemplate[];
};

type SalaryTemplate = {
  id: string;
  companyId: string;
  fields: {
    [key: string]: {
      value: string;
      enabled: boolean;
    };
  };
};

type Employee = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  name: string;
  designation: string;
  department: string;
  salary: number;
  joiningDate: string;
  leavingDate: string | null;
  [key: string]: any; // For dynamic salary template fields
};

type CompanyOption = {
  value: string;
  label: string;
  salaryTemplates: SalaryTemplate[];
};

const SalaryPage: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryTemplate, setSalaryTemplate] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get<{ data: { companies: Company[] } }>('http://localhost:3003/companies');
      setCompanies(response.data.data.companies.map((company) => ({
        value: company.id,
        label: company.name,
        salaryTemplates: company.salaryTemplates
      })));
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchEmployees = async (companyId: string) => {
    try {
      const response = await axios.get<{ data: Employee[] }>(`http://localhost:3003/companies/${companyId}/employees`);
      const activeEmployees = response.data.data.filter(emp => !emp.leavingDate);
      setEmployees(activeEmployees.map(emp => ({
        ...emp,
        name: `${emp.title} ${emp.firstName} ${emp.lastName}`,
      })));
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCompanySelect = (value: string) => {
    setSelectedCompany(value);
    const company = companies.find(c => c.value === value);
    if (company && company.salaryTemplates && company.salaryTemplates.length > 0) {
      const template = company.salaryTemplates[0].fields;
      const enabledFields = Object.keys(template).filter(key => template[key].enabled);
      setSalaryTemplate(enabledFields);
    }
  };

  const nextStep = () => {
    if (active === 1) {
      fetchEmployees(selectedCompany);
    }
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleCellChange = (employeeId: string, field: string, value: string) => {
    setEmployees(employees.map(emp =>
      emp.id === employeeId ? { ...emp, [field]: value } : emp
    ));
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Title order={2} mb="md">Salary Management</Title>
      <Stepper active={active} onStepClick={setActive} orientation="horizontal" mb="xl">
        <Stepper.Step label="Select Company" description="Choose a company">
          <Paper p="md" mt="md">
            <Select
              label="Company"
              placeholder="Select a company"
              data={companies}
              value={selectedCompany}
              onChange={(value) => handleCompanySelect(value as string)}
            />
          </Paper>
        </Stepper.Step>
        <Stepper.Step label="Select Month" description="Choose a month">
          <Paper p="md" mt="md">
            <MonthPickerInput
              valueFormat="MM-YYYY"
              label="Pick month"
              placeholder="Pick month"
              value={selectedMonth}
              onChange={setSelectedMonth}
            />
          </Paper>
        </Stepper.Step>
        <Stepper.Step label="Salary Sheet" description="View and edit salary sheet">
          <Paper p="md" mt="md">
            <TextInput
              leftSection={<IconSearch size={14} />}
              placeholder="Search employees..."
              mb="md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
            <ScrollArea>
              <Box style={{ width: `${(salaryTemplate.length + 4) * 150}px`, minWidth: '100%' }}>
                <Box style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                  <Text fw={700} style={{ width: 150, flexShrink: 0 }}>Name</Text>
                  <Text fw={700} style={{ width: 150, flexShrink: 0 }}>Designation</Text>
                  <Text fw={700} style={{ width: 150, flexShrink: 0 }}>Department</Text>
                  <Text fw={700} style={{ width: 150, flexShrink: 0 }}>Salary</Text>
                  {salaryTemplate.map((field) => (
                    <Text key={field} fw={700} style={{ width: 150, flexShrink: 0 }}>{field}</Text>
                  ))}
                </Box>
                {filteredEmployees.map((employee) => (
                  <Box key={employee.id} style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                    <Text style={{ width: 150, flexShrink: 0 }}>{employee.name}</Text>
                    <Text style={{ width: 150, flexShrink: 0 }}>{employee.designation}</Text>
                    <Text style={{ width: 150, flexShrink: 0 }}>{employee.department}</Text>
                    <Text style={{ width: 150, flexShrink: 0 }}>{employee.salary}</Text>
                    {salaryTemplate.map((field) => (
                      <TextInput
                        key={field}
                        style={{ width: 150, flexShrink: 0 }}
                        value={employee[field] || ''}
                        onChange={(e) => handleCellChange(employee.id, field, e.currentTarget.value)}
                      />
                    ))}
                  </Box>
                ))}
              </Box>
            </ScrollArea>
          </Paper>
        </Stepper.Step>
      </Stepper>

      <Group mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active !== 2 && <Button onClick={nextStep}>Next step</Button>}
      </Group>
    </Box>
  );
};

export default SalaryPage;