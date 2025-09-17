import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Box
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <Box className={className} sx={{ py: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.disabled'
          }
        }}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          if (isLast || item.current) {
            return (
              <Typography
                key={index}
                color="text.primary"
                variant="body2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'medium'
                }}
              >
                {isFirst && (
                  <HomeIcon 
                    sx={{ 
                      mr: 0.5, 
                      fontSize: 16 
                    }} 
                  />
                )}
                {item.label}
              </Typography>
            );
          }

          return item.href ? (
            <MuiLink
              key={index}
              component={Link}
              to={item.href}
              underline="hover"
              color="text.secondary"
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {isFirst && (
                <HomeIcon 
                  sx={{ 
                    mr: 0.5, 
                    fontSize: 16 
                  }} 
                />
              )}
              {item.label}
            </MuiLink>
          ) : (
            <Typography
              key={index}
              color="text.secondary"
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isFirst && (
                <HomeIcon 
                  sx={{ 
                    mr: 0.5, 
                    fontSize: 16 
                  }} 
                />
              )}
              {item.label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
