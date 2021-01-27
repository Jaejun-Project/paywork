import {
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    AfterInsert,
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
    @JoinColumn({name: 'user_id'})
    user: User;
    
 }

//  export default User;


 