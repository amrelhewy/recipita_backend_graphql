import { Resolver, Query, Mutation, Arg, InputType, Field, ObjectType, Ctx, UseMiddleware, Int } from "type-graphql";
import { User } from "../entity/User";
import { registerSchema } from "../utils/registerSchemaValidation";
import argon2 from 'argon2'
import { getConnection } from "typeorm";
import { MyContext } from "src/MyContext";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { createRefreshToken, createAccessToken } from "../utils/auth";
import { isAuth } from "../utils/isAuth";
import { Role } from "../entity/Role";

@ObjectType()
class tokenReturn{
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[]
    @Field({nullable:true})
    accessToken?:string
}

@ObjectType()
class FieldError{
   @Field()
   message:string
   @Field()
   field:string
}

@InputType()
class userInfo{
@Field({nullable:true})
username?:string
@Field({nullable:true})
email?:string
@Field()
password:string
@Field(()=>Int,{nullable:true})
role_id?:number

}

@ObjectType()
class returnType{
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[]
    @Field(()=>User,{nullable:true})
    user?:User
}

@Resolver(User)
export class UserResolver{

// @FieldResolver(()=>Role)
// async Role(@Root() user:User){

// return await Role.findOne(user.roleId);

// }

@UseMiddleware(isAuth)
@Query(()=>User, {nullable:true})
async me(
    @Ctx(){payload}:MyContext
):Promise<User | null >{
const user = await User.findOne(payload.userId,{relations:["role"]})
if(!user) return null
return user;
}
@Query(()=>[User])
async users():Promise<User[]>{
    return await User.find({relations:["role"]});
    
}

@Mutation(()=>returnType)
async register(
@Arg('userInfo') {email,password,username,role_id}:userInfo

):Promise<returnType>
{
    const user = await User.findOne({email})
    if(user) return {
        errors:[{message:"This email already exists.",field:"email"}]
    }
    const response = registerSchema.validate({email,password,username,role_id})
    let errorArray:FieldError[]=[];
     if(response.error){
         errorArray.push({message:response.error.details[0].message,field: response.error.details[0].message.split(' ')[0]}) 
         return{
            errors:errorArray
        }
     }
     const hashedPw = await argon2.hash(password);
    //  const newUser = await getConnection().query(`
    //  INSERT INTO "user"("username", "email", "password", "tokenVersion", "createdAt", "updatedAt", "roleId") VALUES ($1, $2, $3, DEFAULT, DEFAULT, DEFAULT, $4) RETURNING *
    //  `,[username,email,hashedPw,role_id])
    const userRole =await Role.findOne(role_id);
    if(!userRole){
        return {errors:[{message:'enter a proper role man',field:'role'}]}
    }
    const newUser = new User();
    newUser.role=userRole;
    newUser.username=username!;
    newUser.password=hashedPw!;
    newUser.email=email!;
    await getConnection().manager.save(newUser);
     return{
         user:newUser
     }    
    }

@Mutation(()=>tokenReturn)
async login(
    @Arg('userInfo') {email,password}:userInfo,
    @Ctx(){res}:MyContext

):Promise<tokenReturn>{
    
    const user = await User.findOne({email});
    if(!user || !password){
       
       return {
           errors:[{message:"invalid login.",field:'email'}]
       }
    }
    const validatePassword = await argon2.verify(user.password,password);
    if(!validatePassword){
        return {
            errors:[{message:"invalid login.",field:"password"}]
        }
    }
    // user is logged in. 
    //we give him a jwt token access token and a refresh token. 
    sendRefreshToken(res,createRefreshToken(user));
    
    return {
    accessToken:createAccessToken(user)
    }

}


@Mutation(()=>Boolean)
logout(
    @Ctx() {res}:MyContext
):Boolean
 {
     res.clearCookie('jid',{path:'/refresh-token'});
     return true;
 }
    




}