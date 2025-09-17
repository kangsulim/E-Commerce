import React from 'react';
import { Box, Grid2, Typography, Stack } from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import { Product } from '../../data/mockProducts';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/ProductSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading = false, 
  className = '' 
}) => {
  if (isLoading) {
    // 로딩 스켈레톤 표시
    return <ProductGridSkeleton className={className} />;
  }

  if (products.length === 0) {
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center'
        }}
      >
        <InventoryIcon 
          sx={{ 
            fontSize: 80, 
            color: 'text.disabled', 
            mb: 2 
          }} 
        />
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 1 }}>
          상품이 없습니다
        </Typography>
        <Typography variant="body1" color="text.secondary">
          검색 조건을 변경하거나 다른 카테고리를 확인해보세요.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid2 
      container 
      spacing={3} 
      className={className}
    >
      {products.map((product) => (
        <Grid2 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3} 
          key={product.id}
          sx={{ display: 'flex' }}
        >
          <ProductCard 
            product={product}
            className="w-full"
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductGrid;
