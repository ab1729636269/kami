import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import kamiRouter from './routes/kami';
import statisticsRouter from './routes/statistics';
import adminRouter from './routes/admin';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.get('/', (req, res) => {
  res.json({ message: '卡密系统后端API' });
});

app.use('/api/auth', authRouter);
app.use('/api/kami', kamiRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/admin', adminRouter);

export default app;