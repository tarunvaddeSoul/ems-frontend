import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Select,
  Notification,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';

const API_BASE_URL = 'http://localhost:3003';

interface UserProfile {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  departmentId: string;
  role: string;
  createdAt: string;
}

interface Department {
  id: string;
  name: string;
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const profileForm = useForm({
    initialValues: {
      name: '',
      mobileNumber: '',
      email: '',
      departmentId: '',
      role: '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      mobileNumber: (value) => (/^\d{10}$/.test(value) ? null : 'Invalid mobile number'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const passwordForm = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: {
      oldPassword: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      newPassword: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmNewPassword: (value, values) =>
        value === values.newPassword ? null : 'Passwords do not match',
    },
  });

  useEffect(() => {
    fetchProfile();
    fetchDepartments();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<UserProfile>(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      profileForm.setValues(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setNotification({ type: 'error', message: 'Failed to fetch profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get<{ data: Department[] }>(`${API_BASE_URL}/departments/user-departments`);
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setNotification({ type: 'error', message: 'Failed to fetch departments. Please try again.' });
    }
  };

  const handleProfileUpdate = async (values: typeof profileForm.values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`${API_BASE_URL}/users/update`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({ type: 'error', message: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: typeof passwordForm.values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `${API_BASE_URL}/users/change-password`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification({ type: 'success', message: 'Password changed successfully!' });
      passwordForm.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      setNotification({ type: 'error', message: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Paper radius="md" p="xl" withBorder>
      <LoadingOverlay visible={loading} />
      <Text size="xl" fw={700} mb="md">
        Profile
      </Text>

      {notification && (
        <Notification
          color={notification.type === 'success' ? 'green' : 'red'}
          onClose={() => setNotification(null)}
          mb="md"
        >
          {notification.message}
        </Notification>
      )}

      <form onSubmit={profileForm.onSubmit(handleProfileUpdate)}>
        <Stack>
          <TextInput
            required
            label="Name"
            {...profileForm.getInputProps('name')}
          />
          <TextInput
            required
            label="Mobile Number"
            {...profileForm.getInputProps('mobileNumber')}
          />
          <TextInput
            required
            label="Email"
            {...profileForm.getInputProps('email')}
          />
          <Select
            label="Department"
            data={departments.map((dept) => ({ value: dept.id, label: dept.name }))}
            {...profileForm.getInputProps('departmentId')}
          />
          <Select
            label="Role"
            data={[
              { value: 'USER', label: 'User' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'HR', label: 'HR' },
              { value: 'OPERATIONS', label: 'Operations' },
              { value: 'ACCOUNTS', label: 'Accounts' },
              { value: 'FIELD', label: 'Field' },
            ]}
            {...profileForm.getInputProps('role')}
            disabled
          />
          <Button type="submit">Update Profile</Button>
        </Stack>
      </form>

      <Text size="xl" fw={700} mt="xl" mb="md">
        Change Password
      </Text>

      <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
        <Stack>
          <PasswordInput
            required
            label="Current Password"
            {...passwordForm.getInputProps('oldPassword')}
          />
          <PasswordInput
            required
            label="New Password"
            {...passwordForm.getInputProps('newPassword')}
          />
          <PasswordInput
            required
            label="Confirm New Password"
            {...passwordForm.getInputProps('confirmNewPassword')}
          />
          <Button type="submit">Change Password</Button>
        </Stack>
      </form>
    </Paper>
  );
}