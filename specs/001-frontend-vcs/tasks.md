# Tasks: Frontend Version Control System

**Feature Branch**: `001-frontend-vcs`
**Status**: Pending

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 初始化 Monorepo 结构和基础环境

- [x] T001 Create monorepo structure (apps/frontend, apps/backend) <!-- id: 5 -->
- [x] T002 [P] Initialize root package.json and pnpm workspace <!-- id: 6 -->
- [x] T003 [P] Configure shared TypeScript config in tsconfig.base.json <!-- id: 7 -->

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 定义核心数据结构和存储目录

- [x] T004 Create artifacts directory structure for local storage simulation <!-- id: 8 -->
- [x] T005 [P] Define Zod schemas for Manifest and VersionConfig in apps/backend/src/types/schemas.ts <!-- id: 9 -->
- [x] T006 [P] Create initial manifest.json mock for testing in artifacts/v1.0.0/manifest.json <!-- id: 10 -->

## Phase 3: User Story 1 - Versioned Build & Publish (Priority: P1)

**Goal**: 前端构建生成带有 Hash 的产物和 Manifest 清单

**Independent Test**: 运行 `pnpm build` 后，检查 `dist` 目录是否存在 `manifest.json` 且文件名包含 Hash。

### Implementation for User Story 1

- [x] T007 [P] [US1] Initialize Vite+React app in apps/frontend <!-- id: 11 -->
- [x] T008 [US1] Configure vite.config.ts to enable build.manifest and custom output structure <!-- id: 12 -->
- [x] T009 [US1] Implement publish script in scripts/publish.ts to move artifacts to versioned folder <!-- id: 13 -->
- [x] T010 [US1] Add publish command to apps/frontend/package.json <!-- id: 14 -->

## Phase 4: User Story 2 - Dynamic Runtime Injection (Priority: P1)

**Goal**: 后端根据配置动态注入 JS/CSS 资源

**Independent Test**: 请求 `GET /`，验证返回的 HTML 中包含 Manifest 指定的资源路径。

### Implementation for User Story 2

- [x] T011 [P] [US2] Initialize Express app in apps/backend <!-- id: 15 -->
- [x] T012 [US2] Implement VersionService to load manifest from artifacts directory in apps/backend/src/services/VersionService.ts <!-- id: 16 -->
- [x] T013 [US2] Implement HTML template matching the contract in apps/backend/src/views/index.html <!-- id: 17 -->
- [x] T014 [US2] Implement GET / route to render page with injected resources in apps/backend/src/app.ts <!-- id: 18 -->

## Phase 5: User Story 3 - Instant Rollback (Priority: P2)

**Goal**: 通过 API 动态切换当前版本

**Independent Test**: 调用 `POST /api/admin/version` 切换版本，再次请求 `GET /` 确认资源路径已变更。

### Implementation for User Story 3

- [x] T015 [US3] Add state management for activeVersion in VersionService.ts <!-- id: 19 -->
- [x] T016 [US3] Implement POST /api/admin/version endpoint in apps/backend/src/app.ts <!-- id: 20 -->
- [x] T017 [US3] Add validation logic to ensure requested version exists <!-- id: 21 -->

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 文档和清理

- [x] T018 [P] Update root README.md with project overview <!-- id: 22 -->
- [x] T019 Verify Quickstart steps work as expected <!-- id: 23 -->

## Dependencies & Execution Order

1. **Setup & Foundational**: Must be completed first.
2. **US1 (Frontend)** and **US2 (Backend)**: Can be developed in parallel after Foundational.
   - Frontend team works on T007-T010.
   - Backend team works on T011-T014 using the mock manifest from T006.
3. **US3**: Depends on US2 completion (modifies existing service).

## Implementation Strategy

1. **MVP**: Complete Phase 1, 2, 3, 4. Result: A system that can build versioned assets and serve them.
2. **V1.0**: Complete Phase 5. Result: A system that supports hot-swapping versions via API.
