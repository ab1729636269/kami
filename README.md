# 卡密系统

## 项目概述

卡密系统是一个功能完整的网页版卡密生成与管理平台，专为企业和个人提供卡密的创建、验证、使用和管理服务。系统分为前后端两部分：

- **前端**：面向普通用户，提供卡密生成、列表查看、状态管理等功能
- **后端**：面向管理员，提供用户管理、卡密管理、登录日志、数据统计等功能

系统支持多种卡密类型（试用卡、周卡、月卡、年卡、永久卡），并提供完整的API接口供其他系统集成使用。

## 技术栈

- **前端**：Vue 3 + Vite + TypeScript + Tailwind CSS
- **后端**：Node.js + Express + TypeScript + Sequelize + SQLite
- **数据库**：SQLite

## 项目结构

```
├── backend/          # 后端项目
│   ├── src/          # 后端源代码
│   │   ├── config/   # 配置文件
│   │   ├── models/   # 数据模型
│   │   ├── routes/   # API路由
│   │   ├── app.ts    # Express应用
│   │   └── index.ts  # 入口文件
│   ├── package.json  # 后端依赖
│   └── tsconfig.json # TypeScript配置
├── src/              # 前端源代码
│   ├── assets/       # 静态资源
│   ├── components/   # 组件
│   ├── router/       # 路由配置
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   ├── main.ts       # 入口文件
│   └── style.css     # 全局样式
├── index.html        # 前端入口HTML
├── package.json      # 前端依赖
├── tailwind.config.js # Tailwind CSS配置
├── postcss.config.js # PostCSS配置
├── vite.config.ts    # Vite配置
├── tsconfig.json     # TypeScript配置
└── deploy.sh         # 部署脚本
```

## 功能模块

### 前端功能
1. **用户模块**：注册、登录、个人信息管理
2. **卡密生成模块**：卡密类型选择、数量设置、生成请求提交、卡密结果展示与导出
3. **卡密管理模块**：卡密列表查看、状态管理

### 后端功能
1. **用户认证模块**：用户注册、登录、JWT令牌生成与验证
2. **卡密管理模块**：卡密生成、查询、状态更新
3. **数据统计模块**：卡密生成量、使用量、剩余量统计，用户活跃度统计
4. **卡密类型管理**：卡密类型配置

## 快速开始

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend && npm install && cd ..
```

### 运行开发服务器

```bash
# 启动前端开发服务器（新终端）
npm run dev

# 启动后端开发服务器（新终端）
cd backend && npm run dev
```

### 构建与部署

```bash
# 构建前端项目
npm run build

# 构建后端项目
cd backend && npm run build && cd ..

# 运行部署脚本
./deploy.sh
```

## 系统访问

- **前端**：http://localhost:5173
- **后端API**：http://localhost:3000

## 默认账号

- **管理员账号**：admin@qq.com / 密码：admin@qq.com
- **普通用户账号**：user@example.com / 密码：admin@qq.com

## 技术支持

如有任何问题，请联系系统管理员。

## 部署指南

### 快速部署

#### 1. 系统准备

**CentOS 9 系统**：
```bash
# 更新系统并安装依赖
sudo dnf update -y && sudo dnf install -y git curl wget gcc-c++ make

# 安装 Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo dnf install -y nodejs
```

**Ubuntu/Debian 系统**：
```bash
# 更新系统并安装依赖
sudo apt update -y && sudo apt upgrade -y && sudo apt install -y git curl wget build-essential

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash - && sudo apt install -y nodejs
```

#### 2. 项目部署

```bash
# 克隆项目
git clone https://github.com/yourusername/kami-system.git && cd kami-system

# 安装依赖
npm install && cd backend && npm install && cd ..

# 构建项目
npm run build && cd backend && npm run build && cd ..

# 配置环境变量
cd backend && cat > .env << EOF
PORT=3000
JWT_SECRET=your_jwt_secret_key
EOF
cd ..

