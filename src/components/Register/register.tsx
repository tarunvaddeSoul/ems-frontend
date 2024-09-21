import React, { useState, useEffect } from 'react';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import axios from 'axios';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Select,
  Notification,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3003';

interface Department {
  id: string;
  name: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export function AuthForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      mobileNumber: '',
      departmentId: '',
      password: '',
      role: 'USER',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
      mobileNumber: (val) => (type === 'register' ? (/^\d{10}$/.test(val) ? null : 'Invalid mobile number') : null),
      departmentId: (val) => (type === 'register' ? (val ? null : 'Please select a department') : null),
      name: (val) => (type === 'register' ? (val.trim().length > 0 ? null : 'Name is required') : null),
      terms: (val) => (type === 'register' ? (val ? null : 'You must accept the terms and conditions') : null),
    },
  });

  useEffect(() => {
    if (type === 'register') {
      fetchDepartments();
    }
  }, [type]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/user-departments`);
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setNotification({ type: 'error', message: 'Failed to fetch departments. Please try again.' });
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    setNotification(null);

    try {
      let response;
      if (type === 'register') {
        const payload = {
          name: values.name,
          mobileNumber: values.mobileNumber,
          email: values.email,
          password: values.password,
          role: values.role,
          departmentId: values.departmentId
        };
        response = await axios.post<AuthResponse>(`${API_BASE_URL}/users/register`, payload);
      } else {
        response = await axios.post<AuthResponse>(`${API_BASE_URL}/users/login`, {
          email: values.email,
          password: values.password,
        });
      }
      
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens securely
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set up axios interceptors for token refresh
      setupAxiosInterceptors(refreshToken);

      setNotification({ type: 'success', message: `${upperFirst(type)} successful!` });
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (error: any) {
      setNotification({ type: 'error', message: error.response?.data?.message || 'An error occurred. Please try again.' });
      console.error(`Error during ${type}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.values.email) {
      setNotification({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users/forgot-password`, { email: form.values.email });
      setNotification({ type: 'success', message: 'Password reset email sent!' });
    } catch (error: any) {
      setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to send password reset email.' });
      console.error('Error sending forgot password request:', error);
    }
  };

  const setupAxiosInterceptors = (refreshToken: string) => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, { refreshToken });
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Handle refresh token error (e.g., logout user)
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/auth');
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={900} mb="md">
        Welcome, {type} to continue
      </Text>

      {notification && (
        <Notification color={notification.type === 'success' ? 'green' : 'red'} onClose={() => setNotification(null)}>
          {notification.message}
        </Notification>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <>
              <TextInput
                required
                label="Name"
                placeholder="Your name"
                {...form.getInputProps('name')}
                radius="md"
              />
              <TextInput
                required
                label="Mobile Number"
                placeholder="1234567890"
                {...form.getInputProps('mobileNumber')}
                radius="md"
              />
              <Select
                required
                label="Department"
                placeholder="Select your department"
                searchable
                data={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                {...form.getInputProps('departmentId')}
                radius="md"
              />
              <Select
                required
                label="Role"
                placeholder="Select your role"
                searchable
                data={[
                  { value: 'USER', label: 'User' },
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'HR', label: 'HR' },
                  { value: 'OPERATIONS', label: 'Operations' },
                  { value: 'ACCOUNTS', label: 'Accounts' },
                  { value: 'FIELD', label: 'Field' },
                ]}
                {...form.getInputProps('role')}
                radius="md"
              />
            </>
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@example.com"
            {...form.getInputProps('email')}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              {...form.getInputProps('terms', { type: 'checkbox' })}
            />
          )}
        </Stack>

        {type === 'login' && (
          <Group justify="apart" mt="xs">
            <Anchor component="button" type="button" c="dimmed" onClick={handleForgotPassword} size="xs">
              Forgot password?
            </Anchor>
          </Group>
        )}

        <Group justify="apart" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl" loading={isSubmitting}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}