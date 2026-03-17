<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-bold text-indigo-600">卡密系统</span>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/kami/generate" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              生成卡密
            </router-link>
            <router-link to="/kami/list" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              卡密列表
            </router-link>
            <router-link to="/change-password" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              修改密码
            </router-link>
            <button @click="handleLogout" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">卡密列表</h2>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div class="flex space-x-4 mb-4 md:mb-0">
            <select
              v-model="filter.status"
              @change="fetchKamis"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">全部状态</option>
              <option value="unused">未使用</option>
              <option value="used">已使用</option>
              <option value="expired">已过期</option>
            </select>
            <select
              v-model="filter.type_id"
              @change="fetchKamis"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">全部类型</option>
              <option v-for="type in kamiTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
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
                  卡密
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  生成时间
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  过期时间
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="kami in kamis" :key="kami.id">
                <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                  {{ kami.code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ kami.type_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800': kami.status === 'unused',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800': kami.status === 'used',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800': kami.status === 'expired'
                  }">
                    {{ kami.status === 'unused' ? '未使用' : kami.status === 'used' ? '已使用' : '已过期' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(kami.generated_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(kami.expired_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    v-if="kami.status === 'unused'"
                    @click="updateKamiStatus(kami.id, 'used')"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    标记为已使用
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="kamis.length === 0" class="text-center py-8 text-gray-500">
          暂无卡密数据
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
const loading = ref(false);
const kamis = ref<any[]>([]);
const kamiTypes = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const filter = ref({
  status: '',
  type_id: ''
});

const totalPages = computed(() => {
  return Math.ceil(total.value / limit.value);
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const fetchKamiTypes = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.kami.types);
    if (response.ok) {
      const data = await response.json();
      kamiTypes.value = data;
    }
  } catch (error) {
    console.error('获取卡密类型失败:', error);
  }
};

const fetchKamis = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.value.toString(),
      limit: limit.value.toString()
    });

    if (filter.value.status) {
      params.append('status', filter.value.status);
    }

    if (filter.value.type_id) {
      params.append('type_id', filter.value.type_id);
    }

    const response = await fetch(`${API_ENDPOINTS.kami.list}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();

    if (response.ok) {
      kamis.value = data.kamis;
      total.value = data.total;
    } else {
      alert(data.message || '获取卡密列表失败');
    }
  } catch (error) {
    console.error('获取卡密列表失败:', error);
    alert('获取卡密列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
    fetchKamis();
  }
};

const updateKamiStatus = async (id: number, status: string) => {
  try {
    const response = await fetch(API_ENDPOINTS.kami.status(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      fetchKamis();
    } else {
      alert('更新卡密状态失败');
    }
  } catch (error) {
    console.error('更新卡密状态失败:', error);
    alert('更新卡密状态失败，请稍后重试');
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

onMounted(() => {
  fetchKamiTypes();
  fetchKamis();
});
</script>

<style scoped>
/* 组件样式 */
</style>