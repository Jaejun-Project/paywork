import { Request, Response} from 'express';
import { EntityManager, getConnection, getManager, getRepository, TransactionManager} from 'typeorm';
import { User } from '../entity/User';
import {Post} from '../entity/Post';
import { validate} from "class-validator";



class UserController {

    // get current user ID 
    index(req: Request,res: Response){
        return res.send({
            userId: req.userId
        });
    }

    // show all users
    users = async(req: Request, res: Response) => {
        const repository = getRepository(User);
        const users = await repository.find({
            select:["id","username","role"],
            relations:["posts"]
        });
        res.send(users);
    }

    //show current User 

    getOneById = async (req: Request, res: Response) => {
        const id: string = req.params.id;
      
        //Get the user from database
        const userRepository = getRepository(User);
        try {
          const user = await userRepository.findOneOrFail(id, {
            select: ["id", "username", "role"] 
          });
          res.status(200).send(user);
        } catch (error) {
          res.status(404).send("User not found");
        }
     
      };

    //Delete current User
    deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.userId;
      
        const userRepository = getRepository(User);
        const postRepository = getRepository(Post);
        let user: User;
        try {
          user = await userRepository.findOneOrFail(id, {
              relations:["posts"]
          });
        //   console.log(user)
          
          //After all send a 204 (no content, but accepted) response
       
        } catch (error) {
          res.status(404).send("User not found");
          return;
        }

        //delete user with using transaction 
        const queryRunner = await getConnection().createQueryRunner()
            await queryRunner.startTransaction()

            try {
                await getManager().delete(Post, {userId: id});
                await getManager().delete(User, id)
                await queryRunner.commitTransaction();
                res.status(201).send("Deleted User")
            } catch(err) {
                await queryRunner.rollbackTransaction();
                res.status(400).send(err)
            } finally {
                await queryRunner.release();
            }
      };

    // Create user 
    signUp = async(req: Request, res: Response)  => { 
        const repository = getRepository(User);

        let {username, password, role} = req.body;
        // console.log(username, password);
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        const errors = await validate(user);
        if(errors.length>0){
            res.status(400).send(errors);
            return;
        }

        try{
            await repository.save(user);
        } catch(err){
            res.status(409).send(err.message)
            return;
        }
        return res.status(201).send(user)
    }
}

export default new UserController();