# 北京城市更新投票系统 - Supabase 部署指南

## 前置要求

- [Supabase](https://supabase.com) 账号
- Node.js 18+（仅用于构建前端）

> **注意**：本指南支持纯网页操作，无需安装 Supabase CLI

---

## 🚀 快速开始（5分钟完成部署）

### 极简部署流程

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
3. 给查询起个名字，如 `create-dimension-votes-table`

### 2. 执行 SQL

复制以下 SQL 代码，粘贴到编辑器中，然后点击 **Run**：

```sql
-- 创建维度投票记录表
CREATE TABLE IF NOT EXISTS dimension_votes (
  id BIGSERIAL PRIMARY KEY,
  dimension_id TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 1,
  voter_id TEXT NOT NULL,
  voter_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_dimension_votes_dimension_id ON dimension_votes(dimension_id);
CREATE INDEX idx_dimension_votes_voter_id ON dimension_votes(voter_id);
CREATE INDEX idx_dimension_votes_created_at ON dimension_votes(created_at);

-- 创建维度投票统计视图
CREATE OR REPLACE VIEW dimension_vote_stats AS
SELECT 
  dimension_id,
  SUM(vote_count) as total_votes
FROM dimension_votes
GROUP BY dimension_id;

-- 创建总体统计视图
CREATE OR REPLACE VIEW total_dimension_stats AS
SELECT 
  SUM(vote_count) as total_votes,
  COUNT(DISTINCT voter_id) as total_voters
FROM dimension_votes;

-- 启用行级安全 (RLS)
ALTER TABLE dimension_votes ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入投票
CREATE POLICY "Allow anonymous insert" ON dimension_votes
  FOR INSERT TO anon
  WITH CHECK (true);

-- 允许匿名查询投票
CREATE POLICY "Allow anonymous select" ON dimension_votes
  FOR SELECT TO anon
  USING (true);

-- 禁止更新和删除（投票不可修改）
CREATE POLICY "Disallow update" ON dimension_votes
  FOR UPDATE TO anon
  USING (false);

CREATE POLICY "Disallow delete" ON dimension_votes
  FOR DELETE TO anon
  USING (false);
```

### 3. 验证表创建

1. 点击左侧菜单 **Table Editor**
2. 确认能看到 `dimension_votes` 表
3. 确认包含字段：`dimension_id`, `vote_count`, `voter_id`, `voter_name`

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

## 第四步：配置前端环境变量

1. 编辑 `.env` 文件，填入你的 Supabase 配置：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> **重要**：`VITE_SUPABASE_ANON_KEY` 是公开的客户端密钥，可以安全地嵌入前端代码中。不要在这里使用 Service Role Key！

---

## 第五步：构建和部署前端

### 本地构建测试

```bash
# 安装依赖
npm install

# 开发模式测试（本地预览）
npm run dev

# 生产构建（生成 dist 文件夹）
npm run build
```

### 部署到 Vercel（推荐）

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

---

## 第六步：验证部署

1. 访问部署后的网站
2. 输入姓名进入投票页面
3. 测试投票功能（选择维度，投票）
4. 在 Supabase Dashboard → **Table Editor** → **dimension_votes** 中查看数据

---

## 数据库表结构

### dimension_votes 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键，自增 |
| dimension_id | text | 维度ID（15个维度之一） |
| vote_count | integer | 该维度的投票数 |
| voter_id | text | 投票者唯一ID |
| voter_name | text | 投票者姓名 |
| created_at | timestamptz | 创建时间 |

### 视图

- `dimension_vote_stats`: 按维度统计总票数
- `total_dimension_stats`: 总体统计（总票数、总投票人数）

---

## 投票规则

- 每人共 **5 票**
- 可以给 **一个维度投多票**（最多5票）
- 也可以 **分散投票**给多个维度
- 投票前需要 **输入姓名**
- 每人只能投票 **一次**

---

## 15个投票维度

1. 可持续资金平衡
2. 实施主体
3. 城市更新实施单元生成
4. 跨部门协同机制
5. 土地、房屋和空间权属结构
6. 多元利益平衡
7. 公众参与度
8. 市场活力
9. 存量转型
10. 首都功能
11. 产业转型与新功能导入
12. 以人为本的空间品质
13. 绿色转型
14. 资源基础
15. 政策环境

---

## SWOT 标签说明

每个维度下的要点按 SWOT 分析分类：

| 标签 | 颜色 | 含义 |
|------|------|------|
| **S** | 绿色 | 优势 (Strengths) |
| **W** | 黄色 | 劣势 (Weaknesses) |
| **O** | 淡蓝色 | 机遇 (Opportunities) |
| **T** | 红色 | 挑战 (Threats) |

---

## 故障排查

### 问题：无法连接到 Supabase

**检查清单：**
1. 环境变量是否正确设置
2. Supabase URL 和 Anon Key 是否正确
3. 项目是否处于活动状态

### 问题：投票提交失败

**检查清单：**
1. 数据库表 `dimension_votes` 是否正确创建
2. RLS 策略是否正确配置
3. 网络连接是否正常

### 问题：姓名没有记录

**检查清单：**
1. 确认 `voter_name` 字段存在于表中
2. 检查前端是否正确发送 `voter_name`

---

## 技术支持

- [Supabase 文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [RLS 策略指南](https://supabase.com/docs/guides/auth/row-level-security)
