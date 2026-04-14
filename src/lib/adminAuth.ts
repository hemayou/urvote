import { supabase } from './supabase';

// 管理员登录
export async function adminLogin(username: string, password: string): Promise<{ success: boolean; admin?: { username: string; name: string }; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('username, name, password_hash')
      .eq('username', username)
      .single();
    
    if (error || !data) {
      return { success: false, error: '用户名或密码错误' };
    }
    
    // 简单密码验证（实际生产环境应使用 bcrypt 等哈希比较）
    if (data.password_hash !== password) {
      return { success: false, error: '用户名或密码错误' };
    }
    
    // 保存登录状态到 localStorage
    const adminSession = {
      username: data.username,
      name: data.name,
      loginTime: Date.now(),
    };
    localStorage.setItem('bupd-admin-session', JSON.stringify(adminSession));
    
    return { 
      success: true, 
      admin: { username: data.username, name: data.name } 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: '登录失败，请重试' };
  }
}

// 检查是否已登录
export function checkAdminLogin(): { isLoggedIn: boolean; admin?: { username: string; name: string } } {
  const session = localStorage.getItem('bupd-admin-session');
  if (!session) return { isLoggedIn: false };
  
  try {
    const parsed = JSON.parse(session);
    // 检查会话是否过期（24小时）
    if (Date.now() - parsed.loginTime > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('bupd-admin-session');
      return { isLoggedIn: false };
    }
    return { isLoggedIn: true, admin: { username: parsed.username, name: parsed.name } };
  } catch {
    return { isLoggedIn: false };
  }
}

// 管理员登出
export function adminLogout(): void {
  localStorage.removeItem('bupd-admin-session');
}

// 获取管理员统计数据
export async function getAdminStats() {
  try {
    // 获取总体统计
    const { data: overallData, error: overallError } = await supabase
      .from('admin_overall_stats')
      .select('*')
      .single();
    
    if (overallError) throw overallError;
    
    // 获取维度统计
    const { data: dimensionData, error: dimensionError } = await supabase
      .from('admin_dimension_stats')
      .select('*');
    
    if (dimensionError) throw dimensionError;
    
    // 获取详细投票记录
    const { data: detailsData, error: detailsError } = await supabase
      .from('admin_vote_details')
      .select('*')
      .limit(100);
    
    if (detailsError) throw detailsError;
    
    return {
      overall: overallData || { total_votes: 0, total_voters: 0, voted_dimensions: 0 },
      dimensions: dimensionData || [],
      details: detailsData || [],
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }
}
