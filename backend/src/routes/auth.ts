import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Log } from '../models';

const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: '邮箱已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress || '';
    const user_agent = req.headers['user-agent'] || '';

    // 查找用户
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // 记录登录失败
      await Log.create({
        user_id: null,
        action: 'login_failed',
        description: `邮箱: ${email}，IP: ${ip_address}，设备: ${user_agent}`,
        ip_address
      });
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // 记录登录失败
      await Log.create({
        user_id: user.id,
        action: 'login_failed',
        description: `邮箱: ${email}，IP: ${ip_address}，设备: ${user_agent}`,
        ip_address
      });
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 记录登录成功
    await Log.create({
      user_id: user.id,
      action: 'login',
      description: `IP: ${ip_address}，设备: ${user_agent}`,
      ip_address
    });

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        is_admin: user.is_admin 
      } 
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: '未授权' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as any;

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'name', 'is_admin']
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 修改密码
router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: '未授权' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as any;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 验证当前密码
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: '当前密码错误' });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await user.update({ password: hashedPassword });

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;