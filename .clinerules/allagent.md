# Cline Agent Full-Stack Vibe Coding Rules

> 本规则体系专为 Agent 自主驱动的全栈 Vibe Coding 工作流设计，强调：自主规划、全栈贯通、美学优先、渐进交付。

---

## 0. 核心哲学 (Core Philosophy)

### 0.1 Agent-First Mindset

- 你是一个**自主决策的 Agent**，不是被动的代码生成器。每次收到任务，先理解意图，再规划路径，最后执行。
- **Think before code**：任何编码动作前，先在思维链中完成：意图分析 → 方案对比 → 最优选择 → 执行计划。
- **Self-verify**：每完成一个逻辑单元，主动验证结果是否符合预期，不符合则自动修正。
- **Progressive delivery**：优先交付可运行的最小版本，再逐步增强，避免一次性生成大量未验证代码。

### 0.2 Vibe-Driven Development

- **美学是功能的一部分**：丑陋的界面等同于功能缺陷。每个 UI 元素都必须经过视觉审视。
- **像素级敏感**：间距、对齐、颜色、字体、阴影——每一个视觉细节都值得被认真对待。
- **动效即体验**：合理的过渡动画和微交互是"能用"和"好用"的分界线。
- **一致性胜过创意**：在同一项目中，保持设计语言的一致性比局部创新更重要。

### 0.3 Full-Stack Coherence

- 前后端不是两个独立系统，而是**同一个产品的两个面**。API 设计应从 UI 需求出发，UI 实现应尊重数据模型。
- 类型安全贯穿全栈：从数据库 Schema → API 类型 → 前端接口，保持类型链路完整。
- 错误处理贯穿全栈：后端错误 → API 错误响应 → 前端错误展示，形成完整链路。

---

## 1. 项目架构规则 (Project Architecture)

### 1.1 目录结构规范

```
project-root/
├── .clinerules              # 本规则文件
├── .env.local               # 本地环境变量（不提交）
├── .env.example             # 环境变量模板
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── prisma/
│   └── schema.prisma        # 数据库 Schema（单一真相源）
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   └── (auth)/          # 路由组
│   ├── components/          # 组件
│   │   ├── ui/              # 基础 UI 组件（shadcn/ui）
│   │   ├── features/        # 业务功能组件
│   │   └── layouts/         # 布局组件
│   ├── lib/                 # 工具库
│   │   ├── db.ts            # 数据库客户端
│   │   ├── auth.ts          # 认证配置
│   │   ├── utils.ts         # 通用工具函数
│   │   └── validations/     # Zod Schema 验证
│   ├── hooks/               # 自定义 Hooks
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts         # 全局类型导出
│   ├── server/              # 服务端代码
│   │   ├── api/             # API Route Handlers
│   │   ├── services/        # 业务逻辑层
│   │   └── repositories/    # 数据访问层
│   └── styles/              # 全局样式
│       └── globals.css
└── public/                  # 静态资源
    ├── images/
    └── fonts/
```

### 1.2 架构原则

- **单一真相源**：每个概念只在一个地方定义（类型、常量、配置），其他地方引用。
- **关注点分离**：组件只管渲染，Hooks 管状态和逻辑，Services 管业务，Repositories 管数据。
- **依赖方向**：`页面 → 组件 → Hooks → Services → Repositories → DB`，严禁反向依赖。
- **Colocation**：与某功能强相关的文件放在同一目录，而非按文件类型分散。

---

## 2. 技术栈规则 (Tech Stack)

### 2.1 核心技术栈（默认选择）

