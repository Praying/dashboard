# Dashboard Frontend - 运行指南

请按照以下步骤在您的本地环境中启动前端开发服务器。

## 前提条件

您需要安装 [Node.js](https://nodejs.org/) (推荐 LTS 版本) 和 npm (通常随 Node.js 一起安装)。

## 1. 安装依赖

进入 `dashboard` 目录，然后使用 npm 安装 `package.json` 中定义的所有依赖项。这将在 `dashboard` 目录下创建一个 `node_modules` 文件夹。

```bash
# 在 pbgui 根目录下执行
cd dashboard
npm install
```

## 2. 运行开发服务器

安装完依赖后，运行 `dev` 脚本来启动 Vite 开发服务器。

```bash
# 确保您在 dashboard 目录下
npm run dev
```

服务器启动后，您会在终端看到类似以下的输出：

```
  VITE v5.2.0  ready in 315 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 3. 验证

在浏览器中打开终端提示的 `Local` 地址 (通常是 [http://localhost:5173/](http://localhost:5173/))。

您应该能看到一个简单的欢迎页面，其中包含一个 Element Plus 样式的按钮。

**重要提示:**
我们在 `vite.config.ts` 中配置了代理。这意味着，当您在前端代码中向 `/api/...` 发出请求时，Vite 开发服务器会自动将该请求转发到正在运行的后端服务 (http://127.0.0.1:8000)，从而避免了浏览器跨域问题。
