# Nexus 프로젝트

🔗 해당 프로젝트는 아래 주소에서 확인하실수 있습니다. [http://js-nexus.kro.kr/](http://js-nexus.kro.kr/)

## 📖 프로젝트 개요
Nexus는 강력한 마이크로서비스 아키텍처를 기반으로 구축된 최신 웹 애플리케이션입니다. URL 단축 서비스 등 다양한 기능을 사용자 친화적인 경험으로 제공합니다.

## 🏗️ 시스템 아키텍처

이 시스템은 **Oracle Cloud Infrastructure**에 배포되어 있으며, **Docker**를 활용한 컨테이너화를 통해 확장성과 일관성을 보장합니다.

![System Architecture](./public/architecture.png)
*(여기에 아키텍처 이미지를 넣어주세요)*

### 🛠 기술 스택 (Tech Stack)

#### 인프라 및 CI/CD
- **서버**: Oracle Cloud
- **CI/CD**: Jenkins (호스트 서버에 직접 설치)
- **컨테이너**: Docker & Docker Compose

#### 프론트엔드 (Frontend)
- **프레임워크**: Vue.js 2
- **웹 서버**: Nginx (Vue 컨테이너 내에서 리버스 프록시 역할 수행)
- **스타일링**: bootstrap-vue

#### 백엔드 (Backend)
- **프레임워크**: Spring Boot
- **데이터베이스**: PostgreSQL
- **캐시**: Redis

---

## 🚀 시작하기 (Getting Started)

### 사전 요구 사항
- Node.js (v14 이상)
- npm 또는 yarn

### 설치 방법

```bash
# 저장소 복제 (Clone)
git clone https://github.com/your-repo/nexus-ui.git

# 프로젝트 폴더로 이동
cd nexus-ui

# 의존성 패키지 설치
npm install
```

### 로컬 실행

```bash
# 로컬 개발 서버 실행 (localhost:8080)
npm run serve
```

### 배포용 빌드

```bash
# 프로덕션 배포를 위한 빌드 (압축 및 최적화)
npm run build
```

---

## 📂 프로젝트 구조

```
nexus-ui/
├── public/          # 정적 리소스 (favicon, robots.txt 등)
├── src/
│   ├── api/         # API 요청 모듈
│   ├── assets/      # 로고, 이미지, 공통 스타일(CSS)
│   ├── components/  # 재사용 가능한 Vue 컴포넌트
│   ├── router/      # Vue Router 설정
│   ├── store/       # Pinia/Vuex 상태 관리
│   ├── views/       # 페이지(View) 컴포넌트
│   │   └── short-url/ # URL 단축 서비스 페이지
│   ├── App.vue      # 최상위 컴포넌트
│   └── main.js      # 진입점(Entry point)
├── nginx/           # Docker 배포용 Nginx 설정
├── Dockerfile       # Docker 빌드 설정
└── package.json     # 프로젝트 의존성 관리
```


## 📝 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.
