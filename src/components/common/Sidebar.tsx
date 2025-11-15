import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiFileText,
  FiHelpCircle,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
} from 'react-icons/fi';
import useAuth from '@hooks/useAuth';

const menuItems = [
  {
    label: 'Dashboard',
    icon: FiHome,
    path: '/dashboard',
    roles: ['super_admin', 'content_manager', 'question_manager', 'test_manager', 'teacher'],
  },
  {
    label: 'Content Management',
    icon: FiFileText,
    path: '/content',
    roles: ['super_admin', 'content_manager'],
    subItems: [
      { label: 'List Content', path: '/content' },
      { label: 'Upload New', path: '/content/upload' },
      { label: 'Pending Review', path: '/content/pending' },
    ],
  },
  {
    label: 'Questions',
    icon: FiHelpCircle,
    path: '/questions',
    roles: ['super_admin', 'question_manager'],
    subItems: [
      { label: 'Question Bank', path: '/questions' },
      { label: 'Create Question', path: '/questions/create' },
      { label: 'Pending Review', path: '/questions/pending' },
    ],
  },
  {
    label: 'Tests',
    icon: FiCheckSquare,
    path: '/tests',
    roles: ['super_admin', 'test_manager'],
    subItems: [
      { label: 'Tests List', path: '/tests' },
      { label: 'Create Test', path: '/tests/create' },
      { label: 'Configure', path: '/tests/configure' },
    ],
  },
  {
    label: 'Users',
    icon: FiUsers,
    path: '/users',
    roles: ['super_admin'],
    subItems: [
      { label: 'Users List', path: '/users' },
      { label: 'Create User', path: '/users/create' },
      { label: 'Roles', path: '/users/roles' },
    ],
  },
  {
    label: 'Analytics',
    icon: FiBarChart2,
    path: '/analytics',
    roles: ['super_admin', 'content_manager', 'question_manager', 'test_manager'],
    subItems: [
      { label: 'Dashboard', path: '/analytics' },
      { label: 'Reports', path: '/analytics/reports' },
      { label: 'Export', path: '/analytics/export' },
    ],
  },
  {
    label: 'Settings',
    icon: FiSettings,
    path: '/settings',
    roles: ['super_admin'],
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const visibleItems = menuItems.filter((item) => item.roles.includes(role || ''));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--disabled)',
        },
      }}
    >
      {/* Logo/Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '20px',
          color: 'var(--primary)',
          borderBottom: '1px solid var(--disabled)',
        }}
      >
        VedAI
      </Box>

      {/* Menu Items */}
      <List sx={{ py: 2 }}>
        {visibleItems.map((item) => (
          <div key={item.label}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.subItems) {
                    toggleExpand(item.label);
                  } else {
                    navigate(item.path);
                  }
                }}
                selected={isActive(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    borderRight: '3px solid var(--primary)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? 'var(--primary)' : 'inherit',
                  }}
                >
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.subItems && (
                  <FiChevronDown
                    size={20}
                    style={{
                      transform: expandedItems.includes(item.label) ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>

            {/* Sub Items */}
            {item.subItems && (
              <Collapse in={expandedItems.includes(item.label)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.label} disablePadding>
                      <ListItemButton
                        onClick={() => navigate(subItem.path)}
                        selected={isActive(subItem.path)}
                        sx={{
                          pl: 4,
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          },
                        }}
                      >
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

