import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/student.service.js';

// Get all students
export const getStudents = async (req, res, next) => {
  try {
    const { status, department_id, search, page, limit } = req.query;

    const result = await getAllStudents(
      status,
      department_id,
      search,
      page,
      limit,
    );

    const { students, total, currentPage, pageLimit } = result;
    const totalPages = Math.ceil(total / pageLimit);

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      count: students.length,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages,
      },
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single student by ID
export const getStudentByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new student
export const createStudentController = async (req, res, next) => {
  try {
    const newStudent = await createStudent(req.body);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

// Update a student by ID
export const updateStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await updateStudent(id, req.body);

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a student by ID
export const deleteStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedStudent = await deleteStudent(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: deletedStudent,
    });
  } catch (error) {
    next(error);
  }
};