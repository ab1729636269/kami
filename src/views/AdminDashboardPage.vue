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
      <h2 class="text-2xl font-bold text-gray-900 mb-6">仪表盘</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  总卡密数
                </dt>
                <dd>
                  <div class="text-lg font-semibold text-gray-900">
                    {{ statistics.kami?.total || 0 }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  未使用卡密
                </dt>
                <dd>
                  <div class="text-lg font-semibold text-gray-900">
                    {{ statistics.kami?.unused || 0 }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  已使用卡密
                </dt>
                <dd>
                  <div class="text-lg font-semibold text-gray-900">
                    {{ statistics.kami?.used || 0 }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.633-1.964-.633-2.732 0L3.34 16c-.77.633.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  已过期卡密
                </dt>
                <dd>
                  <div class="text-lg font-semibold text-gray-900">
                    {{ statistics.kami?.expired || 0 }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">卡密生成趋势</h3>
          <div class="h-64">
            <canvas ref="trendChart"></canvas>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">用户活跃度</h3>
          <div class="h-64">
            <canvas ref="activityChart"></canvas>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">卡密类型统计</h3>
        <div class="h-64">
          <canvas ref="typeChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import { API_ENDPOINTS } from '../config/api';

const router = useRouter();
const trendChart = ref<HTMLCanvasElement | null>(null);
const activityChart = ref<HTMLCanvasElement | null>(null);
const typeChart = ref<HTMLCanvasElement | null>(null);
let trendChartInstance: Chart | null = null;
let activityChartInstance: Chart | null = null;
let typeChartInstance: Chart | null = null;

interface KamiTypeStat {
  type_name: string;
  description: string;
  count: number;
}

const statistics = ref({
  kami: {
    total: 0,
    unused: 0,
    used: 0,
    expired: 0,
    byType: [] as KamiTypeStat[],
    trend: [] as { date: string; count: number }[]
  },
  users: {
    total: 0,
    admin: 0,
    user: 0,
    activity: [] as { date: string; count: number }[]
  }
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const fetchStatistics = async () => {
  try {
    const [kamiResponse, usersResponse, trendResponse, activityResponse] = await Promise.all([
      fetch(API_ENDPOINTS.statistics.kami),
      fetch(API_ENDPOINTS.statistics.users),
      fetch(API_ENDPOINTS.statistics.kamiTrend),
      fetch(API_ENDPOINTS.statistics.userActivity)
    ]);

    const kamiData = await kamiResponse.json();
    const usersData = await usersResponse.json();
    const trendData = await trendResponse.json();
    const activityData = await activityResponse.json();

    if (kamiResponse.ok) {
      statistics.value.kami = { ...statistics.value.kami, ...kamiData };
    }

    if (usersResponse.ok) {
      statistics.value.users = { ...statistics.value.users, ...usersData };
    }

    if (trendResponse.ok) {
      statistics.value.kami.trend = trendData;
    }

    if (activityResponse.ok) {
      statistics.value.users.activity = activityData;
    }

    updateCharts();
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

const updateCharts = () => {
  // 更新卡密生成趋势图
  if (trendChart.value) {
    if (trendChartInstance) {
      trendChartInstance.destroy();
    }
    trendChartInstance = new Chart(trendChart.value, {
      type: 'line',
      data: {
        labels: statistics.value.kami.trend.map(item => item.date),
        datasets: [{
          label: '卡密生成数量',
          data: statistics.value.kami.trend.map(item => item.count),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // 更新用户活跃度图
  if (activityChart.value) {
    if (activityChartInstance) {
      activityChartInstance.destroy();
    }
    activityChartInstance = new Chart(activityChart.value, {
      type: 'bar',
      data: {
        labels: statistics.value.users.activity.map(item => item.date),
        datasets: [{
          label: '登录次数',
          data: statistics.value.users.activity.map(item => item.count),
          backgroundColor: 'rgb(54, 162, 235)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // 更新卡密类型统计图
  if (typeChart.value) {
    if (typeChartInstance) {
      typeChartInstance.destroy();
    }
    typeChartInstance = new Chart(typeChart.value, {
      type: 'pie',
      data: {
        labels: statistics.value.kami.byType.map(item => item.type_name),
        datasets: [{
          data: statistics.value.kami.byType.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
};

// 定时更新数据
let updateInterval: number | null = null;

onMounted(() => {
  fetchStatistics();
  // 每30秒更新一次数据
  updateInterval = window.setInterval(fetchStatistics, 30000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  if (trendChartInstance) {
    trendChartInstance.destroy();
  }
  if (activityChartInstance) {
    activityChartInstance.destroy();
  }
  if (typeChartInstance) {
    typeChartInstance.destroy();
  }
});
</script>

<style scoped>
/* 组件样式 */
</style>