import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export default function authMiddleware(
    req: Request, res: Response, next: NextFunction
){
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).send("Unauthorized Please Login");
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, config.jwtSecret);
        const { id } = data as TokenPayload;
        req.userId = id 
        // res.send(data)
        // console.log(next());
        return next();
    }catch{
        res.status(400).send('Invalid token.');
    }
}