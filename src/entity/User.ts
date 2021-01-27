import {
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
  } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from '../config/config';
import {Post} from "./Post";


@Entity()
export class User { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique:true
    })
    @Length(4,20)
    username: string;

    @Column()
    @Length(4,10)
    password: string; 

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(()=> Post,
      post => post.user, { eager: true, cascade: true, onDelete: "CASCADE" })
    posts: Array<Post>;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      const salt= await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(this.password, salt);
      this.password = hashed;
    }

    generateAuthToken() {
      return jwt.sign({ id: this.id, username: this.username},
         config.jwtSecret,
         {expiresIn: "1h"});
   }
 }

//  export default User;


 