| 层级   | 技术                  | 版本要求 | 选型理由                   |
| ------ | --------------------- | -------- | -------------------------- |
| 框架   | Next.js (App Router)  | ≥15      | SSR/SSG/ISR 一体，全栈能力 |
| 语言   | TypeScript            | ≥5.5     | 类型安全，全栈贯通         |
| 样式   | Tailwind CSS          | ≥4       | 原子化，设计系统友好       |
| UI库   | shadcn/ui             | latest   | 可定制，非依赖包           |
| 数据库 | PostgreSQL            | ≥16      | 可靠，JSON支持好           |
| ORM    | Prisma                | ≥6       | 类型安全，迁移友好         |
| 认证   | NextAuth.js / Clerk   | latest   | Next.js 原生集成           |
| 验证   | Zod                   | ≥3       | 类型推导，前后端共享       |
| 状态   | Zustand / React Query | latest   | 轻量，服务端优先           |
| 动画   | Framer Motion         | ≥11      | 声明式，手势支持           |

### 2.2 技术选型原则

- **默认选择优先**：除非有明确理由，否则使用上表中的默认技术。
- **如需替换**：必须在代码注释中说明替换原因，并确保替代方案满足类型安全和全栈贯通的要求。
- **版本锁定**：package.json 中核心依赖必须锁定主版本号（如 `"next": "^15"`）。
- **零冗余**：同一功能只用一个库（如日期只用 date-fns，不要同时装 moment）。

---

## 3. Agent 工作流规则 (Agent Workflow)

### 3.1 任务接收与规划

```
收到任务
  ↓
[1] 意图理解：用户真正想要什么？显性需求 + 隐性期望
  ↓
[2] 影响分析：涉及哪些文件？哪些模块？有哪些依赖？
  ↓
[3] 方案规划：列出 2-3 个可行方案，选择最优解
  ↓
[4] 任务拆解：将大任务拆为可独立验证的子任务
  ↓
[5] 执行顺序：按依赖关系排列，先基础后业务
  ↓
[6] 逐步执行：每完成一个子任务，验证后再进入下一个
```

### 3.2 编码执行规范

- **先读后写**：修改任何文件前，必须先读取当前内容，理解上下文。
- **最小变更**：只修改必要的部分，不做无关的重构或"顺便"改动。
- **增量验证**：每完成一个逻辑单元（函数、组件、API），立即检查：
  - TypeScript 类型是否正确？
  - 导入路径是否正确？
  - 是否有未处理的边界情况？
- **上下文窗口管理**：当项目文件较多时，优先读取与当前任务直接相关的文件，避免一次性读取过多无关文件。

### 3.3 自主决策边界

- **可自主决定**：组件内部实现细节、CSS 类名、变量命名、工具函数选择。
- **需确认后决定**：新增依赖包、修改数据库 Schema、改变 API 接口契约、修改认证逻辑。
- **严禁自主决定**：删除现有功能、修改环境变量格式、改变部署配置。

### 3.4 错误恢复策略

- 编译错误：先尝试自动修复，修复失败则回退到上一个可编译状态。
- 运行时错误：分析错误堆栈，定位根因，修复后验证。
- 逻辑错误：对比预期行为和实际行为，找到偏差点，修正逻辑。
- **绝不掩盖错误**：禁止用 `@ts-ignore`、`any`、`try-catch 吞掉错误` 等方式绕过问题。

---

## 4. Vibe 设计规则 (Vibe Design)

### 4.1 视觉设计原则

- **留白是设计**：元素之间必须有合理的间距（Tailwind: `gap-4`/`gap-6`/`gap-8`），紧凑 ≠ 信息密度。
- **层次即引导**：通过字号、字重、颜色对比建立视觉层次，引导用户注意力。
- **色彩有节制**：主色 + 辅助色 + 中性色，不超过 3 种语义色。使用 CSS 变量管理色彩系统。
- **圆角一致性**：全项目统一圆角规范——小元素 `rounded-md`，卡片 `rounded-xl`，弹窗 `rounded-2xl`。
- **阴影克制**：阴影用于表达层级，不是装饰。`shadow-sm` → `shadow-md` → `shadow-lg` 对应三个层级。

