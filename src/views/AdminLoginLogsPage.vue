<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-bold text-indigo-600">卡密系统管理后台</span>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/admin/dashboard" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              仪表盘
            </router-link>
            <router-link to="/admin/users" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              用户管理
            </router-link>
            <router-link to="/admin/login-logs" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              登录日志
            </router-link>
            <router-link to="/admin/all-kamis" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              卡密管理
            </router-link>
            <button @click="handleLogout" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">登录日志</h2>
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div class="flex space-x-4 mb-4 md:mb-0">
            <select
              v-model="filter.userId"
              @change="fetchLoginLogs"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">全部用户</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.email }}
              </option>
            </select>
            <select
              v-model="filter.action"
              @change="fetchLoginLogs"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">全部操作</option>
              <option value="login">登录成功</option>
              <option value="login_failed">登录失败</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(page - 1)"
              :disabled="page === 1"
              class="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-sm font-medium text-gray-700">
              第 {{ page }} 页，共 {{ totalPages }} 页
            </span>
            <button
              @click="changePage(page + 1)"
              :disabled="page >= totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP地址
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  设备信息
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in logs" :key="log.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ log.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ log.user_email || '未知用户' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800': log.action === 'login',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800': log.action === 'login_failed'
                  }">
                    {{ log.action === 'login' ? '登录成功' : '登录失败' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ log.ip_address }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ log.description || '无' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(log.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="logs.length === 0" class="text-center py-8 text-gray-500">
          暂无登录日志
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { API_ENDPOINTS } from '../config/api';

const router = useRouter();
const logs = ref<any[]>([]);
const users = ref<any[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const filter = ref({
  userId: '',
  action: ''
});

const totalPages = computed(() => {
  return Math.ceil(total.value / limit.value);
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const fetchUsers = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.admin.users, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();

    if (response.ok) {
      users.value = data;
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
};

const fetchLoginLogs = async () => {
  try {
    const params = new URLSearchParams({
      page: page.value.toString(),
      limit: limit.value.toString()
    });

    if (filter.value.userId) {
      params.append('user_id', filter.value.userId);
    }

    if (filter.value.action) {
      params.append('action', filter.value.action);
    }

    const response = await fetch(`${API_ENDPOINTS.admin.loginLogs}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();

    if (response.ok) {
      logs.value = data.logs;
      total.value = data.total;
    } else {
      alert(data.message || '获取登录日志失败');
    }
  } catch (error) {
    console.error('获取登录日志失败:', error);
    alert('获取登录日志失败，请稍后重试');
  }
};

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
    fetchLoginLogs();
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

onMounted(() => {
  fetchUsers();
  fetchLoginLogs();
});
</script>

<style scoped>
/* 组件样式 */
</style>