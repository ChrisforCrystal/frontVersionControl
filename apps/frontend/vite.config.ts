import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
  // 插件系统: 这里使用了 React 插件
  // 它负责处理 JSX/TSX 转换，以及 HMR (热更新) 等 React 特定功能
  plugins: [react()],

  // 构建配置 (Build Options)
  build: {
    // [Backend Integration Key]
    // 生成 manifest.json 文件。
    // 这是一个映射表，后端通过它可以查到 index.html 对应的 JS/CSS 文件名。
    // 例如: "index.html": { "file": "assets/index.a1b2c.js", "css": [...] }
    manifest: true,

    // Rollup 底层配置 (Vite 构建底层用的是 Rollup)
    rollupOptions: {
      output: {
        // [Cache Strategy] 文件名哈希化
        // [name]: 原始文件名。对于入口文件，它来自 index.html (最终叫 index); 
        //         对于代码分割块，它来自 import() 动态导入的文件名或者 node_modules 包名。
        //         Rollup 会自动分析依赖图来决定这个名字。
        // [hash]: 根据文件内容计算出的 8 位哈希值 (如 xh82a)
        // [ext]: 文件扩展名
        // 作用: 只要代码改动一个字符，Hash 就会变，文件名就会变。
        // 这让我们可以安全地设置 HTTP 响应头 Cache-Control: forever，实现永久缓存。
        entryFileNames: 'assets/[name].[hash].js',  // 入口文件 (Entry point)
        chunkFileNames: 'assets/[name].[hash].js',  // 代码分割块 (Chunks)
        assetFileNames: 'assets/[name].[hash].[ext]' // 静态资源 (Images, Fonts, CSS)
      }
    }
  }
})
