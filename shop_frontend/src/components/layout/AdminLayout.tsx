import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { authService } from '../../services/auth';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      label: '대시보드', 
      icon: <DashboardIcon /> 
    },
    { 
      path: '/admin/products', 
      label: '상품 관리', 
      icon: <InventoryIcon /> 
    },
    { 
      path: '/admin/orders', 
      label: '주문 관리', 
      icon: <AssignmentIcon /> 
    },
    { 
      path: '/admin/users', 
      label: '사용자 관리', 
      icon: <PeopleIcon /> 
    },
  ];

  const currentPageTitle = menuItems.find(item => item.path === location.pathname)?.label || '관리자';
  const currentDrawerWidth = isCollapsed ? collapsedDrawerWidth : drawerWidth;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          minHeight: 64,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        {!isCollapsed && (
          <Typography variant="h6" fontWeight="bold">
            관리자 패널
          </Typography>
        )}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ 
            ...(isCollapsed && { mx: 'auto' })
          }}
        >
          {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* 메뉴 항목 */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: isCollapsed ? 'center' : 'initial',
                  px: 2,
                  ...(isActive && {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15)
                    }
                  }),
                  ...(!isActive && {
                    '&:hover': {
                      bgcolor: theme.palette.action.hover
                    }
                  })
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 3,
                    justifyContent: 'center',
                    color: isActive ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'medium' : 'regular'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* 하단 메뉴 */}
      <List sx={{ p: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              borderRadius: 2,
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 2
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 3,
                justifyContent: 'center'
              }}
            >
              <HomeIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText primary="쇼핑몰로 이동" />
            )}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 2
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 3,
                justifyContent: 'center'
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText primary="로그아웃" />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* 앱바 (모바일) */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {currentPageTitle}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* 사이드바 */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          width: currentDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            borderRight: `1px solid ${theme.palette.divider}`,
            ...(isMobile && {
              width: drawerWidth
            })
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ...(isMobile && {
            mt: 8 // AppBar 높이만큼 마진
          })
        }}
      >
        {/* 헤더 (데스크톱) */}
        {!isMobile && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h4" fontWeight="medium">
                {currentPageTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                관리자님 환영합니다
              </Typography>
            </Box>
          </Paper>
        )}

        {/* 페이지 컨텐츠 */}
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'grey.50' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
