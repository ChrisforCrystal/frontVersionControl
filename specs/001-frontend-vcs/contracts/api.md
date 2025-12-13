# API Contract: Frontend Version Control

## 1. Page Render (Public)

**Endpoint**: `GET /`

**Description**: 根据当前配置的版本，动态渲染 HTML 页面并注入对应的 JS/CSS 资源。

**Request**:
- Headers: `Accept: text/html`

**Response**:
- Status: `200 OK`
- Body: `text/html`

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Injected CSS from Manifest -->
    <link rel="stylesheet" href="/assets/main.c5d6e7.css">
  </head>
  <body>
    <div id="root"></div>
    <!-- Injected JS from Manifest -->
    <script type="module" src="/assets/main.d8e9f1.js"></script>
    <script>window.__VERSION__ = "v1.0.0";</script>
  </body>
</html>
```

---

## 2. Version Management (Admin)

**Endpoint**: `POST /api/admin/version`

**Description**: 切换当前生效的前端版本（Rollback/Upgrade）。

**Request**:
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "version": "v1.0.1"
}
```

**Response**:
- Status: `200 OK`
- Body:

```json
{
  "success": true,
  "previousVersion": "v1.0.0",
  "currentVersion": "v1.0.1"
}
```

**Errors**:
- `400 Bad Request`: Version format invalid.
- `404 Not Found`: Version manifest does not exist in artifacts.
