export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  categoryId: number;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  productCount: number;
}

// 카테고리 Mock 데이터
export const mockCategories: Category[] = [
  {
    id: 1,
    name: '전자제품',
    slug: 'electronics',
    description: '최신 전자기기 및 액세서리',
    imageUrl: 'https://via.placeholder.com/300x200?text=Electronics',
    productCount: 25
  },
  {
    id: 2,
    name: '의류',
    slug: 'clothing',
    description: '패션 의류 및 액세서리',
    imageUrl: 'https://via.placeholder.com/300x200?text=Clothing',
    productCount: 32
  },
  {
    id: 3,
    name: '가전제품',
    slug: 'appliances',
    description: '생활 가전 및 주방용품',
    imageUrl: 'https://via.placeholder.com/300x200?text=Appliances',
    productCount: 18
  },
  {
    id: 4,
    name: '도서',
    slug: 'books',
    description: '다양한 장르의 도서',
    imageUrl: 'https://via.placeholder.com/300x200?text=Books',
    productCount: 45
  },
  {
    id: 5,
    name: '스포츠',
    slug: 'sports',
    description: '운동용품 및 스포츠 장비',
    imageUrl: 'https://via.placeholder.com/300x200?text=Sports',
    productCount: 22
  },
  {
    id: 6,
    name: '뷰티',
    slug: 'beauty',
    description: '화장품 및 뷰티 용품',
    imageUrl: 'https://via.placeholder.com/300x200?text=Beauty',
    productCount: 38
  }
];

