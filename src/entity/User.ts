import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Role } from "./Role";
import { Recipie } from "./Recipie";
import { Vote } from "./Vote";

@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique:true})
    username: string;

    @Field()
    @Column({unique:true})
    email: string;
 
    @Column()
    password: string;
    
    @Field()
    @Column({default:0})
    tokenVersion:number

    @Field(()=>String)
    @CreateDateColumn()
    createdAt:Date;

    @Field(()=>String)
    @UpdateDateColumn()
    updatedAt:Date

    @Field()
    @ManyToOne(()=>Role)
    role:Role

    @Field(()=>[Recipie])
    @OneToMany(()=>Recipie , recipie=>recipie.user)
    recipies:Recipie[];

    @Field(()=>[Vote])
    @OneToMany(()=>Vote,vote=>vote.user)
    votes:Vote[]


  
}
