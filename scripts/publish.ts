import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { prompt } from 'enquirer';

// 从命令行参数获取版本号
// version 示例: "v1.0.0", "v1.0.1", "beta-2.0" (纯字符串，用于作为目录名)
const versionArg = process.argv[2];

async function publish() {
    let version = versionArg;

    // 如果没有提供参数，则交互式询问
    if (!version) {
        const response = await prompt<{ version: string }>({
            type: 'input',
            name: 'version',
            message: 'Enter version to publish (e.g., v1.0.0):',
            validate: (value) => !!value || 'Version is required'
        });
        version = response.version;
    }

    // 定义路径变量
    const rootDir = path.resolve(__dirname, '..');
    const frontendDir = path.join(rootDir, 'apps/frontend');
    // versioned folder: 核心概念，每个版本都有独立的存储目录
    const artifactsDir = path.join(rootDir, 'artifacts', version);
    const distDir = path.join(frontendDir, 'dist');

    console.log(`🚀 Publishing version ${version}...`);

    // 1. 执行前端构建
    // 这会调用 vite build，生成带有 content-hash 的静态资源和 manifest.json
    console.log('📦 Building frontend...');
    try {
        // 1.1 类型检查 (Gatekeeper)
        // Vite 构建默认忽略 TS 错误，所以必须先运行 tsc。
        // 如果这里报错，脚本直接退出，阻止发布有问题的代码。
        console.log('  -> Running Type Check...');
        execSync('npx tsc -b', { cwd: frontendDir, stdio: 'inherit' });

        // 1.2 生产环境构建 (Path Injection)
        // --base=/artifacts/${version}/ 是核心配置。
        // 它确保生成的 HTML/JS/CSS 引用都带有版本前缀 (e.g., src="/artifacts/v1.0.3/assets/index.js")
        // 这样后端渲染时，浏览器才能找到正确的版本资源。
        console.log(`  -> Building with base path: /artifacts/${version}/`);
        execSync(`npx vite build --base=/artifacts/${version}/`, { cwd: frontendDir, stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Build failed');
        process.exit(1);
    }

    // 2. 检查版本是否存在 (核心逻辑：不可变性)
    // 如果该版本目录已经存在，绝对禁止覆盖。必须发布新版本。
    if (await fs.pathExists(artifactsDir)) {
        console.error(`❌ Version ${version} already exists. IMMUTABILITY RULE DETECTED.`);
        process.exit(1);
    }

    // 3. 移动产物到模拟的 OSS 目录
    console.log(`📂 Moving artifacts to ${artifactsDir}...`);
    await fs.ensureDir(artifactsDir);
    await fs.copy(distDir, artifactsDir);

    console.log(`✅ Successfully published version ${version}!`);
}

publish().catch(console.error);
