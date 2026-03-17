import express from 'express';
import { Kami, User, KamiType, sequelize } from '../models';

const router = express.Router();

// 卡密统计
router.get('/kami', async (req, res) => {
  try {
    // 总生成量
    const total = await Kami.count();

    // 未使用
    const unused = await Kami.count({ where: { status: 'unused' } });

    // 已使用
    const used = await Kami.count({ where: { status: 'used' } });

    // 已过期
    const expired = await Kami.count({ where: { status: 'expired' } });

    // 按类型统计
    const byType = await Kami.findAll({
      attributes: [
        'type_id',
        [sequelize.fn('COUNT', sequelize.col('Kami.id')), 'count']
      ],
      include: [{
        model: KamiType,
        attributes: ['name', 'description'],
        as: 'kamitype'
      }],
      group: ['type_id', 'kamitype.id']
    });

    const byTypeFormatted = byType.map((item: any) => {
      const kami = item.toJSON();
      return {
        type_name: (kami.kamitype as any)?.name || '未知类型',
        description: (kami.kamitype as any)?.description || '无',
        count: parseInt((kami as any).count)
      };
    });

    res.json({
      total,
      unused,
      used,
      expired,
      byType: byTypeFormatted
    });
  } catch (error) {
    console.error('卡密统计失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 卡密生成趋势
router.get('/kami/trend', async (req, res) => {
  try {
    const { period = 'day' } = req.query;
    let format = '%Y-%m-%d';

    if (period === 'week') {
      format = '%Y-%u'; // ISO week number
    } else if (period === 'month') {
      format = '%Y-%m';
    }

    const result = await Kami.findAll({
      attributes: [
        [sequelize.fn('strftime', format, sequelize.col('generated_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['date'],
      order: [['date', 'DESC']],
      limit: period === 'day' ? 7 : period === 'week' ? 4 : 12
    });

    const formattedResult = result.map((item: any) => {
      const data = item.toJSON();
      return {
        date: (data as any).date,
        count: parseInt((data as any).count)
      };
    });

    res.json(formattedResult);
  } catch (error) {
    console.error('卡密生成趋势统计失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 用户统计
router.get('/users', async (req, res) => {
  try {
    // 总用户数
    const total = await User.count();

    // 管理员数量
    const admin = await User.count({ where: { is_admin: true } });

    // 普通用户数量
    const user = await User.count({ where: { is_admin: false } });

    res.json({
      total,
      admin,
      user
    });
  } catch (error) {
    console.error('用户统计失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 用户活跃度统计
router.get('/users/activity', async (req, res) => {
  try {
    const result = await User.findAll({
      attributes: [
        [sequelize.fn('strftime', '%Y-%m-%d', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['date'],
      order: [['date', 'DESC']],
      limit: 7
    });

    const formattedResult = result.map((item: any) => {
      const data = item.toJSON();
      return {
        date: (data as any).date,
        count: parseInt((data as any).count)
      };
    });

    res.json(formattedResult);
  } catch (error) {
    console.error('用户活跃度统计失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;