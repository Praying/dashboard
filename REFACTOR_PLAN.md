# pbgui 项目重构方案设计文档

本文档旨在为 pbgui 项目的全面重构提供详细的规划和设计方案，确保重构过程的顺利进行和最终交付质量。

## 1. 架构设计

### 1.1. 总体架构
- **前后端分离**: 采用完全的前后端分离架构模式。
  - **前端 (dashboard)**: 基于 Vue 3 的单页面应用 (SPA)，负责所有用户界面的渲染和交互。
  - **后端 (backend-api)**: 基于 FastAPI 的 API 服务，负责处理业务逻辑、数据持久化和与 Passivbot 核心脚本的交互。
- **通信协议**: 前后端之间通过标准化的 RESTful API 进行通信，数据格式为 JSON。

### 1.2. 项目目录结构
- **`pbgui/` (项目根目录)**
  - **`dashboard/`**: 前端 Vue 项目。
    - `public/`
    - `src/`
      - `api/`       (API 请求封装)
      - `assets/`    (静态资源)
      - `components/`(可复用组件)
      - `layouts/`   (布局组件)
      - `router/`    (路由配置)
      - `store/`     (Pinia 状态管理)
      - `styles/`    (全局样式)
      - `utils/`     (工具函数)
      - `views/`     (页面视图)
      - `App.vue`
      - `main.ts`
    - `package.json`
    - `vite.config.ts`
    - `...`
  - **`backend-api/`**: 后端 FastAPI 项目。
    - `app/`
      - `api/`
        - `v1/`      (API v1 版本)
          - `endpoints/` (路由/端点定义)
          - `schemas/`   (Pydantic 数据模型)
          - `deps.py`    (依赖注入)
      - `core/`      (核心配置、安全等)
      - `crud/`      (数据库操作)
      - `models/`    (数据库模型，如果需要)
      - `services/`  (业务逻辑服务层，封装对原 Passivbot 脚本的调用)
      - `main.py`    (FastAPI 应用实例)
    - `tests/`       (单元/集成测试)
    - `requirements.txt`
    - `.env`
  - **`REFACTOR_PLAN.md`**: (本文档)
  - **(保留原有 Passivbot 相关文件和目录)**: `data/`, `BacktestV7.py`, `pbgui.ini` 等将继续由后端服务进行读写。

### 1.3. 部署策略
- **开发环境**:
  - 前端: 使用 Vite 开发服务器，通过代理 (`proxy`) 解决跨域问题，请求转发至后端 FastAPI 服务。
  - 后端: 使用 `uvicorn` 启动 FastAPI 开发服务器，并开启 `reload` 模式。
- **生产环境**:
  - **方式一 (集成部署)**:
    1. 前端执行 `npm run build`，生成静态文件 (HTML, CSS, JS)。
    2. FastAPI 后端配置 `StaticFiles`，将 `/` 路径指向前端构建出的 `index.html`，并将 `/assets` 等静态资源路径指向前端的静态文件目录。
    3. 整个应用作为一个单独的服务运行，通过 Gunicorn + Uvicorn Worker 部署。
  - **方式二 (分离部署)**:
    1. 前端部署在 Nginx 或 Vercel/Netlify 等静态托管服务上。
    2. 后端 API 服务独立部署。
    3. 通过 Nginx 反向代理配置解决跨域问题。
- **推荐**: 初期采用**集成部署**策略，简化部署流程。待系统规模扩大或有更高性能要求时，再迁移至分离部署。

## 2. 技术选型说明

### 2.1. 前端技术栈 (dashboard)

| 技术/库 | 版本 | 用途与选型理由 |
| :--- | :--- | :--- |
| **Vue.js** | 3.x | **核心框架**。采用其最新的 Composition API，能更好地组织逻辑、提升代码复用性，并提供优秀的 TypeScript 支持。其响应式系统和组件化思想非常适合构建复杂的数据驱动型 UI。 |
| **Vite** | 5.x | **构建工具**。提供闪电般的冷启动速度和模块热更新 (HMR)，极大提升开发体验。相比 Webpack，配置更简洁，开箱即用。 |
| **Element Plus** | 2.x | **UI 组件库**。专为 Vue 3 设计，提供丰富、高质量且设计现代的 UI 组件（表格、表单、弹窗、图表等），能大幅加速前端页面的开发，并保证 UI 的一致性和专业性。 |
| **Pinia** | 2.x | **状态管理**。Vue 官方推荐的新一代状态管理库。相比 Vuex，API 设计更简洁、直观，完美支持 TypeScript 类型推断，且没有 `mutations` 的概念，心智负担更小。 |
| **Vue Router** | 4.x | **路由管理**。Vue 官方路由库，用于实现前端页面的路由切换，构建单页面应用 (SPA)。 |
| **Axios** | 1.x | **HTTP 客户端**。用于与后端 FastAPI 服务进行 API 通信。功能强大，支持请求/响应拦截、取消请求等高级功能，是社区公认的最佳实践。 |
| **ECharts** | 5.x | **数据可视化**。功能极其强大的数据可视化库，支持各种复杂的图表（折线图、K线图、饼图、关系图等），非常适合本项目中大量的回测结果和市场数据展示需求。 |
| **TypeScript** | 5.x | **编程语言**。为 JavaScript 提供静态类型检查，能显著提升代码的健壮性、可维护性和可读性，尤其适合大型、长期的项目。 |
| **Sass/SCSS** | - | **CSS 预处理器**。提供变量、嵌套、混入等高级功能，使 CSS 的编写更具工程化和可维护性。 |

