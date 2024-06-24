import { Avatar, Text, Group } from '@mantine/core';
import React from 'react';
import stringAvatar from '../utils/stringAvatar';

const PersonCard: React.FC<{
  name: string;
  photoUrl?: string;
  email: string;
}> = ({ name, email }) => {
  return (
    <Group>
      <Avatar {...stringAvatar(name)} />
      <div>
        <Text>{name}</Text>
        <Text size="xs" c="dimmed">
          {email}
        </Text>
      </div>
    </Group>
  );
};

export default PersonCard;
