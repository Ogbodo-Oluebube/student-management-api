import express from 'express';
import studentRoutes from './routes/student.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(express.json());

app.use('/api/students', studentRoutes);

app.use(errorMiddleware);

export default app;

