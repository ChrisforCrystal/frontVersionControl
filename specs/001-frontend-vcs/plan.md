# Implementation Plan: Frontend Version Control System

**Branch**: `001-frontend-vcs` | **Date**: 2025-12-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-frontend-vcs/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

本计划旨在实现一个基于 **Vite + React** 和 **Node.js** 的前端版本控制系统原型。
核心机制是通过 Vite 生成带有 Content Hash 的静态资源和 `manifest.json` 清单文件。构建产物将模拟发布的流程（存储在特定版本目录）。
后端服务（Node.js Express）将作为运行时环境，负责根据配置的 "当前版本" 读取对应的 Manifest，并将 JS/CSS 标签动态注入到 HTML 模板中，从而实现毫秒级的版本切换和回滚。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**: Vite 5 (Build/Manifest), React 18 (UI), Express (Backend Demo), Zod (Validation)
**Storage**: 本地文件系统模拟 OSS (e.g., `artifacts/v1.0.0/`)
**Testing**: Vitest (Unit/Integration)
**Target Platform**: Web Browsers (Frontend), Linux/Container (Backend)
**Project Type**: Monorepo (apps/frontend, apps/backend)
**Performance Goals**: 版本切换生效时间 < 1s, HTML 渲染增加延迟 < 10ms
**Constraints**: 必须严格遵循“产物不可变”原则，禁止覆盖原有版本文件
**Scale/Scope**: 原型验证，支持 2-3 个并发版本切换

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. 产物不可变性**: Vite 构建默认生成 Content Hash 文件名，确保唯一性。计划使用语义化版本目录隔离不同构建。
- [x] **II. 清单驱动**: Vite 的 `build.manifest` 选项原生支持生成 `manifest.json`，后端将依赖此文件。
- [x] **III. 后端控制注入**: 后端将接管 HTML 响应，仅根据 Manifest 注入资源，不依赖前端硬编码。
- [x] **IV. 构建与运行分离**: 构建脚本负责产出文件，后端服务仅需读取权限，解耦清晰。

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-vcs/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Monorepo Structure
.
├── apps/
│   ├── frontend/        # Vite + React 应用
│   │   ├── src/
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── backend/         # Node.js 版本控制服务
│       ├── src/
│       │   ├── app.ts
│       │   ├── services/
│       │   │   └── VersionService.ts # 解析 Manifest, 注入 HTML
│       │   └── config/
│       └── package.json
├── artifacts/           # 模拟 OSS 存储
│   ├── v1.0.0/
│   │   ├── manifest.json
│   │   └── assets/...
│   └── v1.0.1/
├── scripts/
│   └── publish.ts       # 模拟发布脚本：构建 -> 移动到 artifacts/vX.Y.Z
└── package.json
```

**Structure Decision**: 采用 Monorepo 结构，将 Frontend（生产者）和 Backend（消费者）放在同一仓库但在逻辑上分离，通过 `artifacts/` 目录模拟远程存储交互。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
