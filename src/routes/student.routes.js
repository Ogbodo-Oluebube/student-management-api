import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent
} from '../controllers/student.controller.js';

const router = Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.patch('/:id', updateStudent);

export default router;