### 4.2 排版规范

- **字体栈**：中文优先使用系统字体栈，英文使用 Inter / Geist。
- **字号阶梯**：`text-xs`(12) → `text-sm`(14) → `text-base`(16) → `text-lg`(18) → `text-xl`(20) → `text-2xl`(24) → `text-3xl`(30) → `text-4xl`(36)。
- **行高**：正文 `leading-relaxed`(1.625)，标题 `leading-tight`(1.25)。
- **字重**：正文 `font-normal`(400)，强调 `font-medium`(500)，标题 `font-semibold`(600)，极少用 `font-bold`(700)。

### 4.3 动效规范

- **过渡时间**：微交互 `150ms`，面板展开 `200ms`，页面切换 `300ms`，复杂动画 `500ms`。
- **缓动函数**：默认 `ease-out`（进入），`ease-in`（退出），弹性效果 `spring`。
- **动效触发**：
  - ✅ 按钮悬停：`hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150`
  - ✅ 卡片悬停：`hover:shadow-md transition-shadow duration-200`
  - ✅ 列表项进入：`staggerChildren: 0.05` 依次出现
  - ✅ 页面切换：`fadeIn + slideUp` 组合
  - ✅ 加载状态：骨架屏（Skeleton）优于 Spinner
  - ❌ 禁止：无意义的持续动画、闪烁效果、自动播放的视频
- **减少动效**：尊重 `prefers-reduced-motion`，为无障碍用户提供静态替代。

### 4.4 响应式设计

- **移动优先**：从最小屏幕开始设计，逐步增强。
- **断点规范**：`sm:640px` → `md:768px` → `lg:1024px` → `xl:1280px` → `2xl:1536px`。
- **触控友好**：移动端可点击区域最小 `44×44px`，按钮最小高度 `h-10`。
- **内容优先**：小屏幕隐藏装饰性元素，保留核心内容和功能。

### 4.5 暗色模式

- 所有项目必须支持暗色模式，使用 Tailwind `dark:` 变体。
- 色彩系统基于 CSS 变量（HSL 格式），通过 `--background`、`--foreground` 等语义变量控制。
- 暗色模式不是简单反色：降低对比度、增加柔和感、避免纯黑背景（使用 `hsl(0 0% 3.9%)` 而非 `#000`）。

---

## 5. 前端代码规则 (Frontend Rules)

### 5.1 组件设计

- **组件粒度**：一个组件只做一件事。超过 150 行的组件必须拆分。
- **组件分类**：
  - `ui/`：无业务逻辑的纯 UI 组件（Button、Input、Card 等）
  - `features/`：包含业务逻辑的功能组件（UserCard、OrderList 等）
  - `layouts/`：布局组件（Header、Sidebar、Footer 等）
- **Props 设计**：
  - 使用 TypeScript interface 定义 Props，不使用 type。
  - 可选 Props 必须有默认值。
  - 回调 Props 以 `on` 开头（`onClick`、`onChange`、`onSubmit`）。
  - 复杂 Props 使用组合模式而非单一巨型 Props 对象。
- **组件导出**：每个组件文件只导出一个主组件，使用命名导出，不使用默认导出。

### 5.2 状态管理

- **服务端优先**：能用 Server Component 就不用 Client Component。
- **状态分层**：
  - URL 状态 → `useSearchParams` / `nuqs`
  - 服务端状态 → `React Query` / `SWR`
  - 客户端全局状态 → `Zustand`
  - 组件局部状态 → `useState` / `useReducer`
- **状态提升**：状态应放在尽可能靠近使用它的组件层级，避免过度提升。

### 5.3 数据获取

- **Server Component** 中直接使用 `async/await` 获取数据。
- **Client Component** 使用 React Query，配置 `staleTime` 和 `cacheTime`。
- **乐观更新**：对用户感知敏感的操作（点赞、收藏）使用乐观更新。
- **加载状态**：每个数据获取都必须有 loading 状态处理，使用 Suspense 或 Skeleton。

