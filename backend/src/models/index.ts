import sequelize from '../config/database';
import User from './User';
import KamiType from './KamiType';
import Kami from './Kami';
import Log from './Log';
import bcrypt from 'bcrypt';

// 关联模型
Kami.belongsTo(KamiType, { foreignKey: 'type_id', as: 'kamitype' });
Kami.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Log.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 初始化数据库
async function initDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log('数据库初始化成功');
    
    // 生成密码哈希
    const hashedPassword = await bcrypt.hash('admin@qq.com', 10);
    
    // 插入默认数据 - 使用 upsert 避免重复
    await User.upsert({
      email: 'admin@qq.com',
      password: hashedPassword,
      name: '管理员',
      is_admin: true
    });
    
    await User.upsert({
      email: 'user@example.com',
      password: hashedPassword,
      name: '普通用户',
      is_admin: false
    });
    
    // 插入卡密类型
    const kamiTypes = [
      { name: '试用卡', description: '1天试用卡密', length: 16, prefix: 'TRIAL', suffix: '', validity_days: 1 },
      { name: '周卡', description: '7天有效期卡密', length: 16, prefix: 'WEEK', suffix: '', validity_days: 7 },
      { name: '月卡', description: '30天有效期卡密', length: 16, prefix: 'MONTH', suffix: '', validity_days: 30 },
      { name: '年卡', description: '365天有效期卡密', length: 16, prefix: 'YEAR', suffix: '', validity_days: 365 },
      { name: '永久卡', description: '永久有效卡密', length: 16, prefix: 'PERM', suffix: '', validity_days: 9999 }
    ];
    
    for (const type of kamiTypes) {
      await KamiType.upsert(type);
    }
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

export {
  sequelize,
  User,
  KamiType,
  Kami,
  Log,
  initDatabase
};