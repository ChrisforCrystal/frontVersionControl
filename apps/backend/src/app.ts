import express from 'express';
import path from 'path';
import fs from 'fs';
import { versionService } from './services/VersionService';

const app = express();
const port = 3000;

app.use(express.json());

// 静态资源服务: 将 /artifacts 路径映射到实际的存储目录
// 实际上生产环境这里通常是 CDN 地址，不用后端处理静态文件流量
app.use('/artifacts', express.static(path.resolve(__dirname, '../../../artifacts')));

// 核心路由: 页面渲染 (Server-Side Injection)
app.get('/', async (_req, res) => {
    try {
        // 1. 获取当前应该展示的版本
        const version = versionService.getActiveVersion();
        // 2. 从 Manifest 获取该版本的入口文件信息 (文件名, hash等)
        const entry = await versionService.getEntryAssets(version);

        // 3. 读取 HTML 模板 (这是一个不包含具体 JS/CSS 引用的骨架)
        let html = fs.readFileSync(path.join(__dirname, 'views/index.html'), 'utf-8');

        // 4. 构建资源 URL
        // 注意：这里需要加上版本号作为路径前缀，确保总是请求到正确版本的资源
        const scriptSrc = `/artifacts/${version}/${entry.file}`;
        const cssHrefs = (entry.css || []).map(css =>
            `<link rel="stylesheet" href="/artifacts/${version}/${css}">`
        ).join('\n');

        // 5. 注入到 HTML (字符串替换)
        // 这一步实现了“构建”与“运行”的解耦，后端决定了前端加载什么
        html = html.replace('<!-- INJECT_STYLES -->', cssHrefs);
        html = html.replace('<!-- INJECT_SCRIPTS -->', `<script type="module" src="${scriptSrc}"></script>`);

        // 注入版本号全局变量，方便调试和监控
        html = html.replace('<!-- INJECT_VERSION -->', version);

        // 6. 返回最终 HTML
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error: ' + (error instanceof Error ? error.message : String(error)));
    }
});

// 管理接口: 动态切换版本 (Admin API)
app.post('/api/admin/version', (req, res) => {
    const { version } = req.body;
    if (!version) {
        res.status(400).json({ error: 'Version is required' });
        return;
    }

    try {
        const prev = versionService.getActiveVersion();
        // 调用 Service 切换状态内存
        versionService.setActiveVersion(version);
        res.json({ success: true, previousVersion: prev, currentVersion: version });
    } catch (error) {
        res.status(404).json({ error: (error instanceof Error ? error.message : String(error)) });
    }
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
    console.log(`Artifacts root: ${path.resolve(__dirname, '../../../artifacts')}`);
});
