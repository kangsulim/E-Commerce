# 개발 가이드

## 📋 Phase별 완료 현황

### ✅ Phase 1: 기초 설정 (완료)
- [x] React Query 설정
- [x] Mock 데이터 준비 (12개 상품, 6개 카테고리)
- [x] 라우터에 상품 목록 경로 추가

### ✅ Phase 2: 상품 목록 페이지 (완료)
- [x] ProductCard 컴포넌트
- [x] ProductGrid 컴포넌트
- [x] Pagination 컴포넌트
- [x] ProductSkeleton 컴포넌트
- [x] useProducts Hook
- [x] ProductListPage 구현

### ✅ Phase 3: 상품 상세 페이지 (완료)
- [x] Breadcrumb 컴포넌트
- [x] ProductImageGallery 컴포넌트
- [x] ProductDetailPage 완전 재구현
- [x] 관련 상품 추천 기능

### ✅ Phase 4: 검색 및 필터링 (완료)
- [x] SearchBar 컴포넌트 (자동완성, 최근 검색어)
- [x] CategoryFilter 컴포넌트
- [x] PriceRangeFilter 컴포넌트 (듀얼 슬라이더)
- [x] SortOptions 컴포넌트
- [x] FilterSidebar 컴포넌트 (모바일 모달 포함)
- [x] useProductFilter Hook (URL 동기화)
- [x] Header에 검색바 추가

### ✅ Phase 5: 홈페이지 연동 (완료)
- [x] FeaturedProducts 컴포넌트
- [x] CategoryPreview 컴포넌트
- [x] HomePage 완전 재구현
- [x] 동적 데이터 기반 컨텐츠

### ✅ Phase 6: 최적화 및 마무리 (완료)
- [x] ErrorBoundary 컴포넌트
- [x] Loading 컴포넌트들
- [x] 반응형 디자인 및 CSS 최적화
- [x] README 및 개발 가이드 작성

## 🛠️ 개발 환경 설정

### 1. 프로젝트 실행
```bash
# 프론트엔드 실행
cd shop_frontend
npm run dev

# 백엔드 실행 (별도 터미널)
cd shop_backend
./mvnw spring-boot:run
```

### 2. 개발 도구 설정
- **VS Code Extensions 권장**:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Auto Rename Tag
  - Bracket Pair Colorizer
  - Prettier - Code formatter

## 📁 주요 폴더 및 파일 설명

### Components 구조
```
components/
├── auth/                 # 인증 관련
├── common/              # 공통 컴포넌트
│   ├── Breadcrumb.tsx   # 경로 표시
│   ├── ErrorBoundary.tsx # 에러 처리
│   ├── Loading.tsx      # 로딩 컴포넌트들
│   ├── Pagination.tsx   # 페이지네이션
│   └── ProductSkeleton.tsx # 로딩 스켈레톤
├── filter/              # 필터링 관련
│   ├── CategoryFilter.tsx # 카테고리 필터
│   ├── FilterSidebar.tsx  # 통합 필터 사이드바
│   ├── PriceRangeFilter.tsx # 가격 범위 필터
│   └── SortOptions.tsx    # 정렬 옵션
├── home/               # 홈페이지 관련
│   ├── CategoryPreview.tsx # 카테고리 미리보기
│   └── FeaturedProducts.tsx # 추천 상품
├── layout/             # 레이아웃
├── product/            # 상품 관련
│   ├── ProductCard.tsx     # 상품 카드
│   ├── ProductGrid.tsx     # 상품 그리드
│   └── ProductImageGallery.tsx # 이미지 갤러리
└── search/             # 검색 관련
    └── SearchBar.tsx   # 검색바
```

### Hooks 구조
```
hooks/
├── useAuth.ts          # 인증 관리
├── useProductFilter.ts # 검색/필터 상태 관리
└── useProducts.ts      # 상품 데이터 관리
```

### Pages 구조
```
pages/
├── HomePage.tsx        # 홈페이지
├── ProductListPage.tsx # 상품 목록
├── ProductDetailPage.tsx # 상품 상세
└── admin/             # 관리자 페이지들
```

## 🎯 컴포넌트 사용 가이드

### ProductCard 사용법
```tsx
import ProductCard from '../components/product/ProductCard';

<ProductCard 
  product={product}
  className="h-full" // 선택적
/>
```

### SearchBar 사용법
```tsx
import SearchBar from '../components/search/SearchBar';

<SearchBar
  onSearch={(query) => console.log(query)}
  placeholder="검색어를 입력하세요"
  showSuggestions={true}
  className="w-full"
/>
```

### FilterSidebar 사용법
```tsx
import FilterSidebar from '../components/filter/FilterSidebar';

<FilterSidebar
  filters={filterState}
  onFiltersChange={handleFiltersChange}
  isCollapsible={true}
  showClearButton={true}
/>
```

## 🎨 스타일링 가이드

