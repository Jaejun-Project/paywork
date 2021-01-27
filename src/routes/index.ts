
import { Router, Request, Response} from "express";
// import router from "./auth";
import auth from "./auth";
import user from "./user";
import post from "./post";

// routes.unsubscribe()

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/post', post);
export default routes; 