### 5.4 表单处理

- 使用 `react-hook-form` + `zod` 组合。
- Schema 定义放在 `lib/validations/` 目录，前后端共享。
- 表单验证错误信息必须友好、具体、可操作。
- 提交按钮在提交过程中显示 loading 状态并禁用。

### 5.5 性能优化

- **图片**：使用 `next/image`，配置 `sizes` 属性，使用 WebP 格式。
- **代码分割**：动态导入重型组件（`dynamic(() => import(...))`）。
- **渲染优化**：使用 `React.memo`、`useMemo`、`useCallback` 时必须有明确的性能问题证据，不过度优化。
- **Bundle 分析**：定期检查 bundle 大小，单个页面 JS 不超过 100KB（gzip 后）。

---

## 6. 后端代码规则 (Backend Rules)

### 6.1 API 设计

- **RESTful 风格**：资源名用复数，动作用 HTTP Method 表达。
- **Route Handler 结构**：
  ```typescript
  // src/app/api/resource/route.ts
  export async function GET(request: Request) { ... }
  export async function POST(request: Request) { ... }
  ```
- **响应格式统一**：
  ```typescript
  // 成功
  { success: true, data: T }
  // 失败
  { success: false, error: { code: string, message: string } }
  ```
- **分页规范**：使用 cursor-based pagination，参数 `cursor` + `limit`。
- **HTTP 状态码**：正确使用语义化状态码（200/201/204/400/401/403/404/409/422/500）。

### 6.2 服务层架构

```
Route Handler (HTTP 层)
    ↓ 参数验证 (Zod)
Service (业务逻辑层)
    ↓ 业务规则
Repository (数据访问层)
    ↓ 数据操作
Prisma Client (ORM 层)
```

- **Route Handler**：只负责接收请求、调用 Service、返回响应，不含业务逻辑。
- **Service**：包含所有业务逻辑，可被多个 Handler 复用。
- **Repository**：封装数据库操作，返回领域对象而非 Prisma 原始结果。

### 6.3 数据库规则

- **Schema 即文档**：Prisma Schema 中每个字段必须有 `@map` 和 `@@map` 映射到蛇形命名。
- **软删除**：使用 `deletedAt` 字段实现软删除，不物理删除数据。
- **时间戳**：所有表必须有 `createdAt` 和 `updatedAt`，使用 `@updatedAt` 自动更新。
- **索引设计**：根据查询模式创建索引，外键字段必须索引。
- **迁移规范**：每次 Schema 变更必须生成迁移文件，禁止手动修改数据库。

### 6.4 认证与授权

- **认证**：使用 NextAuth.js 或 Clerk，Session 在 Server Component 中获取。
- **授权**：基于角色的访问控制（RBAC），中间件层统一拦截。
- **API 保护**：每个 Route Handler 必须显式检查认证状态，不依赖隐式保护。
- **敏感操作**：删除、修改密码等操作必须二次确认。

### 6.5 错误处理

- **分层处理**：
  - Repository 层：捕获数据库错误，转换为领域错误。
  - Service 层：捕获领域错误，添加业务上下文。
  - Handler 层：捕获所有错误，转换为 HTTP 响应。
- **错误日志**：使用结构化日志，包含 `requestId`、`userId`、`error.stack`。
- **不暴露内部信息**：生产环境错误响应不包含堆栈信息、SQL 语句、文件路径。

---

## 7. 代码质量规则 (Code Quality)

### 7.1 TypeScript 严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- **禁止 `any`**：除非有 `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 原因` 注释。
- **禁止非空断言**：使用可选链 `?.` 和空值合并 `??` 替代 `!`。
- **类型推导**：能推导的不手写类型，复杂类型必须加注释。

### 7.2 命名规范

