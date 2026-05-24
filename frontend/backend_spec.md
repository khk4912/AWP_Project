# Backend API Specification

이 문서는 현재 `backend` NestJS 코드를 기준으로 프론트엔드 연동에 필요한 실행 셋업, 인증 방식, API 사용법, 확인된 문제를 정리한 문서입니다.

## 1. Backend Setup

현재 백엔드는 PostgreSQL이 아니라 **MongoDB + Mongoose** 기반입니다.

### Required Runtime

- Node.js + pnpm
- MongoDB
- NestJS backend package dependencies

### Environment Variables

`backend/.env` 파일을 만들고 아래 값을 설정합니다.

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/sns-database
ACCESS_SECRET=replace-with-long-random-secret
FRONTEND_ORIGIN=http://localhost:5173
```

| Key | Required | Description |
| --- | --- | --- |
| `PORT` | No | 백엔드 서버 포트. 기본값은 `3000` |
| `MONGO_URI` | No | MongoDB 연결 주소. 기본값은 `mongodb://localhost:27017/sns-database` |
| `ACCESS_SECRET` | Yes | JWT access token 서명용 secret |
| `FRONTEND_ORIGIN` | No | CORS 허용 origin. 기본값은 `http://localhost:5173` |

### Run Locally

```bash
cd /Users/kosame/Code/AWP_Project
pnpm install
pnpm --dir backend start:dev
```

Swagger UI:

```text
http://localhost:3000/api
```

Health check:

```http
GET http://localhost:3000/
```

Response:

```text
SNS Backend is running
```

## 2. Common API Rules

### Base URL

```text
http://localhost:3000
```

### Authentication

로그인이 필요한 API는 아래 헤더를 붙입니다.

```http
Authorization: Bearer <accessToken>
```

토큰은 `POST /auth/login` 응답의 `accessToken`을 사용합니다. 현재 access token 만료 시간은 1시간입니다.

### Validation

백엔드는 전역 `ValidationPipe`를 사용합니다.

- DTO에 정의되지 않은 필드는 거부됩니다.
- 필수 필드 누락, email 형식 오류, MongoDB ObjectId 형식 오류 등은 `400`으로 응답합니다.
- 단, 일부 path parameter는 아직 DTO 검증이 없어 잘못된 id가 `500`으로 처리될 수 있습니다.

### Error Response Shape

전역 exception filter 기준 에러 응답은 대체로 아래 형태입니다.

```json
{
  "success": false,
  "statusCode": 400,
  "error": "..."
}
```

## 3. Auth API

### Register

```http
POST /auth/register
Content-Type: application/json
```

Request:

```json
{
  "username": "samgg",
  "email": "user@example.com",
  "password": "12345678"
}
```

Validation:

| Field | Rule |
| --- | --- |
| `username` | string, minimum length 2 |
| `email` | valid email |
| `password` | string, minimum length 6 |

Success response:

```json
{
  "message": "User registered successfully.",
  "userId": "6651d7a2b2f0e0f4f7fa8f21"
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `400` | validation 실패 |
| `409` | 이미 사용 중인 email |

### Login

```http
POST /auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

Success response:

