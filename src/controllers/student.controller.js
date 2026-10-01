import pool from '../config/database.js';

// Get all students
export const getStudents = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM students ORDER BY student_id'
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
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
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// Create a new student
export const createStudent = async (req, res, next) => {
    try {
        const {
            reg_no,
            student_name,
            email,
            phone,
            department_id,
            date_of_birth,
            status
        } = req.body;

        const result = await pool.query(
            `INSERT INTO students
            (reg_no, student_name, email, phone, department_id, date_of_birth, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                reg_no,
                student_name,
                email,
                phone,
                department_id,
                date_of_birth,
                status
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};