| 类型       | 风格                   | 示例                        |
| ---------- | ---------------------- | --------------------------- |
| 文件名     | kebab-case             | `user-profile.tsx`          |
| 组件名     | PascalCase             | `UserProfile`               |
| 函数/变量  | camelCase              | `getUserById`               |
| 常量       | SCREAMING_SNAKE        | `MAX_RETRY_COUNT`           |
| 类型/接口  | PascalCase             | `UserProfile` / `UserProps` |
| CSS 类     | Tailwind 原子类        | `flex items-center gap-4`   |
| 环境变量   | SCREAMING_SNAKE + 前缀 | `NEXT_PUBLIC_API_URL`       |
| 数据库字段 | camelCase (Prisma)     | `createdAt`                 |
| 数据库列   | snake_case (@map)      | `created_at`                |

### 7.3 注释规范

- **函数注释**：复杂函数使用 JSDoc，包含 `@param`、`@returns`、`@throws`。
- **业务逻辑注释**：用 `// WHY:` 解释为什么这样做，而非做了什么。
- **TODO 注释**：`// TODO(username): 描述 -- 2024-01-01`，包含负责人和日期。
- **禁止废话注释**：不注释显而易见的代码（如 `// 设置 name 为空`）。

### 7.4 Import 顺序

```typescript
// 1. React / Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. 第三方库
import { z } from "zod";
import { motion } from "framer-motion";

// 3. 内部模块 - @/ 别名
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

// 4. 类型导入
import type { UserProfile } from "@/types";

// 5. 相对路径导入
import { LocalHelper } from "./helper";
```

---

## 8. 安全规则 (Security)

### 8.1 输入验证

- **所有外部输入必须验证**：API 请求体、URL 参数、查询参数、Cookie。
- **验证在前**：在业务逻辑之前完成验证，验证失败立即返回 400/422。
- **Zod Schema**：前后端共享验证 Schema，放在 `lib/validations/` 目录。

### 8.2 数据保护

- **密码**：使用 `bcrypt` 哈希，salt rounds ≥ 12。
- **敏感数据**：API 响应中不返回密码、token、内部 ID 等敏感字段。
- **环境变量**：所有密钥和敏感配置通过环境变量注入，不硬编码。
- **SQL 注入**：使用 Prisma 参数化查询，禁止字符串拼接 SQL。

### 8.3 前端安全

- **XSS 防护**：React 默认转义，`dangerouslySetInnerHTML` 必须配合 DOMPurify。
- **CSRF 防护**：使用 SameSite Cookie + CSRF Token。
- **内容安全策略**：配置 CSP Header，限制脚本和样式来源。

---

## 9. 测试规则 (Testing)

### 9.1 测试策略

- **测试金字塔**：70% 单元测试 + 20% 集成测试 + 10% E2E 测试。
- **关键路径优先**：认证流程、支付流程、数据写入必须有测试覆盖。
- **快照测试慎用**：只在 UI 组件库中使用，业务组件不用快照测试。

### 9.2 测试工具

| 类型     | 工具                     | 用途               |
| -------- | ------------------------ | ------------------ |
| 单元测试 | Vitest                   | 函数、Hooks、Utils |
| 组件测试 | Testing Library + Vitest | 组件渲染和交互     |
| API 测试 | Vitest + MSW             | API Route Handler  |
| E2E 测试 | Playwright               | 关键用户流程       |

### 9.3 测试编写规范

- **AAA 模式**：Arrange → Act → Assert，每个测试三段式结构。
- **描述清晰**：`it('should return 401 when user is not authenticated')` 而非 `it('works')`。
- **独立运行**：每个测试不依赖其他测试的执行顺序或副作用。
- **Mock 最小化**：只 Mock 外部依赖（API、数据库），不 Mock 内部模块。

---

## 10. Git 与部署规则 (Git & Deployment)

### 10.1 Git 规范

