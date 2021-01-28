import {
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    AfterInsert,
    TransactionManager,
    EntityManager,
  } from "typeorm";
import { Length} from "class-validator";
import { User } from "./User";


@Entity()
export class Post { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1,20)
    title: string;

    @Column()
    content: string; 

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({nullable:true})
    userId: string;

    @ManyToOne(()=> User, user => user.posts)
    user: User;


    async deletePostsByUserId(@TransactionManager() transactionManager: EntityManager, userId: string) {
      return await transactionManager.delete(Post, { user: userId })
    }
    
 }

//  export default User;


 