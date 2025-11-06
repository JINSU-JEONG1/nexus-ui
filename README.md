# Nexus UI v3

## 📁 프로젝트 구조

```
src/
├── api/          # API 통신 관련 모듈 (axios 인스턴스, API 엔드포인트)
│   ├── index.js       # axios 인스턴스 및 인터셉터 설정
│   └── user.js        # 사용자 API 엔드포인트
│
├── assets/       # 정적 리소스 (이미지, 폰트, CSS 파일 등)
│
├── components/   # 재사용 가능한 Vue 컴포넌트
│
├── composables/  # Vue 3 Composition API 로직 (재사용 가능한 로직)
│   ├── useCounter.js  # 카운터 로직
│   └── useFetch.js    # API 호출 로직
│
├── directives/   # 커스텀 Vue 디렉티브
│   ├── focus.js       # 자동 포커스 디렉티브
│   └── clickOutside.js # 외부 클릭 감지 디렉티브
│
├── layouts/      # 페이지 레이아웃 컴포넌트
│   └── DefaultLayout.vue # 기본 레이아웃
│
├── plugins/      # Vue 플러그인 및 서드파티 라이브러리 설정
│   └── i18n.js        # 다국어 플러그인
│
├── router/       # Vue Router 설정 및 라우트 정의
│   └── index.js       # 라우터 설정 및 네비게이션 가드
│
├── stores/       # Pinia 상태 관리 스토어
│   ├── counter.js     # 카운터 스토어
│   └── user.js        # 사용자 스토어
│
└── views/        # 페이지 단위 Vue 컴포넌트
    ├── HomeView.vue   # 홈 페이지
    └── AboutView.vue  # 소개 페이지
```