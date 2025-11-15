import type { ReactNode } from 'react';
import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@store/store';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import useAuth from '@hooks/useAuth';
import { toggleTheme } from '@store/slices/uiSlice';
import { selectTheme } from '@store/selectors/uiSelectors';
import Sidebar from '@components/common/Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const theme = useSelector(selectTheme);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--background)',
        }}
      >
        {/* App Bar */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Box sx={{ flex: 1 }} />

            {/* Theme Toggle */}
            <IconButton color="inherit" onClick={handleThemeToggle} title="Toggle theme">
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </IconButton>

            {/* User Menu */}
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <FiUser size={20} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                {user?.full_name}
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/settings');
              }}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <FiLogOut size={16} style={{ marginRight: 8 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;

