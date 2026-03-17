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
    <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">修改密码</h2>
        <form @submit.prevent="handleChangePassword" class="space-y-6">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700">
              当前密码
            </label>
            <div class="mt-1">
              <input
                id="currentPassword"
                v-model="form.currentPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入当前密码"
              />
            </div>
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">
              新密码
            </label>
            <div class="mt-1">
              <input
                id="newPassword"
                v-model="form.newPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入新密码"
              />
            </div>
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              确认新密码
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请确认新密码"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {{ loading ? '修改中...' : '修改密码' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { API_ENDPOINTS } from '../config/api';

const router = useRouter();
const loading = ref(false);
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const handleChangePassword = async () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('新密码和确认密码不一致');
    return;
  }

  loading.value = true;
  try {
    const response = await fetch(API_ENDPOINTS.auth.changePassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        old_password: form.value.currentPassword,
        new_password: form.value.newPassword
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('密码修改成功');
      router.push('/kami/generate');
    } else {
      alert(data.message || '密码修改失败');
    }
  } catch (error) {
    console.error('密码修改失败:', error);
    alert('密码修改失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 组件样式 */
</style>