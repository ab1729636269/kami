#!/bin/bash

# 部署脚本

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "开始部署卡密系统..."

# 构建前端项目
echo "构建前端项目..."
cd "$SCRIPT_DIR"
npm install || { echo "前端依赖安装失败"; exit 1; }
npm run build || { echo "前端构建失败"; exit 1; }

# 构建后端项目
echo "构建后端项目..."
cd "$SCRIPT_DIR/backend"
npm install || { echo "后端依赖安装失败"; exit 1; }
npm run build || { echo "后端构建失败"; exit 1; }

# 启动前端开发服务器
echo "启动前端开发服务器..."
cd "$SCRIPT_DIR"
npm run dev &
FRONTEND_PID=$!

echo "前端服务器已启动，进程ID: $FRONTEND_PID"

# 启动后端服务器
echo "启动后端服务器..."
cd "$SCRIPT_DIR/backend"
npm run start &
BACKEND_PID=$!

echo "后端服务器已启动，进程ID: $BACKEND_PID"

echo "卡密系统部署完成！"
echo "前端服务: http://localhost:5173"
echo "后端API: http://localhost:3000"

# 监控进程状态
trap 'kill $FRONTEND_PID $BACKEND_PID 2>/dev/null' EXIT

# 等待任一进程结束
echo "监控服务运行状态..."
while true; do
  if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "前端服务已停止"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
  
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "后端服务已停止"
    kill $FRONTEND_PID 2>/dev/null
    exit 1
  fi
  
  sleep 2
done