### 사용 가능한 유틸리티 클래스
```css
/* 애니메이션 */
.animate-fadeIn        /* 페이드인 효과 */
.animate-slideInUp     /* 슬라이드업 효과 */
.hover-lift           /* 호버 시 들어올리기 */
.hover-scale          /* 호버 시 확대 */

/* 버튼 */
.btn-primary          /* 주요 버튼 */
.btn-secondary        /* 보조 버튼 */
.btn-outline          /* 아웃라인 버튼 */

/* 입력 */
.input-field          /* 입력 필드 */

/* 레이아웃 */
.responsive-grid      /* 반응형 그리드 */
.container-padding    /* 반응형 패딩 */
```

### 컴포넌트 스타일 패턴
```tsx
// 기본 패턴
const Component: React.FC<Props> = ({ className = '', ...props }) => {
  return (
    <div className={`기본-클래스들 ${className}`}>
      {/* 내용 */}
    </div>
  );
};
```

## 📱 반응형 디자인 가이드

### 브레이크포인트
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### 반응형 컴포넌트 예시
```tsx
// 그리드 - 모바일 1열, 태블릿 2열, 데스크톱 4열
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// 텍스트 크기 - 모바일에서 작게, 데스크톱에서 크게  
<h1 className="text-2xl md:text-4xl lg:text-6xl">

// 패딩 - 화면 크기에 따라 조정
<div className="px-4 sm:px-6 lg:px-8">
```

## 🔧 상태 관리 가이드

### React Query 사용법
```tsx
// 데이터 조회
const { data, isLoading, error } = useProducts({
  categoryId: 1,
  page: 1,
  limit: 12
});

// 에러 처리
if (error) return <ErrorMessage />;
if (isLoading) return <LoadingSkeleton />;
```

### URL 상태 관리
```tsx
// 필터 상태를 URL과 동기화
const {
  filters,
  setCategory,
  setSearchQuery,
  resetFilters
} = useProductFilter({
  syncWithUrl: true,
  debounceMs: 300
});
```

## 🚀 성능 최적화 팁

### 1. 메모이제이션
```tsx
// 비싼 계산 메모이제이션
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 콜백 메모이제이션
const handleClick = useCallback(() => {
  // 핸들러 로직
}, [dependency]);
```

### 2. 지연 로딩
```tsx
// 컴포넌트 지연 로딩
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 사용 시
<Suspense fallback={<LoadingSkeleton />}>
  <LazyComponent />
</Suspense>
```

### 3. 이미지 최적화
```tsx
// 반응형 이미지
<img
  src={image}
  alt={alt}
  className="w-full h-full object-cover"
  loading="lazy"
/>
```

## 🐛 디버깅 가이드

### 1. React Query 디버깅
```tsx
// React Query DevTools 활성화 (개발 환경)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// App 컴포넌트에 추가
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
```

### 2. 에러 추적
```tsx
// ErrorBoundary에서 에러 로깅
const handleError = (error: Error, errorInfo: ErrorInfo) => {
  console.error('Error:', error);
  // Sentry 등 에러 리포팅 서비스 연동
};
```

## 📋 테스트 체크리스트

### 기능 테스트
- [ ] 상품 목록 로딩 및 표시
- [ ] 검색 기능 (자동완성 포함)
- [ ] 카테고리 필터링
- [ ] 가격 범위 필터링
- [ ] 정렬 기능
- [ ] 페이지네이션
- [ ] 상품 상세 페이지
- [ ] 이미지 갤러리
- [ ] 반응형 디자인

### 브라우저 테스트
- [ ] Chrome (최신)
- [ ] Firefox (최신)
- [ ] Safari (최신)
- [ ] Edge (최신)
- [ ] 모바일 브라우저

### 성능 테스트
- [ ] 초기 로딩 시간 < 3초
- [ ] 검색 반응 시간 < 500ms
- [ ] 페이지 네비게이션 < 1초
- [ ] 이미지 로딩 최적화

## 🔄 배포 가이드

### 1. 빌드
```bash
npm run build
```

### 2. 프리뷰
```bash
npm run preview
```

### 3. 환경별 설정
```bash
# 개발 환경
VITE_API_URL=http://localhost:8080

# 프로덕션 환경  
VITE_API_URL=https://api.example.com
```

## 📞 문제 해결

### 자주 발생하는 문제들

**Q: 검색이 느려요**
A: `useProductFilter`의 `debounceMs` 값을 조정하세요 (기본값: 300ms)

**Q: 모바일에서 필터가 안 보여요**
A: `MobileFilterModal` 컴포넌트가 올바르게 구현되었는지 확인하세요

**Q: 이미지가 로딩되지 않아요**
A: Mock 데이터의 이미지 URL이 올바른지 확인하세요

**Q: TypeScript 에러가 발생해요**
A: 타입 정의를 확인하고 `src/types/` 디렉토리의 타입을 참조하세요

---

더 자세한 내용은 각 컴포넌트의 JSDoc 주석을 참고하세요.
