import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class Role extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique:true})
    role: string;

    @Field(()=>String)
    @CreateDateColumn()
    createdAt:Date;

    @Field(()=>String)
    @UpdateDateColumn()
    updatedAt:Date

  
}
