import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid2,
  Typography,
  Button,
  Paper,
  Tab,
  Tabs,
  Chip,
  Rating,
  IconButton,
  Stack,
  Divider,
  Alert,
  Skeleton,
  useTheme,
  alpha,
  ButtonGroup,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  ShoppingBag as BuyIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon,
  Inventory as OutOfStockIcon,
  CheckCircle as InStockIcon,
  SentimentDissatisfied as SadIcon
} from '@mui/icons-material';
import { useProduct, useProducts } from '../hooks/useProducts';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/ProductSkeleton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetailPage: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : 0;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // 상품 데이터 조회
  const { data: product, isLoading, error } = useProduct(productId);
  
  // 관련 상품 조회 (같은 카테고리)
  const { data: relatedProductsData } = useProducts({
    categoryId: product?.categoryId,
    limit: 4
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // 장바구니 추가 로직 (추후 구현)
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // 즉시 구매 로직 (추후 구현)
    alert(`${product.name} ${quantity}개 즉시 구매로 이동합니다.`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
            <SadIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h4" fontWeight="medium" sx={{ mb: 1 }}>
              상품을 찾을 수 없습니다
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              요청하신 상품이 존재하지 않거나 삭제되었습니다.
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
            >
              상품 목록으로 돌아가기
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (isLoading || !product) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* 로딩 스켈레톤 */}
          <Stack spacing={3}>
            {/* 브레드크럼 스켈레톤 */}
            <Skeleton variant="text" width={300} height={24} />
            
            <Paper elevation={1} sx={{ p: 4 }}>
              <Grid2 container spacing={4}>
                {/* 이미지 스켈레톤 */}
                <Grid2 xs={12} lg={6}>
                  <Stack spacing={2}>
                    <Skeleton variant="rectangular" sx={{ aspectRatio: '1', borderRadius: 2 }} />
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} variant="rectangular" sx={{ width: 80, height: 80, borderRadius: 1 }} />
                      ))}
                    </Stack>
                  </Stack>
                </Grid2>
                
                {/* 상품 정보 스켈레톤 */}
                <Grid2 xs={12} lg={6}>
                  <Stack spacing={3}>
                    <Skeleton variant="text" width="75%" height={40} />
                    <Skeleton variant="text" width={150} height={24} />
                    <Skeleton variant="text" width={200} height={48} />
                    <Stack spacing={1}>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Skeleton variant="rectangular" height={48} sx={{ flex: 1, borderRadius: 1 }} />
                      <Skeleton variant="rectangular" height={48} sx={{ flex: 1, borderRadius: 1 }} />
                    </Stack>
                  </Stack>
                </Grid2>
              </Grid2>
            </Paper>
          </Stack>
        </Container>
      </Box>
    );
  }

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    { label: '상품', href: '/products' },
    { label: product.category, href: `/products?category=${product.categoryId}` },
    { label: product.name, current: true }
  ];

  const discountPrice = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercentage = product.discount || 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 브레드크럼 */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* 상품 상세 정보 */}
        <Paper elevation={1} sx={{ overflow: 'hidden', mb: 6 }}>
          <Grid2 container>
            {/* 상품 이미지 */}
            <Grid2 xs={12} lg={6} sx={{ p: 4 }}>
              <ProductImageGallery 
                images={product.images} 
                productName={product.name}
              />
            </Grid2>

            {/* 상품 정보 */}
            <Grid2 xs={12} lg={6} sx={{ p: 4 }}>
              <Stack spacing={3}>
                {/* 카테고리 */}
                <Chip
                  label={product.category}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ alignSelf: 'flex-start' }}
                />

                {/* 상품명 */}
                <Typography variant="h3" fontWeight="bold">
                  {product.name}
                </Typography>

                {/* 평점 및 리뷰 */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Rating
                    value={product.rating}
                    readOnly
                    precision={0.1}
                    size="medium"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {product.rating}
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    ({product.reviewCount}개 리뷰)
                  </Typography>
                </Stack>

                {/* 가격 정보 */}
                <Stack spacing={1}>
                  {product.originalPrice && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography
                        variant="h6"
                        color="text.disabled"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(product.originalPrice)}원
                      </Typography>
                      <Chip
                        label={`${discountPercentage}% 할인`}
                        size="small"
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Stack>
                  )}
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {formatPrice(product.price)}원
                  </Typography>
                  {discountPrice > 0 && (
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      {formatPrice(discountPrice)}원 절약
                    </Typography>
                  )}
                </Stack>

                {/* 재고 상태 */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  {product.inStock ? (
                    <InStockIcon color="success" fontSize="small" />
                  ) : (
                    <OutOfStockIcon color="error" fontSize="small" />
                  )}
                  <Typography
                    variant="body2"
                    color={product.inStock ? 'success.main' : 'error.main'}
                    fontWeight="medium"
                  >
                    {product.inStock 
                      ? `재고 ${product.stockQuantity}개 남음` 
                      : '품절'
                    }
                  </Typography>
                </Stack>

                {/* 태그들 */}
                {product.tags.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {product.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
                      />
                    ))}
                  </Stack>
                )}

                {/* 수량 선택 */}
                {product.inStock && (
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body1" fontWeight="medium">
                        수량:
                      </Typography>
                      <ButtonGroup variant="outlined" size="small">
                        <IconButton
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Box
                          sx={{
                            px: 3,
                            py: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${theme.palette.divider}`,
                            borderLeft: 0,
                            borderRight: 0,
                            minWidth: 60
                          }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {quantity}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.stockQuantity}
                        >
                          <AddIcon />
                        </IconButton>
                      </ButtonGroup>
                    </Stack>

                    {/* 총 가격 */}
                    <Typography variant="h6" fontWeight="medium">
                      총 가격: {formatPrice(product.price * quantity)}원
                    </Typography>
                  </Stack>
                )}

                {/* 구매 버튼들 */}
                <Stack spacing={2}>
                  {product.inStock ? (
                    <>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<CartIcon />}
                        onClick={handleAddToCart}
                        sx={{ py: 1.5 }}
                      >
                        장바구니 담기
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<BuyIcon />}
                        onClick={handleBuyNow}
                        sx={{ py: 1.5 }}
                      >
                        바로 구매
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      disabled
                      sx={{ py: 1.5 }}
                    >
                      품절
                    </Button>
                  )}
                  
                  <Button
                    variant="text"
                    startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteOutlineIcon />}
                    onClick={() => setIsFavorite(!isFavorite)}
                    color={isFavorite ? "error" : "inherit"}
                  >
                    찜하기
                  </Button>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>

          {/* 상품 상세 탭 */}
          <Box>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="product detail tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="상품 설명" />
              <Tab label="상품 정보" />
              <Tab label={`리뷰 (${product.reviewCount})`} />
            </Tabs>

            <TabPanel value={selectedTab} index={0}>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {product.description}
              </Typography>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              {product.specifications ? (
                <TableContainer>
                  <Table>
                    <TableBody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: 'medium', bgcolor: 'grey.50' }}
                          >
                            {key}
                          </TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary">
                  상품 정보가 없습니다.
                </Typography>
              )}
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                  💬
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  리뷰 기능은 추후 구현됩니다.
                </Typography>
              </Box>
            </TabPanel>
          </Box>
        </Paper>

        {/* 관련 상품 */}
        {relatedProductsData && relatedProductsData.products.length > 0 && (
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h4" fontWeight="bold">
                같은 카테고리 상품
              </Typography>
              <Button
                component={Link}
                to={`/products?category=${product.categoryId}`}
                variant="text"
                endIcon="→"
              >
                더 보기
              </Button>
            </Stack>
            
            <Grid2 container spacing={3}>
              {relatedProductsData.products
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Grid2 xs={12} sm={6} md={3} key={relatedProduct.id}>
                    <ProductCard product={relatedProduct} />
                  </Grid2>
                ))
              }
            </Grid2>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