```json
{
  "accessToken": "jwt-token"
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `400` | validation 실패 |
| `401` | email/password 불일치 또는 `ACCESS_SECRET` 미설정 |

## 4. Users API

### Create User

```http
POST /users
Content-Type: application/json
```

주의: `POST /auth/register`와 기능이 거의 겹치는 공개 사용자 생성 API입니다.

Request:

```json
{
  "username": "samgg",
  "email": "user@example.com",
  "password": "12345678",
  "bio": "안녕하세요!"
}
```

Validation:

| Field | Rule |
| --- | --- |
| `username` | string, minimum length 2 |
| `email` | valid email |
| `password` | string, minimum length 6 |
| `bio` | optional string |

Success response:

```json
{
  "message": "User created successfully.",
  "userId": "6651d7a2b2f0e0f4f7fa8f21"
}
```

### Get Users

```http
GET /users
```

Description:

- 전체 사용자 목록 조회
- `password` 필드는 제외됨
- 최신 생성순 정렬

### Get User By ID

```http
GET /users/:id
```

Example:

```http
GET /users/6651d7a2b2f0e0f4f7fa8f21
```

Description:

- 특정 사용자 조회
- `password` 필드는 제외됨

Possible errors:

| Status | Case |
| --- | --- |
| `404` | user 없음 |

## 5. Posts API

### Create Post

```http
POST /posts
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "content": "오늘은 팀 프로젝트 병합을 진행했다.",
  "imageUrl": ""
}
```

Validation:

| Field | Rule |
| --- | --- |
| `content` | string, minimum length 1 |
| `imageUrl` | optional string |

Success response:

```json
{
  "message": "Post created successfully.",
  "postId": "6651d7a2b2f0e0f4f7fa8f21"
}
```

### Get Posts

```http
GET /posts
```

Description:

- 전체 게시글 조회
- 최신 생성순 정렬
- `author`는 `username`, `email`, `profileImage` 필드로 populate됨

### Get Post By ID

```http
GET /posts/:id
```

Description:

- 단일 게시글 조회
- `author`와 `likedBy` 일부 필드가 populate됨

Possible errors:

| Status | Case |
| --- | --- |
| `404` | post 없음 |

### Update Post

```http
PATCH /posts/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "content": "수정된 게시글 내용",
  "imageUrl": "updated-image.png"
}
```

Validation:

| Field | Rule |
| --- | --- |
| `content` | optional string, minimum length 1 |
| `imageUrl` | optional string |

Success response:

```json
{
  "message": "Post updated successfully."
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `401` | token 없음/만료/오류 |
| `403` | 본인 게시글이 아님 |
| `404` | post 없음 |

### Delete Post

```http
DELETE /posts/:id
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "message": "Post deleted successfully."
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `401` | token 없음/만료/오류 |
| `403` | 본인 게시글이 아님 |
| `404` | post 없음 |

### Like Post

```http
POST /posts/:id/like
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "message": "Post liked successfully."
}
```

### Unlike Post

```http
POST /posts/:id/unlike
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "message": "Post unliked successfully."
}
```

### Upload Image

```http
POST /posts/upload/image
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Form field:

| Field | Type | Required |
| --- | --- | --- |
| `file` | file | Yes |

Success response:

```json
{
  "message": "Image uploaded successfully.",
  "imageUrl": "/uploads/example.png"
}
```

Important:

- 현재 구현은 실제 파일 저장을 하지 않습니다.
- `/uploads/...` 정적 파일 서빙 설정도 없습니다.
- 프론트에서 이 API를 바로 이미지 업로드 기능으로 믿고 쓰면 이미지가 실제로 열리지 않을 수 있습니다.

## 6. Comments API

### Create Comment

```http
POST /comments
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "postId": "6651d7a2b2f0e0f4f7fa8f21",
  "content": "좋은 글입니다."
}
```

Validation:

| Field | Rule |
| --- | --- |
| `postId` | MongoDB ObjectId |
| `content` | string, minimum length 1 |

Success response:

```json
{
  "message": "Comment created successfully.",
  "commentId": "6651d7a2b2f0e0f4f7fa8f22"
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `401` | token 없음/만료/오류 |
| `404` | post 없음 |

### Get Comments By Post

```http
GET /comments/post/:postId
```

Description:

- 특정 게시글의 댓글 목록 조회
- 최신 생성순 정렬
- `author`는 `username`, `email`, `profileImage` 필드로 populate됨

### Delete Comment

```http
DELETE /comments/:id
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "message": "Comment deleted successfully."
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `401` | token 없음/만료/오류 |
| `403` | 본인 댓글이 아님 |
| `404` | comment 없음 |

## 7. Follow API

### Follow User

```http
POST /follow
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "targetUserId": "6651d7a2b2f0e0f4f7fa8f21"
}
```

Validation:

| Field | Rule |
| --- | --- |
| `targetUserId` | MongoDB ObjectId |

Success response:

