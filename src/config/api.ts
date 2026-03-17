// API配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    changePassword: `${API_BASE_URL}/api/auth/change-password`
  },
  // 卡密相关
  kami: {
    generate: `${API_BASE_URL}/api/kami/generate`,
    list: `${API_BASE_URL}/api/kami/list`,
    types: `${API_BASE_URL}/api/kami/types`,
    status: (id: number) => `${API_BASE_URL}/api/kami/${id}/status`,
    verify: `${API_BASE_URL}/api/kami/verify`,
    use: `${API_BASE_URL}/api/kami/use`,
    statusByCode: (code: string) => `${API_BASE_URL}/api/kami/status/${code}`
  },
  // 管理员相关
  admin: {
    users: `${API_BASE_URL}/api/admin/users`,
    user: (id: number) => `${API_BASE_URL}/api/admin/users/${id}`,
    kamis: `${API_BASE_URL}/api/admin/kamis`,
    kami: (id: number) => `${API_BASE_URL}/api/admin/kamis/${id}`,
    loginLogs: `${API_BASE_URL}/api/admin/login-logs`
  },
  // 统计相关
  statistics: {
    kami: `${API_BASE_URL}/api/statistics/kami`,
    users: `${API_BASE_URL}/api/statistics/users`,
    kamiTrend: `${API_BASE_URL}/api/statistics/kami/trend`,
    userActivity: `${API_BASE_URL}/api/statistics/users/activity`
  }
};
