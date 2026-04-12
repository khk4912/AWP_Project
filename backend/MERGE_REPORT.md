# Merge Report

이 문서는 업로드한 코드가 현재 제출 버전에 어떻게 반영되었는지 정리한 보고서입니다.

## 1. 현재 병합 기준

### 현재 기준 구조
- NestJS + MongoDB + Mongoose

### 유지한 것
- 팀원 코드의 Posts / Users 모듈 구조
- 팀원 코드의 Mongoose schema 방향
- App 설정 흐름

### 통일한 것
- Controller / Service / Module 구조
- ValidationPipe
- Swagger
- JWT Guard
- 테스트 구조

즉, 현재 버전은 **Express가 아니라 NestJS로 완전히 통일된 구조**입니다.

## 2. 파일별 반영 내역

### A. App 레벨
#### 반영된 팀원 파일
- `app.module.ts`
- `main.ts`
- `app.controller.ts`
- `app.service.ts`

#### 최종 반영 방식
- `MongooseModule.forRoot(...)` 구조 유지
- CORS 설정 방향 유지
- 루트 엔드포인트 유지
- Swagger 추가
- Global ValidationPipe 추가
- Global Exception Filter 추가

### B. Posts 모듈
#### 반영된 팀원 파일
- `posts.controller.ts`
- `posts.module.ts`
- `posts.service.ts`
- `post.schema.ts`

#### 유지한 요소
- `PostsModule` 이름 유지
- `/posts` 라우트 유지
- `MongooseModule.forFeature(...)` 구조 유지
- `PostSchema` 기반 모델 유지
- `author`, `content`, `imageUrl`, `likedBy` 구조 유지

#### 추가 / 수정한 요소
- 단일 게시글 조회
- 게시글 수정 / 삭제
- 좋아요 / 좋아요 취소
- Swagger 데코레이터
- JWT Guard 적용
- 이미지 업로드 엔드포인트

### C. Users 모듈
#### 반영된 팀원 파일
- `users.controller.ts`
- `users.module.ts`
- `users.service.ts`
- `user.schema.ts`

#### 유지한 요소
- `UsersModule` 이름 유지
- `/users` 라우트 유지
- `UserSchema` 기반 구조 유지
- `following`, `followers` 배열 구조 유지

#### 추가 / 수정한 요소
- 사용자 생성
- 전체 사용자 조회
- 단일 사용자 조회
- `role` 필드 추가
- 비밀번호 해싱
- 비밀번호 기본 조회 제외

### D. Auth 모듈
#### 새로 추가한 파일
- `auth.module.ts`
- `auth.controller.ts`
- `auth.service.ts`
- `auth/dto/*`
- `auth/guards/jwt.guard.ts`

#### 설명
로그인 / 회원가입 / JWT 인증 구조를 NestJS 방식으로 추가했습니다.

### E. Comments 모듈
#### 새로 추가한 파일
- `comments.module.ts`
- `comments.controller.ts`
- `comments.service.ts`
- `comments/schemas/comment.schema.ts`
- `comments/dto/create-comment.dto.ts`

#### 반영 방식
댓글 기능은 최종적으로 모두 NestJS + Mongoose 구조로 구현했습니다.

### F. Follow 모듈
#### 새로 추가한 파일
- `follow.module.ts`
- `follow.controller.ts`
- `follow.service.ts`
- `follow/dto/follow.dto.ts`

#### 반영 방식
`UserSchema` 내부의 `following`, `followers` 배열을 활용해 NestJS 방식으로 구현했습니다.

## 3. Express 관련 처리 결과

초기에 팀 자료 중 일부는 Express 예제 스타일과 유사한 흐름을 가지고 있었지만,  
현재 버전에서는 이 흐름을 직접 유지하지 않았습니다.

대신:
- 라우트 목적은 유지
- 데이터 흐름은 유지
- 구현은 모두 NestJS Controller / Service / Module로 재구성
