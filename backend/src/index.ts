import app from './app';
import dotenv from 'dotenv';
import { initDatabase } from './models';

dotenv.config();

const PORT = process.env.PORT || 3000;

// 初始化数据库并启动服务
async function startServer() {
  try {
    await initDatabase();
    console.log('数据库初始化完成');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('启动服务失败:', error);
  }
}

startServer();