-- 创建投票记录表
CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  issue_id TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 1,
  voter_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_votes_issue_id ON votes(issue_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- 创建投票统计视图
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

-- 启用 RLS (行级安全)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 创建插入策略（允许匿名插入）
CREATE POLICY "Allow anonymous insert" ON votes
  FOR INSERT TO anon
  WITH CHECK (true);

-- 创建查询策略（允许匿名查询）
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
