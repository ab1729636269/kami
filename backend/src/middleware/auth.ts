import express from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: '未授权' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as any;

    // 将用户信息添加到请求对象中
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      is_admin: decoded.is_admin
    };

    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: '未授权' });
  }
};

export default authMiddleware;