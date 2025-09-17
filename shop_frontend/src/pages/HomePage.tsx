import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid2,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Avatar,
  Rating,
  Chip,
  Paper,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Diamond as DiamondIcon,
  Security as SecurityIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryPreview, { SpecialCategoryBanner } from '../components/home/CategoryPreview';
import SearchBar from '../components/search/SearchBar';

const HomePage: React.FC = () => {
  const theme = useTheme();

  const handleSearch = (query: string) => {
    // 검색 처리는 SearchBar 컴포넌트 내부에서 자동으로 처리됨
  };

  return (
    <Box>
      {/* 히어로 섹션 */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '60vh'
        }}
      >
        {/* 배경 패턴 */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              border: '2px solid white',
              borderRadius: '50%'
            },
            '&::before': {
              top: 40,
              left: 40,
              width: 80,
              height: 80
            },
            '&::after': {
              top: 128,
              right: 80,
              width: 64,
              height: 64
            }
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', py: 10 }}>
          <Box textAlign="center">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 3,
                lineHeight: 1.2
              }}
            >
              최고의 쇼핑 경험을<br />
              <Box component="span" sx={{ color: theme.palette.warning.main }}>
                만나보세요
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: alpha(theme.palette.common.white, 0.9),
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              다양한 상품과 빠른 배송으로 새로운 쇼핑의 즐거움을 선사합니다
            </Typography>

            {/* 히어로 검색바 */}
            <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
              <SearchBar
                onSearch={handleSearch}
                placeholder="어떤 상품을 찾고 계신가요?"
                className="w-full"
                showSuggestions={true}
              />
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 8 }}
            >
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.9),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                상품 둘러보기
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                회원가입하고 혜택받기
              </Button>
            </Stack>

            {/* 통계 정보 */}
            <Box sx={{ pt: 8, borderTop: `1px solid ${alpha(theme.palette.common.white, 0.3)}` }}>
              <Grid2 container spacing={4} justifyContent="center">
                <Grid2 xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    10,000+
                  </Typography>
                  <Typography sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                    등록된 상품
                  </Typography>
                </Grid2>
                <Grid2 xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    50,000+
                  </Typography>
                  <Typography sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                    만족한 고객
                  </Typography>
                </Grid2>
                <Grid2 xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    24시간
                  </Typography>
                  <Typography sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                    빠른 배송
                  </Typography>
                </Grid2>
              </Grid2>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 특별 카테고리 배너 */}
      <Box sx={{ py: 8, bgcolor: theme.palette.grey[50] }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              🎉 특별 기획전
            </Typography>
            <Typography variant="h6" color="text.secondary">
              한정 기간 특가 혜택을 놓치지 마세요
            </Typography>
          </Box>
          <SpecialCategoryBanner />
        </Container>
      </Box>

      {/* 인기 카테고리 */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <CategoryPreview 
            layout="grid" 
            showProductCount={true}
            maxCategories={6}
          />
        </Container>
      </Box>

      {/* 추천 상품들 */}
      <Box sx={{ py: 8, bgcolor: theme.palette.grey[50] }}>
        <Container maxWidth="lg">
          <FeaturedProducts />
        </Container>
      </Box>

      {/* 특징 섹션 */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 6 }}>
            왜 우리를 선택해야 할까요?
          </Typography>
          <Grid2 container spacing={4}>
            {[
              {
                icon: <ShippingIcon sx={{ fontSize: 40 }} />,
                title: '빠른 배송',
                description: '주문 후 24시간 내 배송 시작으로\n빠르게 받아보세요',
                detail: '평균 배송시간: 1-2일',
                color: theme.palette.info.main
              },
              {
                icon: <DiamondIcon sx={{ fontSize: 40 }} />,
                title: '품질 보장',
                description: '엄선된 상품만을 취급하여\n최고의 품질을 보장합니다',
                detail: '품질 불만족시 100% 환불',
                color: theme.palette.success.main
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                title: '안전한 결제',
                description: '다양한 결제 수단과 보안 시스템으로\n안전하게 쇼핑하세요',
                detail: 'SSL 암호화 보안',
                color: theme.palette.secondary.main
              }
            ].map((feature, index) => (
              <Grid2 xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha(feature.color, 0.1),
                      color: feature.color,
                      mb: 3
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                    {feature.description}
                  </Typography>
                  <Chip
                    label={feature.detail}
                    sx={{
                      bgcolor: alpha(feature.color, 0.1),
                      color: feature.color,
                      fontWeight: 'medium'
                    }}
                  />
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      {/* 고객 후기 섹션 */}
      <Box sx={{ py: 8, bgcolor: theme.palette.grey[900], color: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              💬 고객 후기
            </Typography>
            <Typography variant="h6" sx={{ color: theme.palette.grey[300] }}>
              실제 고객들의 생생한 후기를 확인해보세요
            </Typography>
          </Box>

          <Grid2 container spacing={4}>
            {[
              {
                name: "김민수",
                rating: 5,
                comment: "배송이 정말 빠르고 상품 품질도 만족스러워요. 다음에도 이용할 예정입니다!",
                product: "iPhone 15 Pro Max"
              },
              {
                name: "이하영",
                rating: 5,
                comment: "가격도 합리적이고 고객서비스도 친절해서 좋았습니다. 추천해요!",
                product: "나이키 에어 맥스"
              },
              {
                name: "박준호",
                rating: 4,
                comment: "다양한 상품이 있어서 원하는 걸 쉽게 찾을 수 있었어요. 만족합니다.",
                product: "맥북 에어 M3"
              }
            ].map((review, index) => (
              <Grid2 xs={12} md={4} key={index}>
                <Card
                  sx={{
                    bgcolor: theme.palette.grey[800],
                    color: 'white',
                    height: '100%',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: theme.palette.grey[700]
                    }
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {review.name[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="bold">{review.name}</Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                    </Stack>
                    <Typography sx={{ color: theme.palette.grey[300], mb: 2, fontStyle: 'italic' }}>
                      "{review.comment}"
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.info.light }}>
                      구매 상품: {review.product}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      {/* CTA 섹션 */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            🎁 지금 바로 시작하세요!
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: alpha(theme.palette.common.white, 0.9) }}>
            회원가입하고{' '}
            <Box component="span" sx={{ color: theme.palette.warning.main, fontWeight: 'bold' }}>
              10% 할인 쿠폰
            </Box>
            과{' '}
            <Box component="span" sx={{ color: theme.palette.warning.main, fontWeight: 'bold' }}>
              무료배송
            </Box>
            {' '}혜택을 받아보세요
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.9),
                  transform: 'scale(1.05)'
                }
              }}
            >
              무료 회원가입
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  transform: 'scale(1.05)'
                }
              }}
            >
              상품 둘러보기
            </Button>
          </Stack>

          <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
            이미 회원이신가요?{' '}
            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{
                color: theme.palette.warning.main,
                textDecoration: 'underline',
                p: 0,
                minWidth: 'auto',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              로그인하기
            </Button>
          </Typography>
        </Container>
      </Box>

      {/* 뉴스레터 구독 섹션 */}
      <Box sx={{ py: 6, bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg">
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              📧 최신 소식 받아보기
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              신상품 출시, 특별 할인 소식을 가장 먼저 받아보세요
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
            >
              <TextField
                fullWidth
                placeholder="이메일 주소를 입력하세요"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                sx={{ px: 3, whiteSpace: 'nowrap' }}
              >
                구독
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              언제든지 구독을 취소할 수 있습니다. 개인정보는 안전하게 보호됩니다.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
