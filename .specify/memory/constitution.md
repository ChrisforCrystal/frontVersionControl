<!--
Sync Impact Report:
- Version change: Initial Draft -> 1.0.0
- List of modified principles: Defined 4 core principles for Frontend Version Control.
- Added sections: Governance for version control.
- Removed sections: N/A (Template instantiation).
- Templates requiring updates: None (aligned with standard templates).
- Follow-up TODOs: None.
-->

# 前端版本控制系统章程 (Constitution)

## 核心原则 (Core Principles)

### I. 产物不可变性 (Immutability of Artifacts)
所有前端构建产物（JS, CSS, SourceMaps 等）必须包含唯一版本号或哈希值。一旦发布，特定版本的产物**绝对不可修改**。任何变更必须产生新的版本号。这确保了可回溯性和部署的确定性。

### II. 清单驱动 (Manifest-Driven)
构建过程必须生成一个 `manifest.json` 清单文件，明确列出当前版本的所有入口文件（Entry Points）及其对应的资源路径。后端服务必须仅依赖此清单来解析和加载前端资源，通过清单解耦构建与运行。

### III. 后端控制注入 (Backend-Controlled Injection)
前端不直接控制页面的渲染入口。后端服务负责根据配置的版本号，动态生成 HTML 结构，并注入对应的 `<script>` 和 `<link>` 标签（通常是 `<root>` 容器及相关资源）。这允许后端在毫秒级实现版本切换、灰度发布或回滚，而无需重新部署前端应用。

### IV. 构建与运行分离 (Separation of Build and Runtime)
前端构建流水线（Pipeline）负责生成产物并上传至对象存储（OSS）或 CDN，构建过程不应依赖运行时环境。运行时环境（后端）仅负责按需拉取或引用这些静态资源。两者通过版本号和清单文件进行契约式协作。

## 系统约束 (System Constraints)

### 部署标准
前端产物必须部署在支持高并发读取的存储服务（如 OSS/CDN）上。后端服务必须具备缓存清单文件的能力，以避免频繁请求存储服务，同时需提供清除缓存的机制以支持紧急发布。

## 开发工作流 (Development Workflow)

### 发布流程
1. 前端代码提交 -> 2. CI流水线构建 -> 3. 生成带版本号产物 & Manifest -> 4. 上传至 OSS -> 5. 通知后端/更新配置 -> 6. 后端动态加载新版本。

## 治理 (Governance)

本章程是项目技术决策的最高准则。任何架构变更或功能实现若违背上述原则（如：允许覆盖旧版本产物、前端硬编码版本等），必须经过技术委员会（或核心维护者）的一致同意并修订本章程。

修订需遵循语义化版本控制：
- **MAJOR**: 修改核心原则（如放弃不可变性）。
- **MINOR**: 增加新的原则或显著扩展现有原则。
- **PATCH**: 文字润色或解释性补充。

**Version**: 1.0.0 | **Ratified**: 2025-12-14 | **Last Amended**: 2025-12-14
