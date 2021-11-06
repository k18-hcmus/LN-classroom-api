import { Router } from 'express';
import { createClassroom, getAllClassroom } from '@controllers/classroom.controller';


// User-route
const router = Router();

router.get('/', getAllClassroom);
router.post('/', createClassroom);

export default router;