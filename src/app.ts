import  express,{Application, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
// import './database/connect'
import "reflect-metadata";
import routes from "./routes/index";
import { createConnection } from 'typeorm';
import cors from "cors";
dotenv.config();

createConnection().then(async connection => {
    const app: Application = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    
    app.use('/', routes);
    app.listen(parseInt(process.env.APP_PORT!), () => {
        console.log('Server started on port '+ process.env.APP_PORT)
    });
    
}).catch(error => console.log(error));




