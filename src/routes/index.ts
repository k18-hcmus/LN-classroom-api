import { Router } from 'express';
import classroomRouter from "@routes/classroom.route"
import userRouter from "@routes/user.route"
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "@middlewares/swagger-docs.mdw";

// Export the base-router
const router = Router();
router.use('/classrooms', classroomRouter);
router.use('/users', userRouter)
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default router;
