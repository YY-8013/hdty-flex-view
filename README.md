# HDty Framework W4 - Vue 2 项目

## 项目概述

这是一个基于 Vue 2 和 Webpack 4 构建的前端项目框架，专为 HDty 系统设计。

## 环境要求

- **Node.js**: 必须使用 14.x 版本（14.21.3）
- **npm**: 6.x 版本 (随 Node 14 自动安装)

## 安装

```
npm cache clean --f

Bash复制# 使用 npm 
npm install 
 
# 或者使用 yarn 
yarn install 
```

## 开发命令

### 启动开发服务器

```
Bash

复制
npm run dev 
```

- 使用 `--no-lint` 参数跳过代码检查
- 开发服务器默认运行在 `http://localhost:8080`

### 构建生产版本

```
Bash

复制
npm run build 
```

此命令会:

1. 首先执行 `scripts/version-updater.js` 更新版本号
2. 然后构建生产包
3. 跳过代码检查 (`--no-lint`)

### 构建生产版本(不更新版本号)

```
Bash

复制
npm run build:no-version 
```

### 代码检查

```
Bash

复制
npm run lint 
```

## 项目结构

```
hdty-flex-view
├── public/                # 静态资源 
├── src/                   # 源代码 
│   ├── assets/            # 资源文件 
│   ├── components/        # 公共组件 
│   ├── router/            # 路由配置 
│   ├── store/             # Vuex 状态管理 
│   ├── views/             # 页面组件 
│   ├── App.vue             # 根组件 
│   └── main.js             # 应用入口 
├── scripts/               # 构建脚本 
│   └── version-updater.js  # 版本更新脚本 
├── package.json            # 项目配置 
└── vue.config.js           # Vue CLI 配置 
```

## 注意事项

1. Node 版本要求

   :

   - 必须使用 Node.js 14.x 版本
   - 使用其他版本可能导致兼容性问题

2. 生产构建

   :

   - 正式构建请使用 `npm run build`，它会自动更新版本号
   - 需要跳过版本更新时使用 `build:no-version`

3. 代码规范

   :

   - 开发时可以使用 `--no-lint` 提高速度
   - 提交代码前请运行 `npm run lint` 确保代码规范

## 依赖管理

项目使用 `package-lock.json` 锁定依赖版本，请勿手动修改依赖版本。
