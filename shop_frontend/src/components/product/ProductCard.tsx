import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  Badge,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Product } from '../../data/mockProducts';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const theme = useTheme();
  const discountPrice = product.originalPrice 
    ? product.originalPrice - product.price 
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <Card
      component={Link}
      to={`/products/${product.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
          '& .product-image': {
            transform: 'scale(1.05)'
          }
        }
      }}
    >
      {/* 상품 이미지 */}
      <Box sx={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={product.images[0]}
          alt={product.name}
          className="product-image"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            bgcolor: theme.palette.grey[100]
          }}
        />
        
        {/* 할인 배지 */}
        {product.discount && product.discount > 0 && (
          <Chip
            label={`${product.discount}% OFF`}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: theme.palette.error.main,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          />
        )}
        
        {/* 재고 부족 표시 */}
        {!product.inStock && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: alpha(theme.palette.common.black, 0.7),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              품절
            </Typography>
          </Box>
        )}
        
        {/* 태그들 */}
        {product.tags.length > 0 && (
          <Stack
            spacing={0.5}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8
            }}
          >
            {product.tags.slice(0, 2).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: theme.palette.info.main,
                  color: 'white',
                  fontSize: '0.625rem',
                  height: 20
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* 상품 정보 */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* 카테고리 */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 0.5, display: 'block' }}
        >
          {product.category}
        </Typography>
        
        {/* 상품명 */}
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          sx={{
            mb: 1,
            minHeight: '2.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.25
          }}
        >
          {product.name}
        </Typography>
        
        {/* 평점 및 리뷰 */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating
            value={product.rating}
            readOnly
            size="small"
            precision={0.1}
          />
          <Typography variant="body2" color="text.secondary">
            {product.rating}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            ({product.reviewCount})
          </Typography>
        </Stack>
        
        {/* 가격 정보 */}
        <Box sx={{ mb: 1 }}>
          {product.originalPrice && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Typography
                variant="body2"
                color="text.disabled"
                sx={{ textDecoration: 'line-through' }}
              >
                {formatPrice(product.originalPrice)}원
              </Typography>
              <Typography
                variant="body2"
                color="error.main"
                fontWeight="medium"
              >
                {formatPrice(discountPrice)}원 할인
              </Typography>
            </Stack>
          )}
          <Typography
            variant="h6"
            fontWeight="bold"
            color="text.primary"
          >
            {formatPrice(product.price)}원
          </Typography>
        </Box>
        
        {/* 추가 정보 */}
        <Stack spacing={0.5}>
          {/* 무료배송 표시 */}
          {product.tags.includes('무료배송') && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <ShippingIcon 
                sx={{ 
                  fontSize: 16, 
                  color: theme.palette.success.main 
                }} 
              />
              <Typography
                variant="body2"
                color="success.main"
                fontWeight="medium"
              >
                무료배송
              </Typography>
            </Stack>
          )}
          
          {/* 재고 정보 */}
          {product.inStock && product.stockQuantity <= 5 && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <WarningIcon 
                sx={{ 
                  fontSize: 16, 
                  color: theme.palette.warning.main 
                }} 
              />
              <Typography
                variant="body2"
                color="warning.main"
                fontWeight="medium"
              >
                재고 {product.stockQuantity}개 남음
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