### 2.2. 后端技术栈 (backend-api)

| 技术/库 | 版本 | 用途与选型理由 |
| :--- | :--- | :--- |
| **Python** | 3.10+ | **核心语言**。与 Passivbot 现有代码库保持一致，便于复用和集成。 |
| **FastAPI** | - | **Web 框架**。基于 Starlette 和 Pydantic，拥有极高的性能（可与 NodeJS、Go 媲美）。其最大的优势是能基于 Pydantic 模型和 Python 的类型提示**自动生成交互式的 API 文档 (Swagger UI)**，完美契合本项目的需求。 |
| **Pydantic** | 2.x | **数据验证与模型**。FastAPI 的核心依赖。用于定义 API 的请求体、响应体的数据结构，能提供运行时的数据验证和强大的类型提示支持，极大提升 API 的健壮性。 |
| **Uvicorn** | - | **ASGI 服务器**。官方推荐的用于运行 FastAPI 应用的 ASGI (Asynchronous Server Gateway Interface) 服务器。 |
| **Gunicorn** | - | **WSGI/ASGI 进程管理器**。在生产环境中，使用 Gunicorn 管理 Uvicorn worker 进程，可以实现多进程部署，充分利用服务器的多核 CPU 资源，提升并发处理能力。 |
| **SQLModel** | - | **ORM (可选)**。如果未来需要引入新的数据库表（例如存储用户偏好、操作日志等），SQLModel 是一个优秀的选择。它结合了 SQLAlchemy 和 Pydantic，可以用一套代码同时定义数据库模型和 API 数据模型。 |
| **APScheduler** | - | **任务调度**。用于替代原有的独立进程 `BacktestV7.py` 监控逻辑。可以在 FastAPI 应用的生命周期内启动一个后台调度器，定期检查回测队列并启动新任务，使任务管理与主应用融为一体。 |

## 3. UI/UE 重构思路

本次重构的核心目标之一是**显著提升用户体验 (UX)** 和**界面设计 (UI)** 的现代化水平。我们将摒弃 Streamlit 脚本化的页面布局，采用更符合现代 Web 应用标准的、经过精心设计的交互范式。

### 3.1. 整体布局与导航

- **统一的导航栏**: 设计一个固定的顶部导航栏和左侧可伸缩的侧边栏布局。
  - **顶部导航栏**: 放置 Logo、用户头像、消息通知中心、系统状态指示器（例如：API 连接状态、后台任务数量）等全局性元素。
  - **左侧侧边栏**: 作为主功能导航，清晰地列出所有核心模块（Dashboard、V7 回测、V7 优化、V7 运行、API 密钥设置、系统服务等）。当前激活的菜单项应有高亮显示。
- **面包屑导航**: 在每个页面的主内容区域顶部，提供面包屑导航，清晰地展示用户当前所处的页面层级，方便快速返回上一级。
- **内容区域**: 主内容区域将采用更灵活的布局方式，使用 Element Plus 的 Grid 或 Layout 组件，确保在不同屏幕尺寸下都有良好的响应式表现。

### 3.2. 核心页面重构方案

基于我们对现有 `navi/` 目录的分析，以下是部分核心页面的重构思路：

- **登录页 (`system_login.py`)**:
  - **UI**: 重新设计一个居中的、简洁美观的登录框。
  - **UX**: 增加“记住我”功能。密码输入错误时，输入框应有明确的视觉反馈（如抖动动画和红色边框）。
- **配置页 (`system_login.py` 的 `do_init` 部分)**:
  - **UI**: 将原来线性排列的配置项，使用 Element Plus 的 `Tabs` (标签页) 和 `Collapse` (折叠面板) 进行分组归类，例如分为 "Passivbot V7 配置"、"Passivbot V6 配置"、"通用配置" 等，使页面更整洁。
  - **UX**: 对于路径输入，增加“浏览”按钮，允许用户通过图形界面选择文件夹/文件（这需要与 Electron 或 Tauri 等技术结合，如果 pbgui 需要作为桌面应用打包的话；如果是纯 Web 应用，则提示用户手动输入并提供格式示例）。每个配置项旁边应有关联的帮助图标，点击后显示详细说明。
