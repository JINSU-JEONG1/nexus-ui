# frontend/Dockerfile
# 빌드 스테이지
FROM node:18-alpine AS builder
# 컨테이너에서 /app 을 작업디렉토리로 설정
WORKDIR /app
# package.json과 package-lock.json 파일을 /app 으로 복사 및 설치치
COPY package*.json ./
# 의존성 설치 (npm ci 는 의존성 설치 후 버전 고정)
RUN npm ci
# docker 파일이 위치한 디렉토리의 모든 파일을 /app 으로 복사
COPY . .
# Vue 프로젝트 빌드 # 결과: /app/dist
RUN npm run build


# 정적파일을 서빙하는 nginx 스테이지
# Stage 2: 실행 환경 (Production Stage)
FROM nginx:stable-alpine
# 작업 디렉토리 설정
WORKDIR /usr/src/app
# 빌드 스테이지에서 생성된 정적 파일을 최종 실행 환경으로 복사
COPY --from=build-stage /app/dist /usr/src/app/dist
COPY --from=builder /app/dist /usr/share/nginx/html
# 포트 노출
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

