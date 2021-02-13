import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";
import { Recipie } from "./Recipie";

@ObjectType()
@Entity()
export class Vote extends BaseEntity{

    @Field()
    @Column()
    value: number;
    
    @Field()
    @PrimaryColumn()
    userId!: number;

    @Field()
    @PrimaryColumn()
    recipieId!: number;

    @Field(()=>User)
    @ManyToOne(()=>User,user=>user.votes)
    user:User

    @Field(()=>Recipie)
    @ManyToOne(()=>Recipie,recipie=>recipie.votes)
    recipie:Recipie;

   
   
  
}
