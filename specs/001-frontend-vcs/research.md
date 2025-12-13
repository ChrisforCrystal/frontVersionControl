# Research & Decisions: Frontend Version Control

**Decision 1: Use Vite Manifest for Asset Mapping**
- **Decision**: 利用 Vite 构建工具的 `build.manifest: true` 选项生成资源清单。
- **Rationale**: Vite 原生支持生成 `manifest.json`，详细记录了源码与 hashed 产物的映射关系，这是业界标准做法，无需重复造轮子。
- **Alternatives**: 
  - *Webpack Manifest Plugin*: 配置相对复杂。
  - *Generic Hash Map script*: 需要手动解析 HTML/JS 文件，容易出错且维护成本高。

**Decision 2: Backend-Side Injection (SSR-like)**
- **Decision**: 后端服务（Node.js）作为 HTML 渲染的唯一入口。
- **Rationale**: 允许后端在运行时（Request time）决定注入哪个版本的 JS/CSS。这满足了“毫秒级切换”和“灰度发布”的需求。
- **Alternatives**:
  - *Nginx Rewrite*: 通过 Nginx 规则重写路径。缺点是配置不够灵活，难以实现复杂的灰度逻辑（如按 UserID 灰度）。
  - *Frontend Runtime Loader*: 前端先加载一个微小的 `loader.js`，再由它请求版本接口并动态加载资源。缺点是此时已经发生了 HTTP 请求，增加了首屏延迟（Round Trip），且 loader 本身也需要版本控制。

**Decision 3: Content Addressable Storage + Semantic Versioning**
- **Decision**: 产物存储路径采用 `v{Version}/{FileHash}` 的结构。
- **Rationale**: 
  - `v{Version}` 目录提供了人类可读的版本隔离，方便回滚和归档。
  - `{FileHash}` 文件名提供了 HTTP 长缓存（Immutable Caching）的能力。
- **Alternatives**:
  - *Only Hash*: `assets/{Hash}.js`。难以直观知道哪些文件属于哪个版本，清理旧版本困难。
  - *Query String Version*: `app.js?v=1.0`。缓存机制在某些 CDN 上不可靠，且不支持并存多版本（同名文件覆盖）。

**Decision 4: Local Filesystem as OSS Mock**
- **Decision**: 在 POC 阶段，使用本地 `artifacts/` 目录模拟 OSS 对象存储。
- **Rationale**: 降低开发和测试环境的复杂度，无需配置 AWS S3 或 MinIO。只要接口设计为 `fetch(url)`，切换到真实 URL 仅需更改配置。
