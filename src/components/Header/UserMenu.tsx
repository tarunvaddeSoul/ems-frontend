import { ChevronDown, UserAvatar, Logout } from "@carbon/icons-react";
import { Menu, UnstyledButton, Group, rem } from "@mantine/core";
import '@mantine/core/styles.css';

const UserMenu: React.FunctionComponent = () => {
  const handleSignOut = async () => {
    console.log('CLICKEDD')
    // Add sign out logic here
  };

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
              TV
            </div>
            <span>Tarun Vadde</span>
            <ChevronDown />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<UserAvatar style={{ width: rem(14), height: rem(14) }} />}
          // onClick={() => navigate('/profile')}
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