- **回测列表页 (`v7_backtest.py` 的 `bt_v7_list`)**:
  - **UI**: 使用 Element Plus 的 `Table` 组件重新实现。表格将支持**排序**（按名称、日期、结果数）、**筛选**和**自定义列显示**。
  - **UX**:
    - 将“编辑”、“查看结果”、“删除”等操作收到每行的“操作”列中，通过下拉菜单或图标按钮展示。
    - 增加**批量操作**功能，例如通过复选框选择多个回测配置进行批量删除。
    - 列表上方增加一个醒目的“新建回测”按钮。
- **回测结果页 (`v7_backtest.py` 的 `bt_v7_results`)**:
  - **UI**: 这将是一个高度信息化的 Dashboard。
    - **顶部**: 展示核心指标卡片（ADG, Sharpe Ratio, Worst Drawdown, Final Balance）。
    - **主区域**: 使用 `Tabs` 组件区分不同的视图：“资产曲线图”、“Fills 图”、“详细统计数据”、“配置信息”。
    - **图表**: 使用 ECharts 重新绘制所有图表，增加**缩放**、**数据视图**、**下载为图片**等交互功能。图表加载时应有平滑的加载动画。
  - **UX**:
    - **结果对比**: 优化现有的结果对比功能。用户可以选择多个结果，新页面将并排或通过图层叠加的方式展示它们的资产曲线和核心指标，方便比较优劣。
- **回测队列页 (`v7_backtest.py` 的 `bt_v7_queue`)**:
  - **UI**: 同样使用 `Table` 组件。增加一个实时的**进度条**来显示每个任务的执行状态。
  - **UX**:
    - **实时更新**: 页面将通过 WebSocket 或定时轮询 API 的方式，自动刷新队列状态，无需用户手动点击“刷新”。
    - **日志查看**: 点击“查看日志”按钮，将弹出一个模态框（Modal），实时滚动显示最新的日志输出，而不是在页面下方展开。

### 3.3. 交互与动画

- **页面过渡**: 路由切换时，增加平滑的淡入淡出或滑动过渡动画，提升应用的流畅感。
- **加载状态**: 所有 API 请求都应有明确的加载状态指示。例如，在表格数据加载时显示骨架屏 (Skeleton Screen)，点击按钮后按钮变为加载中状态。
- **微交互**:
  - 鼠标悬停在可点击元素上时，应有视觉反馈（如轻微放大、颜色变化）。
  - 操作成功或失败时，使用 Element Plus 的 `Notification` 或 `Message` 组件，在屏幕角落弹出提示，而不是使用阻塞式的 `alert`。
  - 对于删除等危险操作，使用 `MessageBox` 进行二次确认。

## 4. API 设计方案

后端 API 将遵循 RESTful 设计原则，以**资源 (Resource)** 为中心进行构建。API 应是无状态的，每个请求都应包含所有必要的信息。

### 4.1. API 根路径与版本管理

- **根路径**: 所有 API 都将以 `/api` 作为根路径，以便于未来通过 Nginx 等网关进行统一代理和管理。
- **版本管理**: API 将采用 URL 路径进行版本管理，例如 `/api/v1`。这有助于在未来进行非兼容性升级时，保持对旧版前端的兼容。

### 4.2. 认证与授权

- **认证方案**: 采用基于 Token 的认证机制。
  1.  用户通过 `POST /api/v1/auth/login` 接口，使用密码进行登录。
  2.  认证成功后，后端生成一个 JWT (JSON Web Token)，并将其返回给前端。
  3.  前端将此 Token 存储起来（例如，在 `localStorage` 或 `cookie` 中）。
  4.  在后续的所有请求中，前端都需要在 HTTP Header 的 `Authorization` 字段中携带此 Token，格式为 `Bearer <token>`。
- **授权**: FastAPI 将创建一个依赖项 (Dependency)，用于验证每个需要授权的接口的 Token 是否有效。无效或过期的 Token 将返回 `401 Unauthorized` 错误。

### 4.3. 资源与 Endpoints 示例

我们将现有业务逻辑抽象为 RESTful 资源。以**回测 (Backtest)** 功能为例：

