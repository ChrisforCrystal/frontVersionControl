import fs from 'fs-extra';
import path from 'path';
import { Manifest, ManifestSchema } from '../types/schemas';

export class VersionService {
    private activeVersion: string = 'v1.0.0'; // 当前生效的版本号，默认值
    private manifestCache: Record<string, Manifest> = {}; // 内存缓存，避免频繁读取文件 IO
    private artifactsRoot: string;

    constructor() {
        // 确定 artifacts (模拟 OSS) 的根目录路径
        this.artifactsRoot = path.resolve(__dirname, '../../../../artifacts');
    }

    // 获取当前版本
    public getActiveVersion(): string {
        return this.activeVersion;
    }

    // 设置/切换当前版本
    public setActiveVersion(version: string) {
        // 必须验证版本是否存在，防止切坏
        const manifestPath = this.getManifestPath(version);
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`Version ${version} does not exist`);
        }
        this.activeVersion = version;
        console.log(`✅ Switched to version ${version}`);
    }

    // 加载指定版本的 Manifest 清单
    public async getManifest(version: string = this.activeVersion): Promise<Manifest> {
        // 优先从内存缓存读取
        if (this.manifestCache[version]) {
            return this.manifestCache[version];
        }

        const manifestPath = this.getManifestPath(version);
        console.log(`📂 Loading manifest from ${manifestPath}`);

        // 文件级检查
        if (!await fs.pathExists(manifestPath)) {
            throw new Error(`Manifest not found for version ${version}`);
        }

        // 读取并解析 JSON
        const content = await fs.readJSON(manifestPath);
        console.log(`[DEBUG] Manifest for ${version}:`, JSON.stringify(content, null, 2));
        // 使用 Zod 验证 Manifest 格式是否符合预期
        const result = ManifestSchema.safeParse(content);

        if (!result.success) {
            console.error('Validation error:', result.error);
            throw new Error(`Invalid manifest format for version ${version}`);
        }

        // 写入缓存
        this.manifestCache[version] = result.data;
        return result.data;
    }

    // 获取入口资源 (index.html 对应的 JS/CSS)
    public async getEntryAssets(version: string = this.activeVersion) {
        const manifest = await this.getManifest(version);

        // Vite 构建的 key 通常是源码路径，如 "index.html"
        const entryKey = 'index.html';
        const entry = manifest[entryKey];

        if (!entry) {
            // 容错：如果找不到 index.html key，尝试寻找任意 isEntry: true 的 chunk
            const found = Object.values(manifest).find(chunk => chunk.isEntry);
            if (found) return found;

            throw new Error(`No entry point found in manifest for version ${version}`);
        }

        return entry;
    }

    // 辅助函数：生成 Manifest 文件绝对路径
    private getManifestPath(version: string): string {
        // 约定路径结构: artifacts/{version}/.vite/manifest.json
        return path.join(this.artifactsRoot, version, '.vite', 'manifest.json');
    }
}

export const versionService = new VersionService();