- **Commit 格式**：`type(scope): description`
  - `feat(auth): add OAuth login support`
  - `fix(api): handle null user in profile endpoint`
  - `refactor(ui): extract shared button component`
  - `docs: update API documentation`
- **分支策略**：`main` → `develop` → `feature/xxx`，PR 合并前必须通过 CI。
- **不提交**：`.env.local`、`node_modules`、`.next/`、`*.log`。

### 10.2 环境管理

| 环境       | 用途     | 数据库             | 域名            |
| ---------- | -------- | ------------------ | --------------- |
| local      | 本地开发 | SQLite / Docker PG | localhost:3000  |
| preview    | PR 预览  | 分支数据库         | preview.xxx.com |
| staging    | 预发布   | 生产结构数据       | staging.xxx.com |
| production | 生产     | 生产数据库         | xxx.com         |

### 10.3 部署检查清单

- [ ] TypeScript 编译无错误
- [ ] ESLint 无错误（warning 可接受）
- [ ] 所有测试通过
- [ ] 环境变量已配置
- [ ] 数据库迁移已执行
- [ ] 关键路径手动验证

---

## 11. Agent 特殊指令 (Agent-Specific Directives)

### 11.1 任务执行模式

当收到一个复杂任务时，按以下模式执行：

```
MODE: PLAN → EXECUTE → VERIFY → ITERATE

PLAN 阶段：
  - 输出任务理解摘要
  - 列出涉及文件清单
  - 制定执行步骤（编号列表）
  - 标注风险点和需要确认的决策

EXECUTE 阶段：
  - 按计划逐步执行
  - 每步完成后输出简短状态
  - 遇到计划外问题，暂停并说明

VERIFY 阶段：
  - 检查 TypeScript 编译
  - 检查导入路径正确性
  - 检查功能完整性
  - 检查视觉一致性（如涉及 UI）

ITERATE 阶段：
  - 根据验证结果修正
  - 修正后重新验证
  - 最多迭代 3 次，仍未解决则请求用户协助
```

### 11.2 文件操作规则

- **创建文件前**：检查目标目录是否存在，不存在则先创建。
- **修改文件前**：必须先读取当前内容，理解上下文后再修改。
- **删除文件**：需确认无其他文件引用后再删除，删除后检查导入错误。
- **重命名文件**：同步更新所有引用该文件的 import 语句。

### 11.3 上下文管理

- **优先级读取**：只读取与当前任务直接相关的文件，避免浪费上下文窗口。
- **摘要替代**：对于超长文件，优先读取关键部分（函数签名、类型定义、导出列表）。
- **增量理解**：先读入口文件理解结构，再按需深入具体实现。

### 11.4 沟通规范

- **进度透明**：每完成一个子任务，简短报告进度。
- **问题上报**：遇到无法自主决策的问题，明确列出选项和推荐方案，请求用户选择。
- **结果总结**：任务完成后，输出变更摘要：新增/修改/删除了哪些文件，实现了什么功能。
- **不废话**：不说"当然可以"、"没问题"等无意义的话，直接开始工作。

### 11.5 Vibe Check 清单

每次创建或修改 UI 时，必须通过以下检查：

- [ ] 间距是否一致？（使用 4px 倍数）
- [ ] 颜色是否使用设计系统变量？（非硬编码色值）
- [ ] 字号是否在规范阶梯内？
- [ ] 圆角是否与项目风格一致？
- [ ] 悬停/聚焦状态是否有视觉反馈？
- [ ] 加载状态是否有骨架屏？
- [ ] 空状态是否有友好提示？
- [ ] 错误状态是否有明确指引？
- [ ] 暗色模式下是否正常？
- [ ] 移动端布局是否合理？
- [ ] 动效是否流畅自然？
- [ ] 可访问性（a11y）是否达标？

---

## 12. 项目初始化模板 (Project Init Template)

当用户要求创建新项目时，按以下步骤初始化：

