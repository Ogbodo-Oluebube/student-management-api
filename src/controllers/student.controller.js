import pool from '../config/database.js';

// Get all students
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

// Get a single student by ID
export const getStudentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM students WHERE student_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};