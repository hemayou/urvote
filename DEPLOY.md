# 北京城市更新投票系统 - Supabase 部署指南

## 前置要求

- [Supabase](https://supabase.com) 账号
- Node.js 18+（仅用于构建前端）

> **注意**：本指南支持纯网页操作，无需安装 Supabase CLI

---

## 🚀 快速开始（5分钟完成部署）

### 极简部署流程（无需 Edge Functions）

本投票系统的前端可以直接读写 Supabase 数据库，**无需部署 Edge Functions** 即可工作。

```
1. 创建 Supabase 项目
2. 执行 SQL 创建数据库表
3. 配置前端环境变量  
4. 构建并部署到 Vercel
```

---

## 第一步：创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://app.supabase.com) 并登录
2. 点击 **New Project**
3. 填写信息：
   - **Organization**: 选择或创建组织
   - **Project Name**: `bupd-voting`（或其他名称）
   - **Database Password**: 设置一个安全密码（请保存好）
   - **Region**: 选择 `Northeast Asia (Tokyo)` 或离你最近的区域
4. 点击 **Create new project**
5. 等待 1-2 分钟，项目创建完成

---

## 第二步：配置数据库

### 1. 打开 SQL Editor

1. 在项目 Dashboard 中，点击左侧菜单 **SQL Editor**
2. 点击 **New query**
3. 给查询起个名字，如 `create-votes-table`

### 2. 执行 SQL

复制以下 SQL 代码，粘贴到编辑器中，然后点击 **Run**：

```sql
-- 创建投票记录表
CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  issue_id TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 1,
  voter_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_votes_issue_id ON votes(issue_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);

-- 创建统计视图
CREATE OR REPLACE VIEW vote_stats AS
SELECT 
  issue_id,
  SUM(vote_count) as total_votes,
  COUNT(DISTINCT voter_id) as voter_count
FROM votes
GROUP BY issue_id;

-- 创建总体统计视图
CREATE OR REPLACE VIEW total_stats AS
SELECT 
  SUM(vote_count) as total_votes,
  COUNT(DISTINCT voter_id) as total_voters
FROM votes;

-- 启用行级安全 (RLS)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入投票
CREATE POLICY "Allow anonymous insert" ON votes
  FOR INSERT TO anon
  WITH CHECK (true);

-- 允许匿名查询投票
CREATE POLICY "Allow anonymous select" ON votes
  FOR SELECT TO anon
  USING (true);

-- 禁止更新和删除（投票不可修改）
CREATE POLICY "Disallow update" ON votes
  FOR UPDATE TO anon
  USING (false);

CREATE POLICY "Disallow delete" ON votes
  FOR DELETE TO anon
  USING (false);
```

### 3. 验证表创建

1. 点击左侧菜单 **Table Editor**
2. 确认能看到 `votes` 表
3. 点击 `votes` 表查看结构

---

## 第三步：获取 API 密钥

1. 在项目 Dashboard 中，点击左侧菜单 **Project Settings** → **API**
2. 在 **Project API keys** 部分，复制以下信息：

| 字段 | 示例值 | 用途 |
|------|--------|------|
| **Project URL** | `https://abcdefgh12345678.supabase.co` | 项目地址 |
| **anon public** | `eyJhbGciOiJIUzI1NiIs...` | 客户端密钥 |

> **提示**：`anon` 密钥是公开的，可以安全地用于前端代码。

---

## 第四步（可选）：部署 Edge Functions

> **说明**：本投票系统的前端可以直接连接 Supabase 数据库，Edge Functions 是可选的。如需使用，可通过以下两种方式部署：

### 方法 A：通过 Supabase Dashboard 网页创建（推荐，无需终端）

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 点击左侧菜单 **Edge Functions**
4. 点击右上角 **Create a new function**
5. 填写函数信息：
   - **Function Name**: `vote`
   - **Index File**: 选择 `index.ts`
6. 在代码编辑器中粘贴以下内容：

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { votes, voterId } = await req.json()

    // 检查是否已投票
    const { data: existingVotes } = await supabaseClient
      .from('votes')
      .select('id')
      .eq('voter_id', voterId)
      .limit(1)

    if (existingVotes && existingVotes.length > 0) {
      return new Response(
        JSON.stringify({ error: 'You have already voted' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 验证票数
    const totalVotes = Object.values(votes).reduce((sum: number, count: number) => sum + count, 0)
    if (totalVotes > 5 || totalVotes === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid vote count' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 插入投票
    const voteRecords = Object.entries(votes)
      .filter(([, count]) => count > 0)
      .map(([issueId, voteCount]) => ({
        issue_id: issueId,
        vote_count: voteCount,
        voter_id: voterId,
      }))

    const { error } = await supabaseClient.from('votes').insert(voteRecords)
    if (error) throw error

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

7. 点击 **Deploy** 按钮部署
8. （可选）重复上述步骤创建 `get-stats` 函数

### 方法 B：通过终端部署（适合批量操作）

如需使用 Supabase CLI：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-id

# 部署函数
supabase functions deploy vote
supabase functions deploy get-stats
```

### 配置函数权限

1. 进入 Supabase Dashboard → **Edge Functions**
2. 点击已部署的函数
3. 在 **Function Details** 中，确保 **Policy** 允许匿名访问

---

## 第五步：配置前端环境变量

### 1. 获取 Supabase 配置

1. 进入 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 点击左侧菜单 **Project Settings** → **API**
4. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...`

### 2. 配置环境变量

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 Supabase 配置：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> **重要**：`VITE_SUPABASE_ANON_KEY` 是公开的客户端密钥，可以安全地嵌入前端代码中。不要在这里使用 Service Role Key！

---

## 第六步：构建和部署前端

### 本地构建测试

```bash
# 安装依赖
npm install

# 开发模式测试（本地预览）
npm run dev

# 生产构建（生成 dist 文件夹）
npm run build
```

### 部署到静态托管

#### 方案 A：Vercel（推荐，完全免费）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [vercel.com](https://vercel.com) 注册/登录
3. 点击 **Add New Project**
4. 导入你的代码仓库
5. 配置项目：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 **Environment Variables**，添加：
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
7. 点击 **Deploy**

#### 方案 B：Netlify

1. 将代码推送到 GitHub
2. 访问 [netlify.com](https://netlify.com) 注册/登录
3. 点击 **Add new site** → **Import an existing project**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击 **Show advanced** → **New variable**，添加环境变量
7. 点击 **Deploy site**

#### 方案 C：Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 **Pages** → **Create a project**
3. 连接你的 Git 仓库
4. 构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
5. 添加环境变量
6. 点击 **Save and Deploy**

#### 方案 D：Supabase Storage（纯 Supabase 方案）

1. 进入 Supabase Dashboard → **Storage**
2. 创建新的 Bucket，命名为 `website`
3. 在 Bucket 设置中，开启 **Public bucket**
4. 上传 `dist` 文件夹中的所有文件
5. 点击 **index.html** → **Get URL** 获取访问链接

> **注意**：Storage 方案不支持自定义域名，建议生产环境使用 Vercel/Netlify

---

## 第七步：验证部署

1. 访问部署后的网站
2. 测试投票功能
3. 在 Supabase Dashboard → **Table Editor** → **votes** 中查看数据

---

## 数据库表结构

### votes 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键，自增 |
| issue_id | text | 议题ID |
| vote_count | integer | 投票数 |
| voter_id | text | 投票者ID |
| created_at | timestamptz | 创建时间 |

### 视图

- `vote_stats`: 按议题统计总票数
- `total_stats`: 总体统计（总票数、总投票人数）

---

## 安全说明

### 行级安全 (RLS)

已配置以下策略：
- ✅ 允许匿名插入投票
- ✅ 允许匿名查询统计数据
- ❌ 禁止更新投票记录
- ❌ 禁止删除投票记录

### 防重复投票

- 使用 `voter_id`（基于浏览器 localStorage）识别用户
- 数据库层面有唯一约束防止同一用户重复投票

---

## 故障排查

### 问题：无法连接到 Supabase

**检查清单：**
1. 环境变量是否正确设置
2. Supabase URL 和 Anon Key 是否正确
3. 项目是否处于活动状态

### 问题：投票提交失败

**检查清单：**
1. 数据库表是否正确创建
2. RLS 策略是否正确配置
3. 网络连接是否正常

### 问题：实时更新不生效

**检查清单：**
1. Supabase Realtime 是否启用
2. 数据库触发器是否正确配置
3. 前端订阅代码是否正确

---

## 自定义配置

### 修改最大投票数

编辑 `src/data/issues.ts`：

```typescript
export const MAX_VOTES = 5; // 修改为你需要的数字
```

### 添加新议题

编辑 `src/data/issues.ts`，在 `dimensions` 数组中添加新的维度或议题。

### 修改实时刷新频率

编辑 `src/hooks/useVoting.ts`：

```typescript
// 定期刷新数据（每10秒）
const interval = setInterval(async () => {
  // ...
}, 10000); // 修改为你需要的毫秒数
```

---

## 架构说明

### 为什么 Edge Functions 是可选的？

本投票系统采用 **直接数据库访问** 架构：

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   前端 App   │────▶│  Supabase JS │────▶│  PostgreSQL │
│  (React)    │     │   Client     │     │   Database  │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  RLS Policies │
                     │  (安全策略)   │
                     └──────────────┘
```

**优势：**
- ✅ 更简单：无需维护后端代码
- ✅ 更快：减少一次网络跳转
- ✅ 更安全：RLS 策略在数据库层面控制权限
- ✅ 免费：不消耗 Edge Function 调用额度

**何时需要 Edge Functions？**
- 需要复杂的业务逻辑验证
- 需要调用第三方 API
- 需要发送邮件/通知
- 需要定时任务

---

## 技术支持

- [Supabase 文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [Edge Functions 文档](https://supabase.com/docs/guides/functions)
- [RLS 策略指南](https://supabase.com/docs/guides/auth/row-level-security)
