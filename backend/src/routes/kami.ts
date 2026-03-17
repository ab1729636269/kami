import express from 'express';
import { Kami, KamiType } from '../models';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// 生成卡密
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { type_id, count = 1 } = req.body;
    const user_id = (req as any).user.id;

    // 检查卡密类型是否存在
    const type = await KamiType.findByPk(type_id);

    if (!type) {
      return res.status(404).json({ message: '卡密类型不存在' });
    }

    const kamis = [];

    // 生成指定数量的卡密
    for (let i = 0; i < count; i++) {
      // 生成随机卡密
      const randomPartLength = type.length - type.prefix.length - type.suffix.length;
      const randomPart = Math.random().toString(36).substring(2, 2 + randomPartLength).toUpperCase();
      const code = `${type.prefix}${randomPart}${type.suffix}`;

      // 计算过期时间
      const expired_at = new Date();
      expired_at.setDate(expired_at.getDate() + type.validity_days);

      // 插入卡密
      const kami = await Kami.create({
        code,
        type_id,
        user_id,
        expired_at
      });

      kamis.push({
        id: kami.id,
        code: kami.code,
        type_id: kami.type_id,
        status: kami.status,
        expired_at: kami.expired_at
      });
    }

    res.status(201).json({ kamis });
  } catch (error) {
    console.error('生成卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取卡密列表
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type_id } = req.query;
    const user_id = (req as any).user.id;

    const where: any = {
      user_id
    };

    if (status) {
      where.status = status;
    }

    if (type_id) {
      where.type_id = type_id;
    }

    console.log('查询卡密列表:', where);

    const { count, rows } = await Kami.findAndCountAll({
      where,
      order: [['generated_at', 'DESC']],
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string)
    });

    console.log('卡密列表查询结果:', { count, rows: rows.length });

    // 单独查询每个卡密的类型名称
    const kamis = [];
    for (const row of rows) {
      const kami = row.toJSON();
      try {
        const kamiType = await KamiType.findByPk(kami.type_id);
        kamis.push({
          id: kami.id,
          code: kami.code,
          type_id: kami.type_id,
          type_name: kamiType ? kamiType.name : '未知类型',
          status: kami.status,
          generated_at: kami.generated_at,
          used_at: kami.used_at,
          expired_at: kami.expired_at
        });
      } catch (typeError) {
        console.error('获取卡密类型失败:', typeError);
        kamis.push({
          id: kami.id,
          code: kami.code,
          type_id: kami.type_id,
          type_name: '未知类型',
          status: kami.status,
          generated_at: kami.generated_at,
          used_at: kami.used_at,
          expired_at: kami.expired_at
        });
      }
    }

    res.json({ kamis, total: count, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error('获取卡密列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新卡密状态
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = (req as any).user.id;

    // 检查卡密是否属于当前用户
    const kami = await Kami.findOne({ where: { id, user_id } });
    if (!kami) {
      return res.status(404).json({ message: '卡密不存在' });
    }

    await Kami.update(
      {
        status,
        used_at: status === 'used' ? new Date() : null
      },
      {
        where: { id, user_id }
      }
    );

    res.json({ message: '卡密状态更新成功' });
  } catch (error) {
    console.error('更新卡密状态失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取卡密类型列表
router.get('/types', async (req, res) => {
  try {
    const types = await KamiType.findAll();
    res.json(types);
  } catch (error) {
    console.error('获取卡密类型列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 验证卡密
router.post('/verify', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: '卡密不能为空' });
    }

    const kami = await Kami.findOne({
      where: { code },
      include: [{
        model: KamiType,
        attributes: ['name'],
        as: 'kamitype'
      }]
    });

    if (!kami) {
      return res.json({ valid: false, message: '卡密不存在' });
    }

    if (kami.status !== 'unused') {
      return res.json({ valid: false, message: '卡密已使用或已过期' });
    }

    if (kami.expired_at && new Date(kami.expired_at) < new Date()) {
      // 更新过期状态
      await kami.update({ status: 'expired' });
      return res.json({ valid: false, message: '卡密已过期' });
    }

    res.json({
      valid: true,
      kami: {
        id: kami.id,
        code: kami.code,
        type_id: kami.type_id,
        type_name: kami.kamitype?.name || '未知类型',
        status: kami.status,
        expired_at: kami.expired_at
      }
    });
  } catch (error) {
    console.error('验证卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 使用卡密
router.post('/use', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: '卡密不能为空' });
    }

    const kami = await Kami.findOne({
      where: { code }
    });

    if (!kami) {
      return res.status(404).json({ success: false, message: '卡密不存在' });
    }

    if (kami.status !== 'unused') {
      return res.status(400).json({ success: false, message: '卡密已使用或已过期' });
    }

    if (kami.expired_at && new Date(kami.expired_at) < new Date()) {
      // 更新过期状态
      await kami.update({ status: 'expired' });
      return res.status(400).json({ success: false, message: '卡密已过期' });
    }

    // 更新卡密状态为已使用
    await kami.update({
      status: 'used',
      used_at: new Date()
    });

    res.json({
      success: true,
      message: '卡密使用成功',
      kami: {
        id: kami.id,
        code: kami.code,
        status: 'used',
        used_at: new Date()
      }
    });
  } catch (error) {
    console.error('使用卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 查询卡密状态
router.get('/status/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const kami = await Kami.findOne({
      where: { code },
      include: [{
        model: KamiType,
        attributes: ['name'],
        as: 'kamitype'
      }]
    });

    if (!kami) {
      return res.status(404).json({ message: '卡密不存在' });
    }

    // 检查是否过期
    if (kami.status === 'unused' && kami.expired_at && new Date(kami.expired_at) < new Date()) {
      // 更新过期状态
      await kami.update({ status: 'expired' });
      return res.json({
        status: 'expired',
        expired_at: kami.expired_at,
        type_name: kami.kamitype?.name || '未知类型'
      });
    }

    res.json({
      status: kami.status,
      expired_at: kami.expired_at,
      type_name: kami.kamitype?.name || '未知类型'
    });
  } catch (error) {
    console.error('查询卡密状态失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;