# Nexus UI

> 🔗 **Live Demo**: 아래 url에서 확인하실수 있습니다.
 [http://js-nexus.kro.kr/]

**Nexus UI**는 개인프로젝트로 개발한 다양한 웹 서비스와 유틸리티들을 한데 모아 관리하는 프론트엔드 통합 플랫폼입니다. 

**Oracle Cloud Infrastructure** 에 **Docker**와 **Jenkins**를 이용한 배포 환경을 직접 구축하였으며, URL 단축 서비스와 같은 실질적인 기능들을 지속적으로 추가하고 실험하는 개인 프로젝트 저장소입니다.

---

## � Technical Highlights


### 🛠️ Tech Stack

- **Language**: JavaScript (ES6+)
- **Framework**: Vue.js 2.7.16
- **Build Tool**: Vite 4.5.0
- **UI Library**: Bootstrap Vue 2.21.0
- **State Management**: Pinia 2.0.0
- **Web Server**: Nginx 
- **Infrastructure**: Oracle Cloud (OCI)
- **CI/CD**: Docker, Jenkins

---

## 🏗️ Architecture

### Frontend Structure
- **Component-Based Architecture**: 재사용 가능한 Vue 컴포넌트 구조
- **Router-Based Navigation**: Vue Router를 통한 SPA 라우팅
- **API Integration**: Axios 기반 REST API 통신

### Architecture
<img width="1408" height="768" alt="nexus-architecture" src="https://github.com/user-attachments/assets/449a1dea-211f-455a-b9b2-86e15cad7c27" />

---

## 📂 Project Structure

```
nexus-ui/
├── public/                # 정적 리소스
│   ├── nexus_logo.svg    # 파비콘 및 브랜드 로고
│   └── favicon.ico       
├── src/
│   ├── api/              # API 요청 모듈
│   ├── assets/           # 이미지, 로고, 스타일 리소스
│   ├── auth/             # 인증 관련 모듈
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   └── navigation/   # Header, Footer, Sidebar
│   ├── mixins/           # Vue Mixins (공통 로직)
│   ├── router/           # Vue Router 설정
│   ├── store/            # Pinia Store (상태 관리)
│   ├── styles/           # 전역 스타일
│   ├── utils/            # 유틸리티 함수
│   ├── views/            # 페이지 컴포넌트
│   │   ├── pages/        # Home 등 주요 페이지
│   │   └── nexsus-ui/    
│   │       └── short-url/ # URL 단축 페이지
│   ├── App.vue           # 루트 컴포넌트
│   └── main.js           # 애플리케이션 진입점
├── nginx/                # Nginx 설정 파일
├── Dockerfile            # Docker 빌드 설정
├── vite.config.js        # Vite 빌드 설정
└── package.json          # 프로젝트 의존성
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v14 이상), npm 또는 yarn


### Local Development
```bash
# 의존성 설치
npm install

# 개발 서버 실행 (localhost:5173)
npm run serve

# 프로덕션 빌드
npm run build
```

### Docker Development
```bash
# Docker 이미지 빌드
docker build -t nexus-ui .

# Docker 컨테이너 실행
docker run -d -p 80:80 nexus-ui
```

---

## � Features

### URL 단축 서비스 (Short URL)
- ✅ 긴 URL을 짧은 링크로 변환
- ✅ 반응형 UI (모바일/태블릿/데스크톱 대응)
- ✅ 실시간 URL 단축 및 복사 기능
- ✅ 프로젝트 카드 기반 네비게이션


## 🔧 Technical Implementation

### Build Optimization
- **Vite**: 빠른 HMR(Hot Module Replacement) 지원

### SEO Strategy
- **Meta Tags**: Open Graph, Twitter Card 설정
- **Semantic HTML**: 시맨틱 태그 적용

### Infrastructure
- **Oracle Cloud**: Docker 컨테이너 기반 호스팅
- **Nginx**: Reverse Proxy 및 정적 파일 서빙
- **CI/CD**: Jenkins를 통한 자동 빌드 및 배포

---

## 📝 License
MIT License
