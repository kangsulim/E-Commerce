# 🛍️ E-Commerce Frontend

React + TypeScript 기반의 현대적인 E-Commerce 프론트엔드 애플리케이션입니다.

## ✨ 주요 기능

### 🔐 인증 시스템
- 회원가입 / 로그인 / 로그아웃
- JWT 토큰 기반 인증
- 관리자 권한 관리

### 🛒 상품 관리
- **상품 목록 페이지**: 카테고리별 필터링, 검색, 정렬
- **상품 상세 페이지**: 이미지 갤러리, 리뷰, 스펙 정보
- **실시간 검색**: 자동완성, 인기 검색어, 최근 검색어
- **고급 필터링**: 가격 범위, 카테고리, 정렬 옵션

### 🎨 사용자 경험
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **로딩 상태**: 스켈레톤 UI, 프로그레스 바
- **에러 처리**: ErrorBoundary, 사용자 친화적 에러 메시지
- **접근성**: ARIA 라벨, 키보드 네비게이션

### 🏠 홈페이지
- **히어로 섹션**: 통합 검색 기능
- **추천 상품**: 베스트셀러, 할인상품, 신상품
- **카테고리 미리보기**: 인터랙티브 카테고리 그리드
- **고객 후기**: 실제 구매 후기 표시

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **React Router DOM** - 클라이언트 사이드 라우팅
- **TanStack React Query** - 서버 상태 관리
- **React Hook Form + Yup** - 폼 관리 및 유효성 검사

### 스타일링
- **CSS-in-JS** - Tailwind-like 유틸리티 클래스
- **Custom CSS** - 애니메이션 및 컴포넌트 스타일
- **반응형 디자인** - 모바일 퍼스트 접근

### 상태 관리
- **React Query** - 서버 상태 (캐싱, 동기화)
- **React Context** - 전역 상태 (인증)
- **URL State** - 필터링 및 검색 상태

### 개발 도구
- **Vite** - 빌드 도구
- **ESLint** - 코드 품질
- **TypeScript** - 타입 체크

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── auth/            # 인증 관련 컴포넌트
│   ├── common/          # 공통 컴포넌트 (Button, Modal 등)
│   ├── filter/          # 필터링 컴포넌트
│   ├── home/            # 홈페이지 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   ├── product/         # 상품 관련 컴포넌트
│   └── search/          # 검색 관련 컴포넌트
├── data/                # Mock 데이터
├── hooks/               # 커스텀 React Hook
├── pages/               # 페이지 컴포넌트
├── router/              # 라우팅 설정
├── services/            # API 서비스
├── styles/              # 전역 스타일
└── types/               # TypeScript 타입 정의
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **빌드**
```bash
npm run build
```

4. **프리뷰**
```bash
npm run preview
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
VITE_APP_NAME=온라인 쇼핑몰
VITE_API_URL=http://localhost:8080
```

## 🧪 개발된 주요 컴포넌트

### 상품 관련
- `ProductCard` - 상품 카드 (이미지, 가격, 평점)
- `ProductGrid` - 상품 그리드 레이아웃
- `ProductImageGallery` - 상품 이미지 갤러리 (확대, 썸네일)
- `ProductSkeleton` - 로딩 스켈레톤

### 검색 및 필터
- `SearchBar` - 통합 검색 (자동완성, 최근 검색어)
- `CategoryFilter` - 카테고리 필터 (다양한 레이아웃)
- `PriceRangeFilter` - 가격 범위 필터 (듀얼 슬라이더)
- `FilterSidebar` - 통합 필터 사이드바

### 공통 컴포넌트
- `Pagination` - 페이지네이션
- `Breadcrumb` - 경로 표시
- `Loading` - 다양한 로딩 컴포넌트
- `ErrorBoundary` - 에러 처리

### 홈페이지
- `FeaturedProducts` - 추천 상품 섹션
- `CategoryPreview` - 카테고리 미리보기

## 🔧 주요 기능 설명

### 상품 검색 및 필터링
- **실시간 검색**: 디바운스 적용으로 성능 최적화
- **URL 동기화**: 필터 상태가 URL에 반영되어 공유 가능
- **무한 스크롤 준비**: 페이지네이션과 함께 확장 가능

### 상태 관리
- **React Query**: 서버 데이터 캐싱 및 동기화
- **URL State**: 검색/필터 상태를 URL로 관리
- **Local Storage**: 최근 검색어 저장

### 성능 최적화
- **코드 스플리팅**: React.lazy를 통한 지연 로딩
- **이미지 최적화**: lazy loading 및 responsive images
- **메모이제이션**: useMemo, useCallback 적용

### 접근성
- **ARIA 라벨**: 스크린 리더 지원
- **키보드 네비게이션**: Tab 키로 모든 기능 접근 가능
- **고대비 모드**: prefers-contrast 미디어 쿼리 지원

## 🎯 향후 개선 계획

### 기능 추가
- [ ] 장바구니 기능 구현
- [ ] 결제 시스템 연동
- [ ] 상품 리뷰 시스템
- [ ] 위시리스트 기능
- [ ] 실시간 알림

### UX/UI 개선
- [ ] 다크 모드 지원
- [ ] 다국어 지원 (i18n)
- [ ] PWA 기능 추가
- [ ] 오프라인 지원

### 성능 최적화
- [ ] 이미지 CDN 연동
- [ ] 가상 스크롤링
- [ ] Service Worker 캐싱
- [ ] Bundle 크기 최적화

## 🐛 알려진 이슈

- 일부 모바일 브라우저에서 sticky header 동작 이슈
- IE11 호환성 미지원 (모던 브라우저 전용)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 Issues를 통해 남겨주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
