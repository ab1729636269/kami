#!/usr/bin/env node

/**
 * 卡密验证功能测试脚本
 * 测试卡密的验证、使用和状态查询功能
 */

// API基础地址
const API_BASE_URL = 'http://localhost:3000';

// 动态导入node-fetch
let fetch;
async function loadFetch() {
  if (!fetch) {
    const module = await import('node-fetch');
    fetch = module.default;
  }
  return fetch;
}


/**
 * 验证卡密
 * @param {string} code 卡密代码
 * @returns {Promise<Object>} 验证结果
 */
async function verifyKami(code) {
  try {
    const fetch = await loadFetch();
    const response = await fetch(`${API_BASE_URL}/api/kami/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    
    const data = await response.json();
    console.log('验证卡密结果:', data);
    return data;
  } catch (error) {
    console.error('验证卡密失败:', error);
    return { valid: false, message: '验证失败' };
  }
}

/**
 * 使用卡密
 * @param {string} code 卡密代码
 * @returns {Promise<Object>} 使用结果
 */
async function useKami(code) {
  try {
    const fetch = await loadFetch();
    const response = await fetch(`${API_BASE_URL}/api/kami/use`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    
    const data = await response.json();
    console.log('使用卡密结果:', data);
    return data;
  } catch (error) {
    console.error('使用卡密失败:', error);
    return { success: false, message: '使用失败' };
  }
}

/**
 * 查询卡密状态
 * @param {string} code 卡密代码
 * @returns {Promise<Object>} 状态信息
 */
async function getKamiStatus(code) {
  try {
    const fetch = await loadFetch();
    const response = await fetch(`${API_BASE_URL}/api/kami/status/${code}`);
    const data = await response.json();
    console.log('查询卡密状态结果:', data);
    return data;
  } catch (error) {
    console.error('查询卡密状态失败:', error);
    return { message: '查询失败' };
  }
}

/**
 * 主测试函数
 */
async function main() {
  console.log('=== 卡密验证功能测试 ===\n');
  
  // 测试用卡密（请替换为实际生成的卡密）
  const testCode = 'MONTH37NW2D8UYNL';
  
  console.log(`测试卡密: ${testCode}\n`);
  
  // 1. 验证卡密
  console.log('1. 验证卡密:');
  const verifyResult = await verifyKami(testCode);
  
  if (verifyResult.valid) {
    // 2. 使用卡密
    console.log('\n2. 使用卡密:');
    const useResult = await useKami(testCode);
    
    if (useResult.success) {
      // 3. 再次验证卡密（应该返回已使用）
      console.log('\n3. 再次验证卡密:');
      await verifyKami(testCode);
      
      // 4. 查询卡密状态
      console.log('\n4. 查询卡密状态:');
      await getKamiStatus(testCode);
    }
  }
  
  console.log('\n=== 测试完成 ===');
}

// 运行测试
main();