# 安装并启动服务
npm install -g pm2 && cd backend && npm run start:backend && cd .. && npm run start:frontend
```

#### 3. 服务器配置

**CentOS 9 防火墙**：
```bash
sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --permanent --add-port=5173/tcp && sudo firewall-cmd --reload
```

**Ubuntu/Debian 防火墙**：
```bash
sudo ufw allow 3000/tcp && sudo ufw allow 5173/tcp && sudo ufw reload
```

**设置开机自启**：
```bash
pm2 save && pm2 startup
```

#### 4. 访问系统

- **前端**：http://your-server-ip:5173
- **后端API**：http://your-server-ip:3000

### 自动化部署脚本

项目根目录提供了自动化部署脚本，您可以根据系统类型选择使用：
- `deploy.sh` - 通用部署脚本

**使用方法**：
```bash
chmod +x deploy.sh
./deploy.sh
```

### 11. 常见问题

1. **Node.js 版本问题**：确保使用 Node.js 18+ 版本
2. **端口占用**：如果端口被占用，可以修改 .env 文件中的 PORT 配置
3. **防火墙问题**：确保防火墙已开放相应端口
4. **PM2 启动失败**：检查日志 `pm2 logs` 查看详细错误信息
5. **数据库重置问题**：每次重启会重置数据库，导致所有卡密失效。要解决这个问题，您需要修改 backend/src/models/index.ts 文件中的 initDatabase 函数，将 `await sequelize.sync({ force: true });` 改为 `await sequelize.sync({ force: false });`

## 项目集成指南

如果您想将其他项目与卡密系统集成，可以通过以下方式对接：

### 1. API 接口集成

#### 1.1 卡密验证接口

**接口地址**：`POST /api/kami/verify`

**请求参数**：
```json
{
  "code": "卡密代码"
}
```

**响应示例**：
```json
{
  "valid": true,
  "kami": {
    "id": 1,
    "code": "TRIAL1234567890",
    "type_id": 1,
    "type_name": "试用卡",
    "status": "unused",
    "expired_at": "2026-03-18T00:00:00.000Z"
  }
}
```

#### 1.2 卡密使用接口

**接口地址**：`POST /api/kami/use`

**请求参数**：
```json
{
  "code": "卡密代码"
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "卡密使用成功",
  "kami": {
    "id": 1,
    "code": "TRIAL1234567890",
    "status": "used",
    "used_at": "2026-03-17T12:00:00.000Z"
  }
}
```

#### 1.3 卡密状态查询接口

**接口地址**：`GET /api/kami/status/:code`

**响应示例**：
```json
{
  "status": "unused",
  "expired_at": "2026-03-18T00:00:00.000Z",
  "type_name": "试用卡"
}
```

### 2. 集成示例

#### 2.1 JavaScript/Node.js 示例

```javascript
// 验证卡密
async function verifyKami(code) {
  const response = await fetch('http://localhost:3000/api/kami/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });
  return response.json();
}

// 使用卡密
async function useKami(code) {
  const response = await fetch('http://localhost:3000/api/kami/use', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });
  return response.json();
}

// 查询卡密状态
async function getKamiStatus(code) {
  const response = await fetch(`http://localhost:3000/api/kami/status/${code}`);
  return response.json();
}

// 使用示例
async function main() {
  const code = 'TRIAL1234567890';
  
  // 验证卡密
  const verifyResult = await verifyKami(code);
  console.log('验证结果:', verifyResult);
  
  if (verifyResult.valid) {
    // 使用卡密
    const useResult = await useKami(code);
    console.log('使用结果:', useResult);
  }
}

main();
```

#### 2.2 Python 示例

```python
import requests
import json

# 验证卡密
def verify_kami(code):
    url = 'http://localhost:3000/api/kami/verify'
    data = {'code': code}
    response = requests.post(url, json=data)
    return response.json()

# 使用卡密
def use_kami(code):
    url = 'http://localhost:3000/api/kami/use'
    data = {'code': code}
    response = requests.post(url, json=data)
    return response.json()

# 查询卡密状态
def get_kami_status(code):
    url = f'http://localhost:3000/api/kami/status/{code}'
    response = requests.get(url)
    return response.json()

# 使用示例
if __name__ == '__main__':
    code = 'TRIAL1234567890'
    
    # 验证卡密
    verify_result = verify_kami(code)
    print('验证结果:', verify_result)
    
    if verify_result.get('valid'):
        # 使用卡密
        use_result = use_kami(code)
        print('使用结果:', use_result)
```

### 3. 集成流程

1. **获取卡密**：用户通过卡密系统生成或购买卡密
2. **验证卡密**：在您的项目中，用户输入卡密后，调用验证接口检查卡密是否有效
3. **使用卡密**：验证通过后，调用使用接口将卡密标记为已使用
4. **状态管理**：根据卡密的状态和有效期，在您的项目中实现相应的功能逻辑

### 4. 注意事项

1. **安全性**：确保在传输卡密时使用 HTTPS 协议
2. **错误处理**：妥善处理 API 调用失败的情况
3. **缓存策略**：对于频繁验证的场景，可以考虑缓存验证结果，提高性能
4. **日志记录**：记录卡密验证和使用的日志，便于排查问题
5. **速率限制**：注意 API 调用频率，避免过度请求

### 5. 自定义集成

如果您需要更深入的集成，可以考虑：

1. **添加 Webhook**：在卡密状态变更时通知您的系统
2. **自定义卡密类型**：根据您的业务需求创建特定的卡密类型
3. **集成用户系统**：将卡密系统与您的用户系统关联
4. **批量操作**：实现批量验证和使用卡密的功能

通过以上方式，您可以将卡密系统无缝集成到您的其他项目中，为用户提供更加便捷的卡密管理体验。

### 6. 测试脚本

项目根目录下的 `test-kami.js` 文件是卡密验证功能的测试脚本，您可以使用它来测试卡密的验证、使用和状态查询功能。

**使用方法**：
```bash
# 安装依赖
npm install node-fetch

# 运行测试脚本
node test-kami.js
```

**测试内容**：
- 验证卡密是否有效
- 使用卡密并标记为已使用
- 再次验证卡密状态
- 查询卡密详细状态