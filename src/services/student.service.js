import pool from '../config/database.js';

export const getAllStudents = async (
  status,
  department_id,
  search,
  page,
  limit,
) => {
  let query = `
    SELECT
        students.student_id,
        students.reg_no,
        students.student_name,
        students.email,
        students.phone,
        students.department_id,
        departments.department_name,
        students.date_of_birth,
        students.status
    FROM students
    JOIN departments
        ON students.department_id = departments.department_id
`;

  const conditions = [];
  const values = [];

  if (status) {
    conditions.push(`students.status ILIKE $${values.length + 1}`);
    values.push(status);
  }

  if (department_id) {
    conditions.push(`students.department_id = $${values.length + 1}`);
    values.push(Number(department_id));
  }

  if (search) {
    conditions.push(`
    (
        students.student_name ILIKE $${values.length + 1}
        OR students.email ILIKE $${values.length + 1}
        OR students.reg_no ILIKE $${values.length + 1}
    )
`);

    values.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  const currentPage = Math.max(Number(page) || 1, 1);

  const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const offset = (currentPage - 1) * pageLimit;

  // Count total students matching the filters
  let countQuery = `
    SELECT COUNT(*) AS total
    FROM students
    JOIN departments
        ON students.department_id = departments.department_id
`;

  if (conditions.length > 0) {
    countQuery += ` WHERE ${conditions.join(' AND ')}`;
  }

  const countResult = await pool.query(countQuery, values);

  const total = Number(countResult.rows[0].total);

  // Get students for the current page
  query += ' ORDER BY students.student_id';

  query += ` LIMIT $${values.length + 1}`;
  values.push(pageLimit);

  query += ` OFFSET $${values.length + 1}`;
  values.push(offset);

  const result = await pool.query(query, values);

  return {
    students: result.rows,
    total,
    currentPage,
    pageLimit,
  };
};

// Get a single student by ID
export const getStudentById = async (id) => {
  const result = await pool.query(
    `SELECT
            students.student_id,
            students.reg_no,
            students.student_name,
            students.email,
            students.phone,
            students.department_id,
            departments.department_name,
            students.date_of_birth,
            students.status
         FROM students
         JOIN departments
            ON students.department_id = departments.department_id
         WHERE students.student_id = $1`,
    [id],
  );

  return result.rows[0];
};

// Create a new student
export const createStudent = async (studentData) => {
  const { reg_no, student_name, email, phone, department_id, date_of_birth } =
    studentData;

  const status = studentData.status ?? 'Active';

  const result = await pool.query(
    `INSERT INTO students
      (reg_no, student_name, email, phone, department_id, date_of_birth, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING student_id`,
    [
      reg_no,
      student_name,
      email,
      phone ?? null,
      department_id,
      date_of_birth ?? null,
      status,
    ],
  );

  const studentId = result.rows[0].student_id;

  const studentResult = await pool.query(
    `SELECT
        students.student_id,
        students.reg_no,
        students.student_name,
        students.email,
        students.phone,
        students.department_id,
        departments.department_name,
        students.date_of_birth,
        students.status
     FROM students
     JOIN departments
        ON students.department_id = departments.department_id
     WHERE students.student_id = $1`,
    [studentId],
  );

  return studentResult.rows[0];
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
    status,
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
     RETURNING student_id`,
    [
      reg_no,
      student_name,
      email,
      phone,
      department_id,
      date_of_birth,
      status,
      id,
    ],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const studentId = result.rows[0].student_id;

  const studentResult = await pool.query(
    `SELECT
        students.student_id,
        students.reg_no,
        students.student_name,
        students.email,
        students.phone,
        students.department_id,
        departments.department_name,
        students.date_of_birth,
        students.status
     FROM students
     JOIN departments
        ON students.department_id = departments.department_id
     WHERE students.student_id = $1`,
    [studentId],
  );

  return studentResult.rows[0];
};

// Delete a student by ID
export const deleteStudent = async (id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get the student before deleting it
    const studentResult = await client.query(
      `SELECT
          students.student_id,
          students.reg_no,
          students.student_name,
          students.email,
          students.phone,
          students.department_id,
          departments.department_name,
          students.date_of_birth,
          students.status
       FROM students
       JOIN departments
          ON students.department_id = departments.department_id
       WHERE students.student_id = $1`,
      [id],
    );

    // Student doesn't exist
    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const deletedStudent = studentResult.rows[0];

    // Delete the student
    await client.query(
      `DELETE FROM students
       WHERE student_id = $1`,
      [id],
    );

    // Permanently apply the transaction
    await client.query('COMMIT');

    return deletedStudent;
  } catch (error) {
    // Undo any changes if something goes wrong
    await client.query('ROLLBACK');

    throw error;
  } finally {
    // Return the connection to the pool
    client.release();
  }
};