```json
{
  "message": "Followed successfully."
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `400` | 자기 자신을 follow |
| `401` | token 없음/만료/오류 |
| `404` | user 없음 |

### Unfollow User

```http
POST /follow/unfollow
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "targetUserId": "6651d7a2b2f0e0f4f7fa8f21"
}
```

Success response:

```json
{
  "message": "Unfollowed successfully."
}
```

### Get Follow Relations

```http
GET /follow/:userId
```

Success response shape:

```json
{
  "userId": "6651d7a2b2f0e0f4f7fa8f20",
  "followers": [
    {
      "_id": "6651d7a2b2f0e0f4f7fa8f21",
      "username": "samgg",
      "email": "user@example.com"
    }
  ],
  "following": [],
  "followerCount": 1,
  "followingCount": 0
}
```

Possible errors:

| Status | Case |
| --- | --- |
| `404` | user 없음 |

## 8. Frontend Integration Notes

### Recommended Client Flow

1. `POST /auth/register`로 회원가입
2. `POST /auth/login`으로 `accessToken` 획득
3. 인증이 필요한 요청에 `Authorization: Bearer <accessToken>` 추가
4. 피드 화면은 `GET /posts`로 구성
5. 게시글 상세 화면은 `GET /posts/:id`와 `GET /comments/post/:postId` 조합
6. 댓글 작성은 `POST /comments`
7. 좋아요는 `POST /posts/:id/like`, 취소는 `POST /posts/:id/unlike`

### Auth Header Example

```ts
const res = await fetch('http://localhost:3000/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    content: '새 게시글',
    imageUrl: '',
  }),
});
```

### Validation Handling

프론트에서는 `400`, `401`, `403`, `404`, `409`를 분리해서 처리하는 것이 좋습니다.

| Status | Frontend Handling |
| --- | --- |
| `400` | 입력값 검증 메시지 표시 |
| `401` | 로그인 만료 또는 재로그인 유도 |
| `403` | 권한 없음 메시지 |
| `404` | 삭제되었거나 존재하지 않는 리소스 처리 |
| `409` | 이미 사용 중인 email 안내 |

## 9. Known Backend Issues

### Build Fails

현재 `pnpm --dir backend build`가 실패합니다.

원인:

- `backend/src/posts/posts.controller.ts`
- `backend/src/posts/posts.service.ts`
- `Express.Multer.File` 타입을 TypeScript가 찾지 못함

현재 `backend/tsconfig.json`의 `types` 설정이 `["node", "jest"]`로 제한되어 있어 `@types/multer`의 Express namespace 확장이 포함되지 않는 형태입니다.

### Tests Fail

`pnpm --dir backend exec jest --runInBand --watchman=false` 기준 실패합니다.

주요 원인:

- 위 `Express.Multer.File` 타입 오류
- 기본 Nest 테스트가 아직 `"Hello World!"`를 기대하지만 실제 응답은 `"SNS Backend is running"`
- 일부 unit test에 provider/model mock이 없음

### Upload API Is Incomplete

`POST /posts/upload/image`는 실제 파일 저장을 하지 않고, 파일명 기반 URL만 반환합니다.

실제 이미지 업로드로 사용하려면 다음이 필요합니다.

- multer storage 설정
- 저장 파일명 충돌 방지
- static serving 설정
- 파일 타입/크기 제한
- 파일이 없는 요청에 대한 예외 처리

### Path Parameter ObjectId Validation Is Incomplete

일부 라우트는 path parameter에 `IsMongoId` 검증이 없습니다. 잘못된 id 문자열이 들어오면 Mongoose `CastError`가 발생하고, 현재 전역 필터상 `500`으로 응답될 수 있습니다.

영향 가능 라우트:

- `GET /users/:id`
- `GET /posts/:id`
- `PATCH /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:id/like`
- `POST /posts/:id/unlike`
- `GET /comments/post/:postId`
- `DELETE /comments/:id`
- `GET /follow/:userId`

### Duplicate User Creation APIs

`POST /auth/register`와 `POST /users`가 모두 공개 사용자 생성 API입니다. 프론트에서는 일단 `POST /auth/register`를 회원가입 API로 사용하는 것이 더 자연스럽습니다.

### Legacy Express Files Remain

NestJS 구조와 별개로 Express 기반 파일이 남아 있습니다.

- `backend/app.js - express 기반, 삭제 필요`
- `backend/routes - express 기반, 삭제 필요/users.js`
- `backend/routes - express 기반, 삭제 필요/comments.js`

현재 NestJS 실행 경로에서는 사용되지 않지만, 프로젝트 구조상 혼란을 줄 수 있습니다.
