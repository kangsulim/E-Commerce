import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  Button,
  Popper,
  ClickAwayListener,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon,
  DeleteSweep as DeleteIcon
} from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '상품명, 브랜드명으로 검색해보세요',
  className = '',
  onSearch,
  showSuggestions = true
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // 인기 검색어 (실제로는 API에서 가져와야 함)
  const popularSearches = [
    'iPhone', 'MacBook', '에어팟', '나이키', '유니클로', 
    '설화수', '다이슨', '요가매트', '아토미 해빗', 'LG'
  ];

  // 최근 검색어 (localStorage에서 관리)
  const getRecentSearches = useCallback(() => {
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    try {
      const recent = getRecentSearches();
      const updated = [
        searchQuery,
        ...recent.filter((item: string) => item !== searchQuery)
      ].slice(0, 10); // 최대 10개까지만 저장
      
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // localStorage 사용 불가시 무시
    }
  }, [getRecentSearches]);

  const handleSearch = useCallback((searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      saveRecentSearch(trimmedQuery);
      
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        // 기본 동작: 상품 목록 페이지로 이동
        navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      }
    }
    
    setShowDropdown(false);
  }, [navigate, onSearch, saveRecentSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(e.currentTarget);
    if (showSuggestions) {
      setShowDropdown(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem('recentSearches');
      setShowDropdown(false);
    } catch {
      // localStorage 사용 불가시 무시
    }
  };

  const handleClickAway = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };

  const recentSearches = getRecentSearches();

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box className={className} sx={{ position: 'relative' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ position: 'relative' }}
        >
          <TextField
            fullWidth
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={0.5}>
                    {query && (
                      <IconButton
                        size="small"
                        onClick={() => setQuery('')}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      type="submit"
                      size="small"
                      color="primary"
                      edge="end"
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: theme.shadows[2]
                },
                '&.Mui-focused': {
                  boxShadow: theme.shadows[4]
                }
              }
            }}
          />
        </Box>

        {/* 검색 제안 드롭다운 */}
        {showDropdown && showSuggestions && anchorEl && (
          <Popper
            open={showDropdown}
            anchorEl={anchorEl}
            placement="bottom-start"
            sx={{ 
              width: anchorEl.offsetWidth,
              zIndex: theme.zIndex.modal,
              mt: 1
            }}
          >
            <Paper
              elevation={8}
              sx={{
                maxHeight: 400,
                overflow: 'auto',
                borderRadius: 2
              }}
            >
              {/* 최근 검색어 */}
              {recentSearches.length > 0 && (
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <HistoryIcon fontSize="small" color="action" />
                      <Typography variant="subtitle2" color="text.secondary">
                        최근 검색어
                      </Typography>
                    </Stack>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon fontSize="small" />}
                      onClick={clearRecentSearches}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      전체 삭제
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {recentSearches.slice(0, 5).map((item: string, index: number) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        variant="outlined"
                        onClick={() => handleSuggestionClick(item)}
                        sx={{
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderColor: 'primary.main'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {recentSearches.length > 0 && <Divider />}

              {/* 인기 검색어 */}
              <Box sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <TrendingIcon fontSize="small" color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    인기 검색어
                  </Typography>
                </Stack>
                <List dense sx={{ py: 0 }}>
                  {popularSearches.map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        onClick={() => handleSuggestionClick(item)}
                        sx={{
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: 24,
                            mr: 2,
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="primary.main"
                            fontWeight="bold"
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: 'body2'
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* 현재 입력값과 일치하는 제안 */}
              {query.trim() && (
                <>
                  <Divider />
                  <Box sx={{ p: 1 }}>
                    <ListItemButton
                      onClick={() => handleSuggestionClick(query)}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <SearchIcon 
                        fontSize="small" 
                        color="action" 
                        sx={{ mr: 2 }} 
                      />
                      <Typography variant="body2">
                        '{query}' 검색
                      </Typography>
                    </ListItemButton>
                  </Box>
                </>
              )}
            </Paper>
          </Popper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
