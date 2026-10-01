import app from './app.js';
import pool from './config/database.js';
import 'dotenv/config';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const result = await pool.query('SELECT NOW()');

        console.log('Database connected:', result.rows[0]);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();