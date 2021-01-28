import { Request, Response} from 'express';
import { getRepository, getManager, Like, Equal, TransactionManager, EntityManager} from 'typeorm';
import { User } from '../entity/User';
import { Post } from '../entity/Post';
import { validate} from "class-validator";
import UserController from "./UserController";


class PostController {

    // List of posts 
    posts = async(req:Request, res:Response)=> {
        const repository = getRepository(Post);
        try {
            const posts = await repository.createQueryBuilder("post")
            .leftJoin('post.user', 'user')
            .addSelect(['user.id', 'user.username'])
            .getMany()
            res.send(posts);
        }catch(error){
            res.send(error);
        }
    }

    // Create Post 
    createPost = async(req:Request, res:Response) =>{
        
        // const repository = getRepository(Post);
        const currId = req.userId;
        // console.log(currId);
        const userRepository = getRepository(User);
        let {title, content} = req.body;
        
        
        // console.log("curruser", currUser);
        let post = new Post();

        post.title = title;
        post.content = content;

        const errors =  await validate(post);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        try{
            let currUser = await userRepository.findOneOrFail(currId, {
                relations: ["posts"]
            });
            post.userId = currUser.id;            
            await getManager().save(post);
            currUser.posts.push(post);
            let newUser = await getManager().save(currUser);
            res.send(newUser);
            return;
        } catch(err){
            res.status(409).send(err)
            return;
        }
    }

    //Delete Post 

    deletePost = async( req:Request , res: Response) => {
        const currId = req.userId;
        const repository = getRepository(Post);
        let paramId = req.params.id
        const currPost = await repository.findOne(paramId)
        console.log(currPost)
        try{ 
            if(!currPost)
            {
                return res.status(404).send('Post was not found');
            }
            if(currPost.userId !== currId){
                console.log("curr", "id", currPost.userId, currId);
                return res.status(404).send("This post does not belongs to this user")
            }

            let results = await repository.delete(paramId)
            console.log("result", results)
            res.status(204).send("successfully deleted")
        }catch(error){
            res.send(error);
        }   
    }    

    //Edit Post
    editPost = async (req:Request, res:Response)=> {

        let currId = req.userId;
        let paramId = req.params.id;

        const { title, content } = req.body;
        //Try to find user on database
        const repository = getRepository(Post);
        let post;
        try {
            post = await repository.findOneOrFail(paramId);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("post not found");
          return;
        }

        post.title = title;
        post.content = content;
        const errors= await validate(post);
        if (errors.length > 0){
            res.status(400).send(errors)
            return;
        }

        try{
            if (post.userId !== currId)
            {
                throw Error;
            } 
            else {
                const result = await repository.save(post);
            }
            res.sendStatus(204);
            
        }catch(error){
            res.status(404).send("not authorized user")
            return;
        }
        
    }


    //Search by words
    searchByWord = async (req:Request, res:Response) => {

        let {word} = req.body;
        const repository = getRepository(Post);

        try{
            const posts = await repository.find({
                title: Like(`%${word}%`)
            });

            if(posts.length <=0){
                res.status(404).send(`No posts about "${word}"`);
            }
            else 
            {
                res.status(200).send(posts)
            }
        }catch(error) {
            res.send(error);
        }
    }

      // List of posts by certain writer

      searchById = async(req:Request, res:Response) => {
        const respository = getRepository(Post);
        let userId = req.params.id;
        
        try{
            const posts = await respository.find({
                userId: Equal(userId)
            })
            res.status(200).send(posts)
        } catch(erros){ 
            res.status(400).send("no posts with such id")
        }
    }

    async deletePostsByUserId(@TransactionManager() transactionManager: EntityManager, userId: string) {
        return await transactionManager.delete(Post, { user: userId })
    }
}

export default new PostController();