import pool from '../config/database.js';

export const getAllStudents = async () => {
  const result = await pool.query(
    `SELECT
            student_id,
            reg_no,
            student_name,
            email,
            phone,
            department_id,
            date_of_birth,
            status
         FROM students
         ORDER BY student_id`,
  );

  return result.rows;
};

// Get a single student by ID
export const getStudentById = async (id) => {
  const result = await pool.query(
    `
        SELECT 
         student_id,
            reg_no,
            student_name,
            email,
            phone,
            department_id,
            date_of_birth,
            status
            FROM students 
            WHERE student_id = $1`,
    [id],
  );
  return result.rows[0];
};

// Create a new student
export const createStudent = async (studentData) => {
  const {
    reg_no,
    student_name,
    email,
    phone,
    department_id,
    date_of_birth,
    status,
  } = studentData;
  
  const result = await pool.query(
    `INSERT INTO students
        (reg_no, student_name, email, phone, department_id, date_of_birth, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
    [reg_no, student_name, email, phone, department_id, date_of_birth, status],
  );

  return result.rows[0];
};

// Update a student by ID
export const updateStudent = async (id, studentData) => {
    const {
        reg_no,
        student_name,
        email,
        phone,
        department_id,
        date_of_birth,
        status
    } = studentData;

    const result = await pool.query(
        `UPDATE students
         SET
            reg_no = COALESCE($1, reg_no),
            student_name = COALESCE($2, student_name),
            email = COALESCE($3, email),
            phone = COALESCE($4, phone),
            department_id = COALESCE($5, department_id),
            date_of_birth = COALESCE($6, date_of_birth),
            status = COALESCE($7, status)
         WHERE student_id = $8
         RETURNING *`,
        [
            reg_no,
            student_name,
            email,
            phone,
            department_id,
            date_of_birth,
            status,
            id
        ]
    );

    return result.rows[0];
};

// Delete a student by ID
export const deleteStudent = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM students
        WHERE student_id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
};