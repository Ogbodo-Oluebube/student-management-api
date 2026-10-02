import { Router } from 'express';
import {
  getStudents,
  getStudentByIdController ,
  createStudentController,
  updateStudentController,
  deleteStudentController,
} from '../controllers/student.controller.js';
import validateStudent from '../middleware/validateStudent.js';

const router = Router();

router.get('/', getStudents);
router.get('/:id', getStudentByIdController );
router.post('/',validateStudent, createStudentController);
router.patch('/:id', validateStudent, updateStudentController);
router.delete('/:id', deleteStudentController);

export default router;
