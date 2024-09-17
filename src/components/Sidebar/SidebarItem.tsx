import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  rightSection?: React.ReactNode;
  onClick?: () => void;
  styles?: React.CSSProperties;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, rightSection, onClick, styles }) => {
  const content = (
    <div style={styles} onClick={onClick}>
      {icon}
      <span style={{ marginLeft: '10px' }}>{label}</span>
      {rightSection && <span style={{ marginLeft: 'auto' }}>{rightSection}</span>}
    </div>
  );

  return to === "#" ? content : <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>;
};