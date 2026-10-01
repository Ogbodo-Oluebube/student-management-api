import pool from '../config/database.js';

export const getStudents = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM students'
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};