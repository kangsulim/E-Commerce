import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box className={className}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* 현재 표시 중인 항목 정보 */}
        <Typography variant="body2" color="text.secondary">
          <Box component="span" fontWeight="medium">
            {startItem.toLocaleString()}
          </Box>
          {' - '}
          <Box component="span" fontWeight="medium">
            {endItem.toLocaleString()}
          </Box>
          {' / '}
          <Box component="span" fontWeight="medium">
            {totalItems.toLocaleString()}
          </Box>
          개 상품
        </Typography>

        {/* 페이지네이션 */}
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? "medium" : "large"}
          showFirstButton
          showLastButton
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 2}
          sx={{
            '& .MuiPagination-ul': {
              justifyContent: 'center'
            },
            '& .MuiPaginationItem-root': {
              fontWeight: 'medium',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              },
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
              }
            }
          }}
        />
      </Stack>
    </Box>
  );
};

export default Pagination;
