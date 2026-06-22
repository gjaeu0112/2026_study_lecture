# 강의 평가 시스템

React + NestJS + TypeORM + MySQL + JWT 기반의 강의용 웹 애플리케이션입니다.

## 프로젝트 구조

```
2026_study_lecture/
├── backend/     # NestJS API 서버
└── frontend/    # React (Vite) 클라이언트
```

## 포트 및 접속 구조

| 구분 | 포트 | 바인딩 | 접속 예시 |
|------|------|--------|-----------|
| 백엔드 API | 3000 | `0.0.0.0` | `http://<서버IP>:3000` |
| 프론트 Web | 5173 | `0.0.0.0` | `http://<서버IP>:5173` |
| MySQL | 3306 | 로컬 | EC2 내부에서만 접속 |

프론트는 `/api` 경로로 백엔드를 호출합니다.
- **개발:** Vite proxy가 `/api` → `localhost:3000` 으로 전달
- **운영(EC2):** nginx가 `/api` → `127.0.0.1:3000` 으로 전달

## 사전 준비

1. Node.js 20+
2. MySQL 8.0 (포트 3306, 로컬 설치)
3. MySQL 데이터베이스 생성

```sql
CREATE DATABASE lecture_eval CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 실행 방법

### 한 번에 실행 (루트 폴더)

```bash
npm install        # 최초 1회 (concurrently 설치)
npm run dev        # 백엔드 + 프론트 동시 실행
```

개별 실행:
```bash
npm run dev:backend   # API: 0.0.0.0:3000
npm run dev:frontend  # Web: 0.0.0.0:5173
```

외부(같은 네트워크/EC2)에서 접속:
```
http://<서버IP>:5173    # 프론트
http://<서버IP>:3000    # API 직접 호출
```

EC2 보안 그룹에서 **5173, 3000** 포트 인바운드를 열어야 합니다.
운영 배포 시에는 **80(nginx)** 만 열고 3000/5173은 닫는 것을 권장합니다.

> **주의:** 반드시 **프로젝트 루트**(`2026_study_lecture/`)에서 실행하세요.  
> `backend/`나 `frontend/` 폴더 안에서 `npm run dev`를 치면 스크립트가 없거나 동작이 다릅니다.

### 사전 설정 (필수)

1. MySQL에서 DB 생성
2. `backend/.env`에서 `DB_PASSWORD` 수정
3. EC2 외부 접속 시 `CORS_ORIGINS`에 프론트 주소 추가

```bash
# backend/.env 예시 (EC2)
HOST=0.0.0.0
PORT=3000
CORS_ORIGINS=http://localhost:5173,http://13.125.x.x:5173
```

### 실행이 안 될 때

| 증상 | 원인 | 해결 |
|------|------|------|
| `Could not read package.json` | 루트가 아닌 폴더에서 실행 | `2026_study_lecture/`에서 실행 |
| `Missing script: "dev"` | backend 폴더에서 실행 | 루트에서 `npm run dev` 또는 `npm run dev:backend` |
| 백엔드가 계속 Retrying... | MySQL 비밀번호/DB 미설정 | `.env`의 `DB_PASSWORD`, DB 생성 확인 |
| Vite `bundling dependencies...` | 첫 실행 시 의존성 번들링 | 1~2분 기다리면 http://localhost:5173 접속 가능 |

### 1. 백엔드

```bash
cd backend
copy .env.example .env   # Windows
# .env 파일에서 DB 비밀번호 등 수정

npm run start:dev
```

- API: http://localhost:3000
- TypeORM `synchronize: true`로 테이블 자동 생성 (강의용)

### 2. 프론트엔드

```bash
cd frontend
copy .env.example .env

npm run dev
```

- Web: http://localhost:5173 (또는 http://<서버IP>:5173)

## AWS EC2 배포 (운영)

### 1. EC2 보안 그룹
| 포트 | 용도 |
|------|------|
| 22 | SSH |
| 80 | nginx (운영 권장) |
| 5173, 3000 | 개발/테스트 시에만 개방 |

### 2. 서버 설정
```bash
# 프로젝트 클론 후
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# backend/.env 설정 (DB, HOST, CORS_ORIGINS)
# frontend 빌드 (nginx /api 프록시 사용)
cd frontend
echo VITE_API_URL=/api > .env.production
npm run build
```

### 3. nginx (예시: deploy/nginx.conf.example)
```bash
sudo cp deploy/nginx.conf.example /etc/nginx/conf.d/lecture-eval.conf
# root 경로를 실제 dist 위치로 수정
sudo nginx -t && sudo systemctl reload nginx
```

### 4. 백엔드 실행 (PM2 등)
```bash
npm run build
npm run start:prod   # 0.0.0.0:3000 에서 API 실행
```

접속: `http://<EC2-공인IP>/` (nginx 80 → 프론트, `/api` → 백엔드)

## SFTP 배포 (zip)

로컬에서 배포용 zip 생성:

```bash
npm install
npm run build:zip
```

| 명령어 | 결과 |
|--------|------|
| `npm run build:zip` | `deploy/backend-deploy.zip` + `deploy/frontend-deploy.zip` |
| `npm run build:zip:backend` | 백엔드만 |
| `npm run build:zip:frontend` | 프론트만 |

상세 절차: [deploy/SFTP-DEPLOY.md](deploy/SFTP-DEPLOY.md)  
(DB EC2 분리 방법도 동 문서에 정리)

## 기본 관리자 계정

`.env`의 `ADMIN_EMAIL`, `ADMIN_PASSWORD`로 최초 1회 자동 생성됩니다.

기본값:
- email: admin@example.com
- password: admin1234

## 주요 기능

| 기능 | 설명 |
|------|------|
| 회원가입/로그인 | JWT Bearer 토큰 인증 |
| 게시판 | 글 CRUD + 댓글 |
| 마이페이지 | 프로필 수정, 내 글 목록 |
| 관리자 | 대시보드, 회원/게시글 관리 |

## API 요약

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | /auth/register | 회원가입 | X |
| POST | /auth/login | 로그인 | X |
| GET | /users/me | 내 정보 | O |
| PATCH | /users/me | 프로필 수정 | O |
| GET | /users/me/posts | 내 글 목록 | O |
| GET | /posts | 게시글 목록 | X |
| GET | /posts/:id | 게시글 상세 | X |
| POST | /posts | 글 작성 | O |
| PATCH | /posts/:id | 글 수정 | O |
| DELETE | /posts/:id | 글 삭제 | O |
| POST | /posts/:postId/comments | 댓글 작성 | O |
| DELETE | /comments/:id | 댓글 삭제 | O |
| GET | /admin/dashboard | 통계 | Admin |
| GET | /admin/users | 회원 목록 | Admin |
| PATCH | /admin/users/:id/role | 권한 변경 | Admin |
| DELETE | /admin/users/:id | 회원 삭제 | Admin |
| GET | /admin/posts | 게시글 목록 | Admin |
| DELETE | /admin/posts/:id | 게시글 삭제 | Admin |
| GET | /health | 서버 상태 | X |
| GET | /db-check | DB 연결 확인 | X |
| GET | /server-info | 서버 정보 | X |
