import { ThemeIcon, ActionIcon } from '@mantine/core';
import { ChevronLeft, ChevronRight } from '@carbon/icons-react';

const SidebarToggleButton = ({ sidebarOpen, toggleSidebar }: { sidebarOpen: boolean, toggleSidebar: () => void }) => {
  return (
    <ActionIcon
      onClick={toggleSidebar}
      variant="outline"
      size="xl"
      style={{
        alignSelf: 'flex-start',
        margin: '0.5rem',
        borderColor: sidebarOpen ? '#33312f' : '#D5D1CF', // Adjust colors as needed
        borderWidth: '2px',
      }}
    >
      <ThemeIcon color="blueRibbon" size="lg" radius="md">
        {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </ThemeIcon>
    </ActionIcon>
  );
};

export default SidebarToggleButton;
