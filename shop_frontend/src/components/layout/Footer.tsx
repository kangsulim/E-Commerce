import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid2,
  Typography,
  Link as MuiLink,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.grey[900],
        color: 'white',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          {/* 회사 정보 */}
          <Grid2 xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              {import.meta.env.VITE_APP_NAME || '온라인 쇼핑몰'}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.grey[300], mb: 3, lineHeight: 1.6 }}
            >
              최고의 품질과 서비스로 고객 만족을 위해 노력하는 온라인 쇼핑몰입니다.
            </Typography>
            <Stack spacing={1} sx={{ color: theme.palette.grey[400] }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">
                  고객센터: 1588-1234
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" />
                <Typography variant="body2">
                  이메일: support@shop.com
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ScheduleIcon fontSize="small" />
                <Typography variant="body2">
                  운영시간: 평일 09:00-18:00
                </Typography>
              </Stack>
            </Stack>
          </Grid2>

          {/* 바로가기 */}
          <Grid2 xs={6} md={3}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              바로가기
            </Typography>
            <Stack spacing={1}>
              {[
                { label: '홈', path: '/' },
                { label: '전체상품', path: '/products' },
                { label: '장바구니', path: '/cart' },
                { label: '주문내역', path: '/orders' }
              ].map((item) => (
                <MuiLink
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="body2"
                  sx={{
                    color: theme.palette.grey[300],
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid2>

          {/* 고객지원 */}
          <Grid2 xs={6} md={3}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              고객지원
            </Typography>
            <Stack spacing={1}>
              {[
                '공지사항',
                '자주묻는질문',
                '배송안내',
                '반품/교환'
              ].map((item) => (
                <MuiLink
                  key={item}
                  href="#"
                  variant="body2"
                  sx={{
                    color: theme.palette.grey[300],
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {item}
                </MuiLink>
              ))}
            </Stack>
          </Grid2>
        </Grid2>

        <Divider sx={{ my: 4, borderColor: theme.palette.grey[700] }} />

        <Box textAlign="center">
          <Typography
            variant="body2"
            sx={{ color: theme.palette.grey[400], mb: 1 }}
          >
            &copy; 2024 {import.meta.env.VITE_APP_NAME || '온라인 쇼핑몰'}. All rights reserved.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ flexWrap: 'wrap' }}
          >
            {[
              '개인정보처리방침',
              '이용약관',
              '사업자정보'
            ].map((item) => (
              <MuiLink
                key={item}
                href="#"
                variant="body2"
                sx={{
                  color: theme.palette.grey[400],
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline'
                  }
                }}
              >
                {item}
              </MuiLink>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
