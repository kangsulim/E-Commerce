import { Product } from '../types';

/**
 * mockProducts의 Product 타입을 types/index.ts의 Product 타입으로 변환
 */
export const convertMockProductToProduct = (mockProd: any): Product => {
  return {
    id: mockProd.id,
    name: mockProd.name,
    description: mockProd.description,
    price: mockProd.price,
    stockQuantity: mockProd.stockQuantity,
    imageUrl: mockProd.images?.[0] || '',
    category: {
      id: mockProd.categoryId || 0,
      name: mockProd.category || 'Unknown',
    },
    createdAt: mockProd.createdAt,
    updatedAt: mockProd.updatedAt,
  };
};
