import React from 'react';
import { 
  Card, Text, Group, RingProgress, Stack, Title, SimpleGrid, 
  Paper, ThemeIcon, Progress, Container, Grid, useMantineTheme
} from '@mantine/core';
import { 
  IconUsers, IconBuilding, IconUserPlus, IconBuildingSkyscraper,
  IconArrowUpRight, IconArrowDownRight, IconChartBar
} from '@tabler/icons-react';
import appTheme from '../../appTheme';

interface DashboardData {
  totalEmployees: number;
  newEmployeesThisMonth: number;
  totalCompanies: number;
  newCompaniesThisMonth: number;
  employeeGrowth: number;
  companyGrowth: number;
  revenueGrowth: number;
  topPerformers: { name: string; performance: number }[];
}

const dashboardData: DashboardData = {
  totalEmployees: 3,
  newEmployeesThisMonth: 0,
  totalCompanies: 1,
  newCompaniesThisMonth: 1,
  employeeGrowth: -5,
  companyGrowth: 20,
  revenueGrowth: 15,
  topPerformers: [
    { name: "Company A", performance: 95 },
    { name: "Company B", performance: 80 },
    { name: "Company C", performance: 75 },
  ]
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; c: string }> = ({ title, value, icon, c }) => (
  <Paper withBorder p="md" radius="md">
    <Group align="apart">
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
        {title}
      </Text>
      <ThemeIcon c={c} variant="light" size={38} radius="md">
        {icon}
      </ThemeIcon>
    </Group>
    <Group align="flex-end" gap="xs" mt={25}>
      <Text fw={700} fz="xl">{value}</Text>
      <Text c={value > 0 ? "teal" : "red"} fz="sm" fw={500}>
        {value > 0 ? <IconArrowUpRight size="1rem" stroke={1.5} /> : <IconArrowDownRight size="1rem" stroke={1.5} />}
        {Math.abs(value)}%
      </Text>
    </Group>
  </Paper>
);

const Dashboard: React.FC = () => {
  const theme = useMantineTheme();

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
              c={theme.primaryColor}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <StatCard 
              title="New Employees" 
              value={dashboardData.newEmployeesThisMonth}
              icon={<IconUserPlus size="1.4rem" stroke={1.5} />}
              c="green"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <StatCard 
              title="Total Companies" 
              value={dashboardData.totalCompanies}
              icon={<IconBuilding size="1.4rem" stroke={1.5} />}
              c="violet"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <StatCard 
              title="New Companies" 
              value={dashboardData.newCompaniesThisMonth}
              icon={<IconBuildingSkyscraper size="1.4rem" stroke={1.5} />}
              c="orange"
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group align="apart">
                  <Text fw={500}>Employee Growth</Text>
                  <IconChartBar size={16} />
                </Group>
              </Card.Section>
              <Text mt="md" c={dashboardData.employeeGrowth > 0 ? "teal" : "red"} size="xl" fw={700}>
                {dashboardData.employeeGrowth}%
              </Text>
              <Text mt="xs" c="dimmed" size="sm">
                Compared to last month
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group align="apart">
                  <Text fw={500}>Company Growth</Text>
                  <IconChartBar size={16} />
                </Group>
              </Card.Section>
              <Text mt="md" c="teal" size="xl" fw={700}>
                {dashboardData.companyGrowth}%
              </Text>
              <Text mt="xs" c="dimmed" size="sm">
                Compared to last month
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group align="apart">
                  <Text fw={500}>Revenue Growth</Text>
                  <IconChartBar size={16} />
                </Group>
              </Card.Section>
              <Text mt="md" c="teal" size="xl" fw={700}>
                {dashboardData.revenueGrowth}%
              </Text>
              <Text mt="xs" c="dimmed" size="sm">
                Compared to last month
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group align="apart">
                  <Text fw={500}>Top Performing Companies</Text>
                  <IconChartBar size={16} />
                </Group>
              </Card.Section>
              <Stack mt="md" gap="xs">
                {dashboardData.topPerformers.map((company, index) => (
                  <div key={index}>
                    <Group align="apart" mb={5}>
                      <Text size="sm">{company.name}</Text>
                      <Text size="sm" c="dimmed">{company.performance}%</Text>
                    </Group>
                    <Progress 
                      value={company.performance} 
                      c={appTheme.primaryColor} 
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