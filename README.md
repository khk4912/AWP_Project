# Project G

## Start

백엔드 Docker 환경 변수 파일을 먼저 준비합니다.

```bash
cp backend/.env.docker.example backend/.env.docker
```

```env
PORT=3000
ACCESS_SECRET=replace-with-real-secret
FRONTEND_ORIGIN=http://localhost:8081
```

전체 서비스를 실행합니다.

```bash
docker compose up --build
```

실행 후 접속 주소는 아래와 같습니다.

- App/nginx: http://localhost:8081
- Frontend: nginx를 통해 `http://localhost:8081/`로 접근
- Backend API: nginx를 통해 `http://localhost:8081/api/...`로 접근
- MongoDB: `localhost:27017`

nginx 라우팅:

- `/` -> `frontend:3001`
- `/api/` -> `backend:3000`

## Build Check

```bash
pnpm --dir frontend build
pnpm --dir backend build
docker compose build
```
