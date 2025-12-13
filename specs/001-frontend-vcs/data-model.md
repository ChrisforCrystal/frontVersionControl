# Data Model: Frontend Version Control

## Entities

### Manifest (JSON)

构建工具生成的清单文件，描述当前版本的所有资源。

```typescript
interface Manifest {
  [entryPoint: string]: ManifestChunk;
}

interface ManifestChunk {
  file: string;           // 产物文件名 (e.g., "assets/index.2f3a4b.js")
  src?: string;           // 源码路径 (e.g., "src/main.tsx")
  isEntry?: boolean;      // 是否为入口 chunk
  css?: string[];         // 关联的 CSS 文件列表
  assets?: string[];      // 关联的其他静态资源
  imports?: string[];     // 动态导入的 chunk
}
```

**Example `manifest.json`**:
```json
{
  "src/main.tsx": {
    "file": "assets/main.d8e9f1.js",
    "src": "src/main.tsx",
    "isEntry": true,
    "css": ["assets/main.c5d6e7.css"]
  }
}
```

### Version Config (Runtime)

后端服务的运行时配置，决定加载哪个版本的 Manifest。

```typescript
interface VersionConfig {
  activeVersion: string;  // 当前生效版本 (e.g., "v1.0.0")
  manifestPath: string;   // Manifest 的存储路径模板
  // e.g., "artifacts/{version}/manifest.json"
}
```

## Storage Layout

```text
artifacts/
├── v1.0.0/
│   ├── manifest.json
│   └── assets/
│       ├── main.d8e9f1.js
│       └── main.c5d6e7.css
└── v1.0.1/
    ├── manifest.json
    └── assets/
        ├── main.a1b2c3.js
        └── main.x8y9z0.css
```
