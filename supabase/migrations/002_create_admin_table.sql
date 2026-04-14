-- ============================================
-- 管理员账号表
-- ============================================

-- 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 允许匿名查询（用于登录验证）
CREATE POLICY "Allow anonymous select" ON admins
  FOR SELECT TO anon
  USING (true);

-- 禁止插入、更新、删除（仅通过 SQL 手动管理）
CREATE POLICY "Disallow insert" ON admins
  FOR INSERT TO anon
  USING (false);

CREATE POLICY "Disallow update" ON admins
  FOR UPDATE TO anon
  USING (false);

CREATE POLICY "Disallow delete" ON admins
  FOR DELETE TO anon
  USING (false);

-- ============================================
-- 插入默认管理员账号
-- 密码: admin123 (使用简单的明文存储，实际生产环境应使用哈希)
-- ============================================

INSERT INTO admins (username, password_hash, name) VALUES
  ('admin', 'admin123', '超级管理员')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 投票统计视图（用于管理员查看）
-- ============================================

-- 按维度统计（包含投票人列表）
CREATE OR REPLACE VIEW admin_dimension_stats AS
SELECT 
  dimension_id,
  SUM(vote_count) as total_votes,
  COUNT(DISTINCT voter_id) as voter_count,
  ARRAY_AGG(DISTINCT voter_name ORDER BY voter_name) as voter_names
FROM dimension_votes
GROUP BY dimension_id;

-- 详细投票记录
CREATE OR REPLACE VIEW admin_vote_details AS
SELECT 
  dv.id,
  dv.dimension_id,
  d.title as dimension_title,
  dv.vote_count,
  dv.voter_id,
  dv.voter_name,
  dv.created_at
FROM dimension_votes dv
JOIN (
  SELECT id, title FROM (
    VALUES 
      ('funding', '可持续资金平衡'),
      ('implementer', '实施主体'),
      ('unit', '城市更新实施单元生成'),
      ('coordination', '跨部门协同机制'),
      ('property', '土地、房屋和空间权属结构'),
      ('interest', '多元利益平衡'),
      ('public', '公众参与度'),
      ('market', '市场活力'),
      ('stock', '存量转型'),
      ('capital', '首都功能'),
      ('industry', '产业转型与新功能导入'),
      ('quality', '以人为本的空间品质'),
      ('green', '绿色转型'),
      ('resource', '资源基础'),
      ('policy', '政策环境')
  ) AS t(id, title)
) d ON dv.dimension_id = d.id
ORDER BY dv.created_at DESC;

-- 总体统计
CREATE OR REPLACE VIEW admin_overall_stats AS
SELECT 
  SUM(vote_count) as total_votes,
  COUNT(DISTINCT voter_id) as total_voters,
  COUNT(DISTINCT dimension_id) as voted_dimensions
FROM dimension_votes;
