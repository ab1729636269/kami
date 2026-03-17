import express from 'express';
import { User, Kami, Log, KamiType } from '../models';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// 验证管理员权限
const adminMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = (req as any).user;
  if (!user || !user.is_admin) {
    return res.status(403).json({ message: '权限不足' });
  }
  next();
};

// 获取所有用户
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'is_admin', 'created_at', 'updated_at']
    });
    res.json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除用户
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 不允许删除管理员账号
    const user = await User.findByPk(Number(id));
    if (user && user.is_admin) {
      return res.status(400).json({ message: '不能删除管理员账号' });
    }
    
    await User.destroy({ where: { id } });
    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取登录日志
router.get('/login-logs', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id, action } = req.query;
    
    const where: any = {};
    if (user_id) {
      where.user_id = user_id;
    }
    if (action) {
      where.action = action;
    }
    
    const { count, rows } = await Log.findAndCountAll({
      where,
      include: [{
        model: User,
        attributes: ['email'],
        as: 'user'
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string)
    });
    
    const logs = rows.map((row: any) => {
      const log = row.toJSON();
      return {
        id: log.id,
        user_id: log.user_id,
        user_email: (log.user as any)?.email || '未知用户',
        action: log.action,
        description: log.description,
        ip_address: log.ip_address,
        created_at: log.created_at
      };
    });
    
    res.json({ logs, total: count });
  } catch (error) {
    console.error('获取登录日志失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取所有卡密
router.get('/kamis', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type_id, user_id } = req.query;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (type_id) {
      where.type_id = type_id;
    }
    if (user_id) {
      where.user_id = user_id;
    }
    
    const { count, rows } = await Kami.findAndCountAll({
      where,
      include: [{
        model: User,
        attributes: ['email'],
        as: 'user'
      }, {
        model: KamiType,
        attributes: ['name'],
        as: 'kamitype'
      }],
      order: [['generated_at', 'DESC']],
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string)
    });
    
    const kamis = rows.map((row: any) => {
      const kami = row.toJSON();
      return {
        id: kami.id,
        code: kami.code,
        type_id: kami.type_id,
        type_name: (kami.kamitype as any)?.name || '未知类型',
        user_id: kami.user_id,
        user_email: (kami.user as any)?.email || '未知用户',
        status: kami.status,
        generated_at: kami.generated_at,
        used_at: kami.used_at,
        expired_at: kami.expired_at
      };
    });
    
    res.json({ kamis, total: count });
  } catch (error) {
    console.error('获取卡密列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除卡密
router.delete('/kamis/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Kami.destroy({ where: { id: Number(id) } });
    res.json({ message: '卡密删除成功' });
  } catch (error) {
    console.error('删除卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;