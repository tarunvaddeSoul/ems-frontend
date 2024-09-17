import React, { useEffect, useState } from 'react';
import { ChevronDown, UserAvatar, Logout } from "@carbon/icons-react";
import { Menu, UnstyledButton, Group, rem, Text } from "@mantine/core";
import '@mantine/core/styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface User {
  name: string;
  role: string;
}

const API_BASE_URL = 'http://localhost:3003';

const UserMenu: React.FunctionComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post(`${API_BASE_URL}/users/logout`, { refreshToken });
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      navigate('/auth');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return null;
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton
          p="xs"
          className="menu"
          style={{ display: 'flex', alignItems: 'center', borderRadius: '0', borderTopRightRadius: '10px' }}
        >
          <Group>
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <Text size="sm" fw={500}>{user.name}</Text>
              <Text size="xs" c="dimmed">{user.role}</Text>
            </div>
            <ChevronDown />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<UserAvatar style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => navigate('/profile')}
        >
          My Profile
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<Logout style={{ width: rem(14), height: rem(14) }} />}
          onClick={handleSignOut}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;