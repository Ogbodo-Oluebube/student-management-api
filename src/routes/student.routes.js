import { Router } from 'express';
import {
  getStudents,
  getStudentByIdController ,
  createStudentController,
  updateStudentController,
  deleteStudentController,
} from '../controllers/student.controller.js';

const router = Router();

router.get('/', getStudents);
router.get('/:id', getStudentByIdController );
router.post('/', createStudentController);
router.patch('/:id', updateStudentController);
router.delete('/:id', deleteStudentController);

export default router;
