import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Grid2
} from '@mui/material';

interface ProductSkeletonProps {
  className?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ className = '' }) => {
  return (
    <Card className={className} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 이미지 스켈레톤 */}
      <Skeleton 
        variant="rectangular" 
        sx={{ aspectRatio: '1', width: '100%' }}
        animation="wave"
      />
      
      {/* 콘텐츠 스켈레톤 */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1.5}>
          {/* 카테고리 */}
          <Skeleton variant="text" width={64} height={16} />
          
          {/* 상품명 (2줄) */}
          <Stack spacing={0.5}>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="75%" height={20} />
          </Stack>
          
          {/* 평점 및 리뷰 */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={32} height={16} />
            <Skeleton variant="text" width={48} height={16} />
          </Stack>
          
          {/* 가격 정보 */}
          <Stack spacing={0.5}>
            <Skeleton variant="text" width={96} height={16} />
            <Skeleton variant="text" width={128} height={24} />
          </Stack>
          
          {/* 배송 정보 */}
          <Skeleton variant="text" width={80} height={16} />
        </Stack>
      </CardContent>
    </Card>
  );
};

// 그리드 스켈레톤 (여러 개의 ProductSkeleton 표시)
interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ 
  count = 8, 
  className = '' 
}) => {
  return (
    <Grid2 container spacing={3} className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid2 xs={12} sm={6} md={4} lg={3} key={index}>
          <ProductSkeleton />
        </Grid2>
      ))}
    </Grid2>
  );
};

// 리스트 형태 스켈레톤
export const ProductListSkeleton: React.FC<ProductGridSkeletonProps> = ({ 
  count = 5, 
  className = '' 
}) => {
  return (
    <Stack spacing={3} className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <Box sx={{ display: 'flex' }}>
            {/* 이미지 */}
            <Skeleton 
              variant="rectangular" 
              width={192} 
              height={192}
              sx={{ flexShrink: 0 }}
            />
            
            {/* 콘텐츠 */}
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack spacing={2}>
                {/* 카테고리 */}
                <Skeleton variant="text" width={80} height={16} />
                
                {/* 상품명 */}
                <Stack spacing={1}>
                  <Skeleton variant="text" width="75%" height={24} />
                  <Skeleton variant="text" width="50%" height={16} />
                </Stack>
                
                {/* 평점 */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton variant="text" width={96} height={16} />
                  <Skeleton variant="text" width={64} height={16} />
                </Stack>
                
                {/* 가격 */}
                <Stack spacing={1}>
                  <Skeleton variant="text" width={128} height={16} />
                  <Skeleton variant="text" width={160} height={32} />
                </Stack>
              </Stack>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Stack>
  );
};

export default ProductSkeleton;
