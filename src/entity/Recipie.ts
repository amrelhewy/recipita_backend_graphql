import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";
import { Vote } from "./Vote";

@ObjectType()
@Entity()
export class Recipie extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name:string;

    @Field()
    @Column()
    description:string;

    @Field(()=>String)
    @CreateDateColumn()
    createdAt:Date;

    @Field(()=>String)
    @UpdateDateColumn()
    updatedAt:Date

    @Field(()=>User)
    @ManyToOne(()=>User , user=>user.recipies)
    user:User

    @OneToMany(()=>Vote,vote=>vote.recipie)
    votes:Vote[]

    @Field()
    @Column({type:'int',default:0})
    points!:number

}
