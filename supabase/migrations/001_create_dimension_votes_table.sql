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

-- 启用 RLS (行级安全)
ALTER TABLE dimension_votes ENABLE ROW LEVEL SECURITY;

-- 创建插入策略（允许匿名插入）
CREATE POLICY "Allow anonymous insert" ON dimension_votes
  FOR INSERT TO anon
  WITH CHECK (true);

-- 创建查询策略（允许匿名查询）
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