| HTTP 方法 | URL 路径 | 描述 | 对应原逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/backtests` | 获取所有回测配置的列表 | `BacktestsV7.find_backtests()` |
| `POST` | `/api/v1/backtests` | 创建一个新的回测配置 | `BacktestV7Item.save()` (新建) |
| `GET` | `/api/v1/backtests/{backtest_name}` | 获取指定名称的回测配置详情 | `BacktestV7Item` 初始化加载 |
| `PUT` | `/api/v1/backtests/{backtest_name}` | 更新指定回测的配置 | `BacktestV7Item.save()` (更新) |
| `DELETE` | `/api/v1/backtests/{backtest_name}` | 删除一个回测配置 | `BacktestV7Item.remove()` |
| `GET` | `/api/v1/backtests/{backtest_name}/results` | 获取指定回测的所有结果列表 | `BacktestV7Results.load()` |
| `GET` | `/api/v1/backtests/{backtest_name}/results/{result_id}` | 获取某次具体的回测结果详情 | `BacktestV7Result.load_result()` |
| `DELETE`| `/api/v1/backtests/{backtest_name}/results` | 删除指定回测的所有结果 | `BacktestV7Results.remove_all_results()` |

**后台任务（队列）管理** 将设计为独立的资源：

| HTTP 方法 | URL 路径 | 描述 | 对应原逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/queue/backtests` | 获取回测队列中的所有任务 | `BacktestV7Queue.load()` |
| `POST` | `/api/v1/queue/backtests` | 将一个已保存的回测配置加入队列 | `BacktestV7Item.save_queue()` |
| `GET` | `/api/v1/queue/backtests/status` | 获取队列的总体状态（运行中任务数等）| `BacktestV7Queue.running()` |
| `DELETE`| `/api/v1/queue/backtests` | 清空已完成/所有任务 | `BacktestV7Queue.remove_finish()` |
| `GET` | `/api/v1/queue/backtests/{task_id}/log` | 获取指定队列任务的日志 | `BacktestV7QueueItem.load_log()` |
| `POST` | `/api/v1/queue/backtests/run` | **(管理操作)** 启动队列处理器 | `BacktestV7Queue.run()` |
| `POST` | `/api/v1/queue/backtests/stop` | **(管理操作)** 停止队列处理器 | `BacktestV7Queue.stop()` |

### 4.4. 数据传输对象 (DTO)

- 所有 API 的请求体 (Request Body) 和响应体 (Response Body) 都将使用 Pydantic 模型进行严格定义。这不仅能提供自动的数据验证，还能为 FastAPI 的自动文档生成提供元数据。
- **示例 (`schemas/backtest.py`)**:
  ```python
  from pydantic import BaseModel
  from typing import List, Optional
  import datetime

  class BacktestConfigBase(BaseModel):
      name: str
      exchanges: List[str]
      start_date: str
      end_date: str
      # ... 其他配置项

  class BacktestConfigCreate(BacktestConfigBase):
      pass

  class BacktestConfig(BacktestConfigBase):
      # 可能包含一些从服务器生成或读取的额外字段
      last_modified: datetime.datetime

      class Config:
          from_attributes = True # 替代 orm_mode
  ```

### 4.5. 错误处理

- API 将使用标准的 HTTP 状态码来表示请求的结果。
  - `200 OK`: 请求成功。
  - `201 Created`: 资源创建成功。
  - `204 No Content`: 资源删除成功。
  - `400 Bad Request`: 请求体格式错误或业务逻辑验证失败。
  - `401 Unauthorized`: 未认证。
  - `403 Forbidden`: 已认证但无权限。
  - `404 Not Found`: 请求的资源不存在。
  - `500 Internal Server Error`: 服务器内部发生未知错误。
- 错误的响应体将包含统一的格式：
  ```json
  {
    "detail": "具体的错误信息描述"
  }
  ```

## 5. API 接口文档规范

- **自动化生成**: 我们将完全利用 FastAPI 的能力，**不手动编写**静态的 API 文档。所有文档都将基于代码（Pydantic 模型、路径操作函数的参数和类型提示）自动生成。
- **交互式文档**: FastAPI 默认提供两个交互式文档页面：
  - `/docs`: 基于 Swagger UI 的文档。
  - `/redoc`: 基于 ReDoc 的文档。
- **文档增强**: 为了使自动生成的文档更清晰、更具可读性，我们将遵循以下规范：
  1.  **善用 `description` 和 `summary`**: 在路径操作函数（如 `@app.get(...)`）中，使用 `summary` 提供简短的接口说明，使用 `description` 提供更详细的描述、使用场景和注意事项。
  2.  **模型字段描述**: 在 Pydantic 模型中，为每个字段使用 `Field(..., description="...")` 来详细说明该字段的含义和约束。
  3.  **请求/响应示例**: 为复杂的 Endpoints 提供清晰的请求和响应示例。
  4.  **标签 (Tags)**: 使用 `tags` 参数将 Endpoints 按资源（如 "Backtests", "Queue", "Users"）进行分组，使文档结构更清晰。
- **目标**: 任何前端或后端开发者，在不阅读任何业务代码的情况下，仅通过访问 `/docs` 页面，就能完全理解 API 的所有功能、请求方式和数据结构。