// 상품 Mock 데이터
export const mockProducts: Product[] = [
  // 전자제품
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: '가장 진보된 iPhone으로 티타늄 디자인과 A17 Pro 칩을 탑재했습니다.',
    price: 1490000,
    originalPrice: 1590000,
    discount: 6,
    category: '전자제품',
    categoryId: 1,
    images: [
      'https://via.placeholder.com/600x600?text=iPhone+15+Pro+Max+1',
      'https://via.placeholder.com/600x600?text=iPhone+15+Pro+Max+2',
      'https://via.placeholder.com/600x600?text=iPhone+15+Pro+Max+3'
    ],
    rating: 4.8,
    reviewCount: 324,
    inStock: true,
    stockQuantity: 15,
    tags: ['신제품', '베스트셀러', '무료배송'],
    specifications: {
      '화면 크기': '6.7인치',
      '저장 용량': '256GB',
      '색상': '내추럴 티타늄',
      '무게': '221g'
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    description: 'M3 칩으로 더욱 강력해진 MacBook Air입니다.',
    price: 1590000,
    category: '전자제품',
    categoryId: 1,
    images: [
      'https://via.placeholder.com/600x600?text=MacBook+Air+M3+1',
      'https://via.placeholder.com/600x600?text=MacBook+Air+M3+2'
    ],
    rating: 4.9,
    reviewCount: 178,
    inStock: true,
    stockQuantity: 8,
    tags: ['신제품', '무료배송'],
    specifications: {
      '화면 크기': '13.6인치',
      '프로세서': 'M3',
      '메모리': '8GB',
      '저장공간': '256GB SSD'
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    name: 'AirPods Pro 3세대',
    description: '공간 음향과 적응형 투명 모드를 지원하는 무선 이어폰입니다.',
    price: 359000,
    originalPrice: 389000,
    discount: 8,
    category: '전자제품',
    categoryId: 1,
    images: [
      'https://via.placeholder.com/600x600?text=AirPods+Pro+3+1',
      'https://via.placeholder.com/600x600?text=AirPods+Pro+3+2'
    ],
    rating: 4.7,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 25,
    tags: ['베스트셀러', '무료배송'],
    specifications: {
      '배터리 수명': '최대 6시간',
      '케이스 포함': '최대 30시간',
      '무게': '5.3g (각 이어폰)'
    },
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15'
  },

  // 의류
  {
    id: 4,
    name: '유니클로 히트텍 울트라 따뜻한 크루넥 긴팔T',
    description: '발열, 보온, 정전기 방지 기능의 초극세섬유 히트텍입니다.',
    price: 19900,
    category: '의류',
    categoryId: 2,
    images: [
      'https://via.placeholder.com/600x600?text=Heattech+Long+Sleeve+1',
      'https://via.placeholder.com/600x600?text=Heattech+Long+Sleeve+2'
    ],
    rating: 4.5,
    reviewCount: 1247,
    inStock: true,
    stockQuantity: 50,
    tags: ['겨울용품', '베스트셀러'],
    specifications: {
      '소재': '레이온 52%, 폴리에스터 34%, 아크릴 12%, 폴리우레탄 2%',
      '사이즈': 'S, M, L, XL',
      '색상': '블랙, 화이트, 그레이'
    },
    createdAt: '2023-12-01',
    updatedAt: '2024-01-10'
  },
  {
    id: 5,
    name: '나이키 에어 맥스 270',
    description: '270도 뷰 Max Air 유닛으로 최고의 쿠셔닝을 제공합니다.',
    price: 179000,
    originalPrice: 199000,
    discount: 10,
    category: '의류',
    categoryId: 2,
    images: [
      'https://via.placeholder.com/600x600?text=Nike+Air+Max+270+1',
      'https://via.placeholder.com/600x600?text=Nike+Air+Max+270+2'
    ],
    rating: 4.6,
    reviewCount: 456,
    inStock: true,
    stockQuantity: 12,
    tags: ['운동화', '할인상품'],
    specifications: {
      '브랜드': '나이키',
      '사이즈': '230-290mm',
      '색상': '블랙/화이트'
    },
    createdAt: '2023-11-20',
    updatedAt: '2024-01-05'
  },

  // 가전제품
  {
    id: 6,
    name: 'LG 오브제컬렉션 정수기',
    description: '직수형 정수기로 깨끗하고 시원한 물을 언제든지 마실 수 있습니다.',
    price: 589000,
    category: '가전제품',
    categoryId: 3,
    images: [
      'https://via.placeholder.com/600x600?text=LG+Water+Purifier+1',
      'https://via.placeholder.com/600x600?text=LG+Water+Purifier+2'
    ],
    rating: 4.4,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 5,
    tags: ['생활가전', '무료설치'],
    specifications: {
      '용량': '3.2L',
      '필터': '4단계 정수',
      '기능': '냉수, 온수, 정수'
    },
    createdAt: '2023-12-15',
    updatedAt: '2024-01-12'
  },
  {
    id: 7,
    name: '다이슨 V15 무선청소기',
    description: '레이저 더스트 디텍션과 LCD 화면으로 과학적 청소가 가능합니다.',
    price: 899000,
    originalPrice: 999000,
    discount: 10,
    category: '가전제품',
    categoryId: 3,
    images: [
      'https://via.placeholder.com/600x600?text=Dyson+V15+1',
      'https://via.placeholder.com/600x600?text=Dyson+V15+2'
    ],
    rating: 4.8,
    reviewCount: 567,
    inStock: true,
    stockQuantity: 3,
    tags: ['프리미엄', '할인상품'],
    specifications: {
      '사용시간': '최대 60분',
      '무게': '3.05kg',
      '브러시': '7가지 포함'
    },
    createdAt: '2023-11-30',
    updatedAt: '2024-01-08'
  },

  // 도서
  {
    id: 8,
    name: '아토미 해빗',
    description: '작은 변화가 만드는 큰 차이에 대한 실용적인 습관 형성 가이드입니다.',
    price: 16200,
    originalPrice: 18000,
    discount: 10,
    category: '도서',
    categoryId: 4,
    images: [
      'https://via.placeholder.com/600x600?text=Atomic+Habits+1',
      'https://via.placeholder.com/600x600?text=Atomic+Habits+2'
    ],
    rating: 4.9,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 100,
    tags: ['베스트셀러', '자기계발'],
    specifications: {
      '저자': '제임스 클리어',
      '출판사': '비즈니스북스',
      '페이지': '424쪽',
      '언어': '한국어'
    },
    createdAt: '2023-10-01',
    updatedAt: '2024-01-01'
  },

  // 스포츠
  {
    id: 9,
    name: '요가매트 NBR 10mm',
    description: '두께 10mm의 쿠션감으로 편안한 요가와 운동이 가능합니다.',
    price: 29900,
    category: '스포츠',
    categoryId: 5,
    images: [
      'https://via.placeholder.com/600x600?text=Yoga+Mat+1',
      'https://via.placeholder.com/600x600?text=Yoga+Mat+2'
    ],
    rating: 4.3,
    reviewCount: 145,
    inStock: true,
    stockQuantity: 30,
    tags: ['운동용품', '홈트레이닝'],
    specifications: {
      '크기': '183cm x 61cm',
      '두께': '10mm',
      '소재': 'NBR',
      '색상': '퍼플, 핑크, 블루'
    },
    createdAt: '2023-12-20',
    updatedAt: '2024-01-14'
  },

  // 뷰티
  {
    id: 10,
    name: '설화수 자음생 크림',
    description: '한국 전통 처방으로 피부에 생기와 윤기를 선사하는 안티에이징 크림입니다.',
    price: 187000,
    category: '뷰티',
    categoryId: 6,
    images: [
      'https://via.placeholder.com/600x600?text=Sulwhasoo+Cream+1',
      'https://via.placeholder.com/600x600?text=Sulwhasoo+Cream+2'
    ],
    rating: 4.7,
    reviewCount: 678,
    inStock: true,
    stockQuantity: 8,
    tags: ['프리미엄', '한국화장품'],
    specifications: {
      '용량': '50ml',
      '성분': '자음단™, 홍삼',
      '피부타입': '모든 피부타입'
    },
    createdAt: '2023-11-15',
    updatedAt: '2024-01-06'
  },

  // 추가 상품들 (더 많은 데이터를 위해)
  {
    id: 11,
    name: 'Galaxy S24 Ultra',
    description: 'AI가 탑재된 갤럭시 최고 사양의 스마트폰입니다.',
    price: 1398000,
    originalPrice: 1498000,
    discount: 7,
    category: '전자제품',
    categoryId: 1,
    images: [
      'https://via.placeholder.com/600x600?text=Galaxy+S24+Ultra+1',
      'https://via.placeholder.com/600x600?text=Galaxy+S24+Ultra+2'
    ],
    rating: 4.6,
    reviewCount: 289,
    inStock: true,
    stockQuantity: 18,
    tags: ['신제품', '할인상품'],
    createdAt: '2024-01-25',
    updatedAt: '2024-01-30'
  },
  {
    id: 12,
    name: '무인양품 옥스포드 셔츠',
    description: '심플하고 편안한 일상 셔츠입니다.',
    price: 39900,
    category: '의류',
    categoryId: 2,
    images: [
      'https://via.placeholder.com/600x600?text=MUJI+Oxford+Shirt+1'
    ],
    rating: 4.4,
    reviewCount: 167,
    inStock: true,
    stockQuantity: 25,
    tags: ['기본템'],
    createdAt: '2023-12-05',
    updatedAt: '2024-01-03'
  }
];

// 필터링 및 검색을 위한 헬퍼 함수들
export const getProductsByCategory = (categoryId: number): Product[] => {
  return mockProducts.filter(product => product.categoryId === categoryId);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProductsByPriceRange = (minPrice: number, maxPrice: number): Product[] => {
  return mockProducts.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};

export const getFeaturedProducts = (limit: number = 8): Product[] => {
  return mockProducts
    .filter(product => product.tags.includes('베스트셀러') || product.rating >= 4.5)
    .slice(0, limit);
};

export const getDiscountedProducts = (limit: number = 6): Product[] => {
  return mockProducts
    .filter(product => product.discount && product.discount > 0)
    .slice(0, limit);
};

// 정렬 옵션
export type SortOption = 'popular' | 'price-low' | 'price-high' | 'rating' | 'newest';

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  switch (sortBy) {
    case 'popular':
      return [...products].sort((a, b) => b.reviewCount - a.reviewCount);
    case 'price-low':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price-high':
      return [...products].sort((a, b) => b.price - a.price);
    case 'rating':
      return [...products].sort((a, b) => b.rating - a.rating);
    case 'newest':
      return [...products].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    default:
      return products;
  }
};
