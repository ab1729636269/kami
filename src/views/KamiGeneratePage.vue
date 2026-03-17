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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">生成卡密</h2>
        <form @submit.prevent="handleGenerate" class="space-y-6">
          <div>
            <label for="type_id" class="block text-sm font-medium text-gray-700">
              卡密类型
            </label>
            <div class="mt-1">
              <select
                id="type_id"
                v-model="form.type_id"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">请选择卡密类型</option>
                <option v-for="type in kamiTypes" :key="type.id" :value="type.id">
                  {{ type.name }} - {{ type.description }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label for="count" class="block text-sm font-medium text-gray-700">
              生成数量
            </label>
            <div class="mt-1">
              <input
                id="count"
                v-model.number="form.count"
                type="number"
                min="1"
                max="100"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入生成数量"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {{ loading ? '生成中...' : '生成卡密' }}
            </button>
          </div>
        </form>
        <div v-if="generatedKamis.length > 0" class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">生成的卡密</h3>
          <div class="bg-gray-50 p-4 rounded-md">
            <div v-for="kami in generatedKamis" :key="kami.id" class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="font-mono text-gray-900">{{ kami.code }}</span>
              <span class="text-sm text-gray-600">{{ kami.type_name }}</span>
            </div>
          </div>
          <button @click="downloadKamis" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            下载卡密
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { API_ENDPOINTS } from '../config/api';

const router = useRouter();
const loading = ref(false);
const kamiTypes = ref<any[]>([]);
const generatedKamis = ref<any[]>([]);
const form = ref({
  type_id: '',
  count: 1
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

const handleGenerate = async () => {
  loading.value = true;
  try {
    const response = await fetch(API_ENDPOINTS.kami.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ type_id: form.value.type_id, count: form.value.count })
    });

    const data = await response.json();

    if (response.ok) {
      generatedKamis.value = data.kamis;
    } else {
      alert(data.message || '生成卡密失败');
    }
  } catch (error) {
    console.error('生成卡密失败:', error);
    alert('生成卡密失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const downloadKamis = () => {
  const codes = generatedKamis.value.map(kami => kami.code).join('\n');
  const blob = new Blob([codes], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `卡密_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

onMounted(() => {
  fetchKamiTypes();
});
</script>

<style scoped>
/* 组件样式 */
</style>