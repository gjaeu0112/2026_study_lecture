# SFTP 배포 가이드 (FileZilla 등)

## zip 생성 (로컬 PC)

```bash
# 루트에서
npm install
npm run build:zip          # 백엔드 + 프론트 zip 모두 생성
# 또는
npm run build:zip:backend  # deploy/backend-deploy.zip
npm run build:zip:frontend # deploy/frontend-deploy.zip
```

생성 파일:

| 파일 | 내용 |
|------|------|
| `deploy/backend-deploy.zip` | `dist/`, `package.json`, `package-lock.json`, `.env.example` |
| `deploy/frontend-deploy.zip` | `dist/` (React 빌드 결과) |

> `.env`는 비밀번호가 들어가므로 zip에 넣지 않습니다. EC2에서 `.env.example`을 복사해 직접 작성하세요.

---

## EC2 디렉터리 구조 (앱 서버 1대)

```
/var/www/lecture-eval/
├── backend/          ← backend-deploy.zip 압축 해제
│   ├── dist/
│   ├── package.json
│   ├── package-lock.json
│   └── .env
└── frontend/
    └── dist/         ← frontend-deploy.zip 압축 해제 (dist 폴더 내용)
```

nginx 설정: `deploy/nginx.conf.example` 참고 (별도 업로드)

---

## SFTP 업로드 순서

1. FileZilla로 EC2 접속 (SFTP, 포트 22)
2. `backend-deploy.zip` → `/var/www/lecture-eval/` 업로드
3. `frontend-deploy.zip` → `/var/www/lecture-eval/` 업로드
4. SSH로 EC2 접속 후 압축 해제:

```bash
sudo mkdir -p /var/www/lecture-eval/backend /var/www/lecture-eval/frontend
cd /var/www/lecture-eval

unzip -o backend-deploy.zip -d backend
unzip -o frontend-deploy.zip -d frontend

# 백엔드 환경 설정
cd backend
cp .env.example .env
nano .env   # DB_HOST, DB_PASSWORD 등 수정

npm ci --omit=dev
pm2 start dist/main.js --name lecture-api
pm2 save
```

5. nginx 설정 후 `sudo systemctl reload nginx`

---

## DB를 별도 EC2로 분리할 때

### 구성

```
[ EC2 - 앱 서버 ]                    [ EC2 - DB 서버 ]
  nginx :80                            MySQL :3306
  NestJS :3000  ──(3306)──private IP──▶  lecture_eval DB
```

### DB EC2 설정

1. MySQL 8.0 설치, `lecture_eval` DB 생성
2. 앱 서버 전용 DB 계정 생성 (root 사용 비권장):

```sql
CREATE USER 'lecture_app'@'10.0.1.10' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON lecture_eval.* TO 'lecture_app'@'10.0.1.10';
FLUSH PRIVILEGES;
```

`10.0.1.10` → **앱 EC2의 Private IP** (같은 VPC 내)

3. MySQL이 외부 IP가 아닌 **VPC 내부**에서만 listen 하도록 설정
4. DB EC2 보안 그룹: 인바운드 **3306** → 소스를 **앱 EC2 보안 그룹**만 허용

### 앱 EC2 `backend/.env` 변경

```env
# localhost → DB EC2 Private IP
DB_HOST=10.0.1.20
DB_PORT=3306
DB_USERNAME=lecture_app
DB_PASSWORD=strong_password
DB_DATABASE=lecture_eval
```

### 보안 그룹 정리

| EC2 | 열어야 할 포트 | 대상 |
|-----|----------------|------|
| 앱 서버 | 22, 80 | 관리자 IP, 0.0.0.0/0(80) |
| 앱 서버 | 3000 | 닫기 (nginx 내부 프록시만) |
| DB 서버 | 3306 | **앱 서버 보안 그룹만** |
| DB 서버 | 22 | 관리자 IP만 |

### 코드 변경

**거의 없음.** `app.module.ts`는 이미 `DB_HOST` 등을 `.env`에서 읽습니다.  
분리 후 `DB_HOST`만 DB EC2 Private IP로 바꾸고 백엔드를 재시작하면 됩니다.

### 주의

- 운영 환경에서는 `synchronize: true` 끄고 migration 사용 권장
- DB EC2에는 퍼블릭 IP 없이 Private IP만 쓰는 것이 안전
