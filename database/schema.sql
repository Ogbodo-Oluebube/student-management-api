-- =========================================
-- STUDENT MANAGEMENT DATABASE
-- =========================================

-- =========================================
-- 1. DEPARTMENTS
-- =========================================

CREATE TABLE departments (
    department_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================
-- 2. STUDENTS
-- =========================================

CREATE TABLE students (
    student_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    matric_number VARCHAR(30) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department_id INTEGER NOT NULL,

    CONSTRAINT fk_student_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);


-- =========================================
-- 3. COURSES
-- =========================================

CREATE TABLE courses (
    course_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    course_unit INTEGER NOT NULL,
    department_id INTEGER NOT NULL,

    CONSTRAINT fk_course_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);


-- =========================================
-- 4. ENROLLMENTS
-- =========================================

CREATE TABLE enrollments (
    enrollment_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,

    CONSTRAINT fk_enrollment_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    CONSTRAINT fk_enrollment_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id),

    CONSTRAINT unique_student_course
        UNIQUE (student_id, course_id)
);


-- =========================================
-- INSERT DEPARTMENTS
-- =========================================

INSERT INTO departments (department_name)
VALUES
    ('Computer Science'),
    ('Mathematics'),
    ('Physics'),
    ('Statistics');


-- =========================================
-- INSERT STUDENTS
-- =========================================

INSERT INTO students
(full_name, email, matric_number, phone, department_id)
VALUES
('Bube', 'bube@example.com', 'UNN/CS/001', '08012345678', 1),
('Adaeze', 'adaeze@example.com', 'UNN/CS/002', '08023456789', 1),
('Chuka', 'chuka@example.com', 'UNN/MTH/001', '08034567890', 2),
('Faith', 'faith@example.com', 'UNN/PHY/001', '08045678901', 3);


-- =========================================
-- INSERT COURSES
-- =========================================

INSERT INTO courses
(course_code, course_name, course_unit, department_id)
VALUES
('CSC201', 'Introduction to Programming', 3, 1),
('CSC202', 'Database Systems', 3, 1),
('MTH201', 'Calculus I', 3, 2),
('PHY201', 'General Physics', 3, 3);


-- =========================================
-- INSERT ENROLLMENTS
-- =========================================

INSERT INTO enrollments (student_id, course_id)
VALUES
(1, 1),
(1, 2),
(2, 1);


-- =========================================
-- TEST QUERIES
-- =========================================

-- View all departments
SELECT * FROM departments;


-- View all students
SELECT * FROM students;


-- View all courses
SELECT * FROM courses;


-- View all enrollments
SELECT * FROM enrollments;


-- Students and their departments
SELECT
    s.full_name,
    d.department_name
FROM students s
JOIN departments d
    ON s.department_id = d.department_id;


-- Students and their courses
SELECT
    s.full_name,
    c.course_code,
    c.course_name
FROM enrollments e
JOIN students s
    ON e.student_id = s.student_id
JOIN courses c
    ON e.course_id = c.course_id;


-- Students, departments and courses
SELECT
    s.full_name,
    d.department_name,
    c.course_code,
    c.course_name
FROM enrollments e
JOIN students s
    ON e.student_id = s.student_id
JOIN departments d
    ON s.department_id = d.department_id
JOIN courses c
    ON e.course_id = c.course_id;