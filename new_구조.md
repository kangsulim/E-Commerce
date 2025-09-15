# 25.09.25 달라진 구조 확인

## 📁 전체 구조

```
E-Commerce/
├── .git/                             # Git 저장소
├── shop_backend/                     # Spring Boot 백엔드
│   ├── .gradle/
│   ├── .idea/
│   ├── bin/
│   ├── build/
│   ├── gradle/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/shop/
│   │   │   │   ├── ShopApplication.java      # 메인 애플리케이션
│   │   │   │   ├── config/
│   │   │   │   │   ├── FileProperties.java   # 파일 업로드 설정
│   │   │   │   │   ├── JpaConfig.java        # JPA 설정
│   │   │   │   │   ├── JwtProperties.java    # JWT 설정
│   │   │   │   │   ├── SecurityConfig.java   # Spring Security 설정
│   │   │   │   │   └── SwaggerConfig.java    # Swagger 문서화
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AdminController.java  # 관리자 컨트롤러
│   │   │   │   │   ├── AuthController.java   # 인증/로그인
│   │   │   │   │   ├── CartController.java   # 장바구니
│   │   │   │   │   ├── CategoryController.java # 카테고리
│   │   │   │   │   ├── FileController.java   # 파일 업로드
│   │   │   │   │   ├── HealthController.java # 헬스체크
│   │   │   │   │   ├── OrderController.java  # 주문 관리
│   │   │   │   │   ├── ProductController.java # 상품 관리
│   │   │   │   │   ├── ReviewController.java # 리뷰
│   │   │   │   │   └── UserController.java   # 사용자 관리
│   │   │   │   ├── dto/
│   │   │   │   │   ├── AdminDto.java         # 관리자 DTO
│   │   │   │   │   ├── AuthDto.java          # 인증 DTO
│   │   │   │   │   ├── CartDto.java          # 장바구니 DTO
│   │   │   │   │   ├── CategoryDto.java      # 카테고리 DTO
│   │   │   │   │   ├── FileDto.java          # 파일 DTO
│   │   │   │   │   ├── OrderDto.java         # 주문 DTO
│   │   │   │   │   ├── ProductDto.java       # 상품 DTO
│   │   │   │   │   ├── ReviewDto.java        # 리뷰 DTO
│   │   │   │   │   └── UserDto.java          # 사용자 DTO
│   │   │   │   ├── entity/
│   │   │   │   │   ├── BaseEntity.java       # 기본 엔티티
│   │   │   │   │   ├── Cart.java             # 장바구니
│   │   │   │   │   ├── Category.java         # 카테고리
│   │   │   │   │   ├── Order.java            # 주문
│   │   │   │   │   ├── OrderItem.java        # 주문 아이템
│   │   │   │   │   ├── Product.java          # 상품
│   │   │   │   │   ├── Review.java           # 리뷰
│   │   │   │   │   └── User.java             # 사용자
│   │   │   │   ├── exception/
│   │   │   │   │   ├── ErrorResponse.java    # 에러 응답
│   │   │   │   │   └── GlobalExceptionHandler.java # 전역 예외 처리
│   │   │   │   ├── repository/
│   │   │   │   │   ├── CartRepository.java
│   │   │   │   │   ├── CategoryRepository.java
│   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   ├── ProductRepository.java
│   │   │   │   │   ├── ReviewRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── CustomUserDetailsService.java # 사용자 세부정보 서비스
│   │   │   │   │   ├── JwtAuthenticationEntryPoint.java # JWT 인증 진입점
│   │   │   │   │   ├── JwtAuthenticationFilter.java # JWT 인증 필터
│   │   │   │   │   └── JwtTokenProvider.java # JWT 토큰 제공자
│   │   │   │   ├── service/
│   │   │   │   │   ├── AdminService.java     # 관리자 서비스
│   │   │   │   │   ├── AuthService.java      # 인증 서비스
│   │   │   │   │   ├── CartService.java      # 장바구니 서비스
│   │   │   │   │   ├── CategoryService.java  # 카테고리 서비스
│   │   │   │   │   ├── FileService.java      # 파일 서비스
│   │   │   │   │   ├── OrderService.java     # 주문 서비스
│   │   │   │   │   ├── ProductService.java   # 상품 서비스
│   │   │   │   │   ├── ReviewService.java    # 리뷰 서비스
│   │   │   │   │   └── UserService.java      # 사용자 서비스
│   │   │   │   └── util/
│   │   │   │       └── SecurityUtil.java     # 보안 유틸리티
│   │   │   └── resources/
│   │   │       └── application.yml           # 애플리케이션 설정
│   │   └── test/
│   │       └── java/com/example/shop/
│   │           └── DemoApplicationTests.java # 테스트
│   ├── .gitattributes
│   ├── .gitignore
│   ├── build.gradle                          # Gradle 빌드 설정
│   ├── demo.zip
│   ├── gradlew
│   ├── gradlew.bat
│   └── settings.gradle
│
├── shop_frontend/                    # React TypeScript 프론트엔드
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── auth-styles.css   # 인증 스타일
│   │   │   │   ├── LoginForm.tsx     # 로그인 폼
│   │   │   │   └── RegisterForm.tsx  # 회원가입 폼
│   │   │   └── layout/
│   │   │       ├── AdminLayout.tsx   # 관리자 레이아웃
│   │   │       ├── Footer.tsx        # 푸터 컴포넌트
│   │   │       ├── Header.tsx        # 헤더 컴포넌트
│   │   │       └── Layout.tsx        # 기본 레이아웃
│   │   ├── hooks/
│   │   │   └── useAuth.tsx           # 인증 훅
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx # 관리자 대시보드
│   │   │   │   ├── AdminOrders.tsx   # 관리자 주문 관리
│   │   │   │   ├── AdminProducts.tsx # 관리자 상품 관리
│   │   │   │   └── AdminUsers.tsx    # 관리자 사용자 관리
│   │   │   ├── CartPage.tsx          # 장바구니 페이지
│   │   │   ├── CheckoutPage.tsx      # 결제 페이지
│   │   │   ├── HomePage.tsx          # 홈 페이지
│   │   │   ├── LoginPage.tsx         # 로그인 페이지
│   │   │   ├── MyPage.tsx            # 마이 페이지
│   │   │   ├── NotFoundPage.tsx      # 404 페이지
│   │   │   ├── OrderHistoryPage.tsx  # 주문 내역 페이지
│   │   │   ├── ProductDetailPage.tsx # 상품 상세 페이지
│   │   │   └── RegisterPage.tsx      # 회원가입 페이지
│   │   ├── router/
│   │   │   └── index.tsx             # 라우터 설정
│   │   ├── services/
│   │   │   ├── api.ts                # API 기본 설정
│   │   │   ├── auth.ts               # 인증 API
│   │   │   ├── cart.ts               # 장바구니 API
│   │   │   └── product.ts            # 상품 API
│   │   ├── types/
│   │   │   └── index.ts              # 타입 정의 (통합)
│   │   ├── App.css
│   │   ├── App.tsx                   # 메인 앱 컴포넌트
│   │   ├── index.css
│   │   ├── main.tsx                  # 엔트리 포인트
│   │   └── vite-env.d.ts
│   ├── .env                          # 환경 변수
│   ├── .eslintrc.cjs
│   ├── .gitignore
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json                  # 의존성 관리
│   ├── postcss.config.cjs.backup
│   ├── README.md
│   ├── tailwind.config.js.backup
│   ├── tsconfig.json                 # TypeScript 설정
│   ├── tsconfig.node.json
│   └── vite.config.ts               # Vite 설정
│
├── 개발 내용 정리/                  # 개발 과정 문서
└── 구조.md                          # 구조 문서 (구버전)
```

