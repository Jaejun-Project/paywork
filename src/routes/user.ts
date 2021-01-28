import { Router } from "express";
import UserController from '../controllers/UserController';
import authMiddleware from "../middlewares/authMiddleware"

const router = Router() ;

router.get('/',UserController.users);
router.post('/new', UserController.signUp);
router.get('/users', authMiddleware, UserController.index);
router.get('/:id', UserController.getOneById);
router.delete('/', authMiddleware, UserController.deleteUser);
;
export default router;