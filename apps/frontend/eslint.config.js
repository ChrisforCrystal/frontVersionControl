import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// ESLint 9+ 使用 "Flat Config" (扁平配置) 格式
export default defineConfig([
  // 1. 全局忽略 (类似 .eslintignore)
  globalIgnores(['dist']),

  // 2. 针对 TS/TSX 文件的配置对象
  {
    files: ['**/*.{ts,tsx}'],

    // 继承推荐规则集合
    extends: [
      js.configs.recommended,           // ESLint 核心推荐规则
      tseslint.configs.recommended,     // TypeScript 推荐规则
      reactHooks.configs.flat.recommended, // React Hooks 规则 (检查依赖项等)
      reactRefresh.configs.vite,        // React Refresh 规则 (防止 HMR 时组件状态丢失)
    ],

    // 语言选项
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // 注入浏览器全局变量 (window, document 等)，防止报 "undefined"
    },
  },
])