## 🔄 기존 구조.md와의 주요 차이점

### **1. 폴더명 변경**
- `backend/` → `shop_backend/`
- `frontend/` → `shop_frontend/`

### **2. 백엔드 패키지 구조 변경**
- `com.mall` → `com.example.shop`

### **3. 백엔드 DTO 구조 변경**
- **기존**: `dto/request/`, `dto/response/` 분리
- **현재**: 모듈별 통합 DTO (`AuthDto.java`, `ProductDto.java` 등)

### **4. 백엔드 추가 구성요소**
- `AdminController.java`, `HealthController.java` 추가
- `FileProperties.java`, `JwtProperties.java` 설정 파일 추가
- `util/` 패키지 추가

### **5. 프론트엔드 상태 관리 변경**
- **기존**: Redux 사용 (`store/` 폴더)
- **현재**: React Query + Context API 사용

### **6. 프론트엔드 구조 단순화**
- **components**: common/product/cart/order → auth/layout만
- **hooks**: 다수의 훅 → useAuth만
- **services**: xxxApi.ts → xxx.ts
- **types**: 모듈별 분리 → 통합 index.ts

### **7. 누락된 폴더/파일**
- `database/` 폴더 (스키마, Docker 설정)
- `docs/` 폴더 (API 문서, 배포 가이드)
- `utils/`, `styles/` 폴더 (프론트엔드)

### **8. 새로 추가된 폴더**
- `개발 내용 정리/` 폴더

## 📋 현재 구현 상태

### **✅ 완료된 기능**
- **Phase 1**: 기본 설정 및 인증 시스템
- **Phase 2**: 상품 관리 기본 구조
- 백엔드 전체 API 구조 완성
- 프론트엔드 인증 시스템 완성

### **🚧 다음 구현 예정**
- **Phase 3**: 상품 조회 기능 (상품 목록, 상세, 검색/필터링)
- **Phase 4**: 장바구니 및 주문 기능
- **Phase 5**: 리뷰 시스템 및 관리자 기능

## 🛠️ 기술 스택

### **백엔드**
- Spring Boot 3.5.4
- Spring Security + JWT
- Spring Data JPA
- MariaDB
- Gradle
- Swagger/OpenAPI

### **프론트엔드**
- React 18 + TypeScript
- Vite
- React Router DOM
- React Query (TanStack Query)
- Tailwind CSS
- ESLint

### **개발 환경**
- Java 17
- Node.js
- MariaDB (localhost:3306)
- 서버: localhost:8080
- 클라이언트: localhost:5173
