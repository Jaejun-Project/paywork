import { Request, Response} from 'express';
import { getRepository} from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {

    login = async(req: Request, res: Response)  => { 
        const repository = getRepository(User);

        const {username, password} = req.body;

        const user = await repository.findOne({where: {username}});
        console.log("user in auth", user);
        if(!user){
            return res.sendStatus(401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).send('Invalid username or password');


        const token = user.generateAuthToken();

        return res.json({
            message: "logged in",
            token
        });
    }
}

export default new AuthController();