### 12.1 初始化命令

```bash
npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx shadcn@latest init
npx prisma init
```

### 12.2 必装依赖

```bash
# 核心
bun add zod react-hook-form @tanstack/react-query framer-motion

# 开发
bun add -d vitest @testing-library/react @testing-library/jest-dom msw prettier
```

### 12.3 必建文件

- [ ] `.clinerules` — 本规则文件
- [ ] `.env.example` — 环境变量模板
- [ ] `src/lib/utils.ts` — 工具函数（cn 等）
- [ ] `src/lib/db.ts` — 数据库客户端
- [ ] `src/types/index.ts` — 全局类型
- [ ] `src/components/ui/` — 基础 UI 组件

---

## 13. 常见场景决策树 (Decision Trees)

### 13.1 "需要新页面"

```
新页面需求
  ├─ 是否需要认证？→ 是 → 添加 middleware 检查
  ├─ 数据来源？
  │   ├─ 静态数据 → Server Component + 静态生成
  │   ├─ 动态数据（低频更新）→ Server Component + ISR
  │   └─ 动态数据（实时）→ Client Component + React Query
  ├─ 是否有表单？→ 是 → react-hook-form + zod
  └─ 是否有列表？→ 是 → 虚拟滚动（>100条）或普通分页
```

### 13.2 "需要新 API"

```
新 API 需求
  ├─ HTTP Method？→ GET/POST/PUT/DELETE
  ├─ 是否需要认证？→ 是 → 添加 session 检查
  ├─ 请求体验证？→ Zod Schema
  ├─ 业务逻辑复杂度？
  │   ├─ 简单 CRUD → Handler 直接调用 Prisma
  │   └─ 复杂逻辑 → 抽取 Service 层
  └─ 返回格式？→ 统一 { success, data/error }
```

### 13.3 "需要新组件"

```
新组件需求
  ├─ 是否有业务逻辑？→ 否 → ui/ 目录
  │                          → 是 → features/ 目录
  ├─ 是否需要客户端交互？→ 否 → Server Component
  │                            → 是 → Client Component ('use client')
  ├─ 是否需要状态？→ 否 → 无状态组件
  │                      → 是 → 本地 useState 或全局 Zustand
  └─ 是否需要动画？→ 是 → Framer Motion
```

---

## 14. 反模式黑名单 (Anti-Patterns)

以下模式在本项目中**严格禁止**：

| 反模式                              | 正确做法                        |
| ----------------------------------- | ------------------------------- |
| `// @ts-ignore`                     | 修复类型错误                    |
| `as any`                            | 使用正确的类型定义              |
| `eslint-disable`                    | 修复 lint 问题                  |
| `dangerouslySetInnerHTML`（未净化） | 使用 DOMPurify 净化             |
| 内联样式 `style={{}}`               | 使用 Tailwind 类                |
| 硬编码颜色 `#fff`                   | 使用 CSS 变量 `bg-background`   |
| 硬编码字符串（业务文本）            | 使用常量或 i18n                 |
| `console.log` 提交到代码            | 使用结构化日志                  |
| 组件内直接调用 Prisma               | 通过 Service/Repository 层      |
| Props 透传 `{...props}`             | 显式列出需要的 Props            |
| `useEffect` 获取数据                | Server Component 或 React Query |
| `useState` 存储派生数据             | 使用 `useMemo` 计算             |
| 嵌套三元表达式                      | 提取为函数或使用策略模式        |

---

## 15. 持续进化 (Evolution)

本规则是**活文档**，应随项目演进持续更新：

- 每次遇到规则未覆盖的情况，补充相应规则。
- 每次发现规则不合理，修正而非绕过。
- 保持规则的**可执行性**——每条规则都应该是可检查、可验证的。
- 规则数量控制在合理范围——过多规则等于没有规则。

---

_最后更新：2026-05-19 | 版本：1.0.0_
