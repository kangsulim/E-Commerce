import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useAuth, useIsAdmin } from '../../hooks/useAuth';
import { useCartItemCount } from '../../hooks/useCart';
import SearchBar from '../search/SearchBar';
import CartDropdown from '../cart/CartDropdown';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [cartAnchor, setCartAnchor] = useState<null | HTMLElement>(null);
  
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const cartItemCount = useCartItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setUserMenuAnchor(null);
  };

  const handleSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setIsMenuOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // 장바구니 드롭다운 열기/닫기
  const handleCartOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchor(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchor(null);
  };

  const navigationItems = [
    { label: '홈', path: '/', icon: <HomeIcon /> },
    { label: '상품', path: '/products', icon: <StoreIcon /> },
    ...(isAuthenticated ? [{ label: '장바구니', path: '/cart', icon: <CartIcon /> }] : []),
    ...(isAdmin ? [{ label: '관리자', path: '/admin', icon: <AdminIcon /> }] : [])
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {/* 로고 */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                textDecoration: 'none',
                flexShrink: 0,
                mr: 4,
                '&:hover': {
                  color: theme.palette.primary.dark
                }
              }}
            >
              {import.meta.env.VITE_APP_NAME || '온라인 쇼핑몰'}
            </Typography>

            {/* 중앙 검색바 (데스크톱) */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 4 }}>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="상품명, 브랜드명으로 검색"
                  className="w-full"
                  showSuggestions={true}
                />
              </Box>
            )}

            {/* 네비게이션 (데스크톱) */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 'medium',
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.04)
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

            {/* 우측 메뉴 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* 모바일 검색 버튼 */}
              {isMobile && (
                <IconButton
                  component={Link}
                  to="/products"
                  sx={{ color: 'text.primary' }}
                >
                  <SearchIcon />
                </IconButton>
              )}

              {/* 장바구니 아이콘 (항상 표시) */}
              {!isMobile && (
                <IconButton
                  onClick={handleCartOpen}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <Badge 
                    badgeContent={cartItemCount} 
                    color="primary"
                    max={99}
                  >
                    <CartIcon />
                  </Badge>
                </IconButton>
              )}

              {/* 모바일 장바구니 (링크) */}
              {isMobile && (
                <IconButton
                  component={Link}
                  to="/cart"
                  sx={{ color: 'text.primary' }}
                >
                  <Badge 
                    badgeContent={cartItemCount} 
                    color="primary"
                    max={99}
                  >
                    <CartIcon />
                  </Badge>
                </IconButton>
              )}

              {/* 사용자 메뉴 */}
              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem'
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        안녕하세요, {user?.name}님
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      component={Link}
                      to="/my-page"
                      onClick={handleUserMenuClose}
                    >
                      <ListItemIcon>
                        <AccountIcon />
                      </ListItemIcon>
                      마이페이지
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem
                        component={Link}
                        to="/admin"
                        onClick={handleUserMenuClose}
                      >
                        <ListItemIcon>
                          <AdminIcon />
                        </ListItemIcon>
                        관리자
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      로그아웃
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    sx={{
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    로그인
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'medium',
                      borderRadius: 2
                    }}
                  >
                    회원가입
                  </Button>
                </Box>
              )}

              {/* 모바일 메뉴 버튼 */}
              {isMobile && (
                <IconButton
                  onClick={() => setIsMenuOpen(true)}
                  sx={{ ml: 1, color: 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>

          {/* 모바일 검색바 */}
          {isMobile && (
            <Box sx={{ pb: 2, px: 2 }}>
              <SearchBar
                onSearch={handleSearch}
                placeholder="상품 검색"
                className="w-full"
                showSuggestions={false}
              />
            </Box>
          )}
        </Container>
      </AppBar>

      {/* 장바구니 드롭다운 (데스크톱만) */}
      {!isMobile && (
        <CartDropdown
          anchorEl={cartAnchor}
          open={Boolean(cartAnchor)}
          onClose={handleCartClose}
        />
      )}

      {/* 모바일 드로어 메뉴 */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 2
          }
        }}
      >
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            메뉴
          </Typography>
        </Box>
        <Divider />
        
        <List>
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              sx={{
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.label === '장바구니' && cartItemCount > 0 && (
                <Badge 
                  badgeContent={cartItemCount} 
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* 모바일 사용자 메뉴 */}
        <List>
          {isAuthenticated ? (
            <>
              <ListItem>
                <ListItemIcon>
                  <Avatar 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.75rem'
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={`${user?.name}님`}
                  secondary="안녕하세요!"
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/my-page"
                onClick={() => setIsMenuOpen(false)}
              >
                <ListItemIcon>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText primary="마이페이지" />
              </ListItem>
              <ListItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="로그아웃" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                component={Link}
                to="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="로그인" />
              </ListItem>
              <ListItem
                component={Link}
                to="/register"
                onClick={() => setIsMenuOpen(false)}
              >
                <ListItemIcon>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText primary="회원가입" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
