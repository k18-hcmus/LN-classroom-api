import { Router } from 'express';
import classroomRouter from "@routes/classroom.route"


// Export the base-router
const router = Router();
router.use('/classrooms', classroomRouter);


export default router;
