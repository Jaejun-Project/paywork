import { Router } from "express";
import PostController from '../controllers/PostController';
import UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/authMiddleware"

const router = Router() ;

router.post("/new", authMiddleware, PostController.createPost);
router.get("/", PostController.posts);
router.delete("/:id",authMiddleware, PostController.deletePost);
router.post("/search", PostController.searchByWord);
router.get("/:id", PostController.searchById)
router.put("/:id", authMiddleware, PostController.editPost)
export default router;