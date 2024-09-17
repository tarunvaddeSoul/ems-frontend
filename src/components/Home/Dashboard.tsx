import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, Text, Group, Stack, Title, Paper, ThemeIcon, Progress, Container, Grid, 
  useMantineTheme, Loader, Alert, Skeleton
} from '@mantine/core';
import { 
  IconUsers, IconBuilding, IconUserPlus, IconBuildingSkyscraper,
  IconArrowUpRight, IconArrowDownRight, IconChartBar, IconAlertCircle
} from '@tabler/icons-react';
import appTheme from '../../appTheme';

interface DashboardData {
  totalEmployees: number;
  newEmployeesThisMonth: number;
  totalCompanies: number;
  newCompaniesThisMonth: number;
}

interface CompanyData {
  name: string;
  employeeCount: number;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Paper withBorder p="md" radius="md" shadow="sm">
    <Group align="apart">
      <Text size="sm" c="dimmed" tt="uppercase" fw={600}>
        {title}
      </Text>
      <ThemeIcon color={color} variant="light" size={38} radius="md">
        {icon}
      </ThemeIcon>
    </Group>
    <Group align="flex-end" gap="xs" mt={25}>
      <Text fw={700} fz="xl">{value}</Text>
    </Group>
  </Paper>
);

const Dashboard: React.FC = () => {
  const theme = useMantineTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, companyResponse] = await Promise.all([
          axios.get('http://localhost:3003/dashboard'),
          axios.get('http://localhost:3003/companies/employee-count')
        ]);

        setDashboardData(dashboardResponse.data.data);
        setCompanyData(companyResponse.data.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Loader size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const employeeGrowth = dashboardData.newEmployeesThisMonth / dashboardData.totalEmployees * 100;
  const companyGrowth = dashboardData.newCompaniesThisMonth / dashboardData.totalCompanies * 100;

  return (
    <Container size="xl">
      <Stack gap="xl" py="xl">
        <Title order={1}>Dashboard</Title>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <StatCard 
              title="Total Employees" 
              value={dashboardData.totalEmployees}
              icon={<IconUsers size="1.4rem" stroke={1.5} />}
              color={theme.primaryColor}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <StatCard 
              title="New Employees" 
              value={dashboardData.newEmployeesThisMonth}
              icon={<IconUserPlus size="1.4rem" stroke={1.5} />}
              color="green"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <StatCard 
              title="Total Companies" 
              value={dashboardData.totalCompanies}
              icon={<IconBuilding size="1.4rem" stroke={1.5} />}
              color="violet"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <StatCard 
              title="New Companies" 
              value={dashboardData.newCompaniesThisMonth}
              icon={<IconBuildingSkyscraper size="1.4rem" stroke={1.5} />}
              color="orange"
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group align="apart">
                  <Text fw={500}>Employee Growth</Text>
                  <IconChartBar size={16} />
                </Group>
              </Card.Section>
              <Text mt="md" c={employeeGrowth > 0 ? "teal" : "red"} size="xl" fw={700}>
                {employeeGrowth.toFixed(2)}%
                {employeeGrowth > 0 ? <IconArrowUpRight size="1rem" stroke={1.5} /> : <IconArrowDownRight size="1rem" stroke={1.5} />}
              </Text>
              <Text mt="xs" c="dimmed" size="sm">
                New employees this month
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group align="apart">
                  <Text fw={500}>Company Growth</Text>
                  <IconChartBar size={16} />
                </Group>
              </Card.Section>
              <Text mt="md" c={companyGrowth > 0 ? "teal" : "red"} size="xl" fw={700}>
                {companyGrowth.toFixed(2)}%
                {companyGrowth > 0 ? <IconArrowUpRight size="1rem" stroke={1.5} /> : <IconArrowDownRight size="1rem" stroke={1.5} />}
              </Text>
              <Text mt="xs" c="dimmed" size="sm">
                New companies this month
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group align="apart">
                  <Text fw={500}>Companies by Employee Count</Text>
                  <IconChartBar size={16} />
                </Group>
              </Card.Section>
              <Stack mt="md" gap="xs">
                {companyData.map((company, index) => (
                  <div key={index}>
                    <Group align="apart" mb={5}>
                      <Text size="sm">{company.name}</Text>
                      <Text size="sm" c="dimmed">{company.employeeCount}</Text>
                    </Group>
                    <Progress 
                      value={(company.employeeCount / Math.max(...companyData.map(c => c.employeeCount))) * 100} 
                      color={appTheme.primaryColor} 
                      size="sm" 
                      radius="xl"
                    />
                  </div>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Dashboard;