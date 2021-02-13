import { Resolver, Query, Arg, Int, ObjectType, Field, UseMiddleware, Mutation, Ctx, InputType } from "type-graphql";
import { Recipie } from "../entity/Recipie";
import { getConnection } from "typeorm";
import { isAuth } from "../utils/isAuth";
import { MyContext } from "../MyContext";
import { Vote } from "../entity/Vote";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { Request } from 'express'




@InputType()
class createRecipie{

    @Field()
    name:string
    @Field()
    description:string


}
@ObjectType()
class returnValueAndRecipie{
    @Field()
    edit:Boolean
    @Field(()=>Int)
    recipieId:number
    @Field(()=>Int)
    value:number
}

@ObjectType()
class countRecipie{
    @Field()
    count:string
}

@ObjectType()
class recipieOwner{
    @Field()
    username:string
}

@ObjectType()
class recipieIndividual{
    @Field(()=>Int)
    id:number
    @Field()
    name:string
    @Field()
    description:string
    @Field(()=>recipieOwner)
    user:recipieOwner
    @Field()
    points:number
    @Field(()=>Int,{nullable:true})
    voteStatus?:number
}


@ObjectType()
class paginatedRecipies{
    @Field(()=>[recipieIndividual])
    _recipies:recipieIndividual[]
    @Field()
    hasMore:boolean
    
}


@Resolver(Recipie)
export class RecipieResolver{


@Query(()=>paginatedRecipies)
async recipies(
    @Arg('offset',()=>Int) offset:number,
    @Ctx(){req}:MyContext
):Promise<paginatedRecipies>{
   
    let userId = checkTokenForVote(req);
    const recipieCountLimitPlusOne=11;
    const recipies:recipieIndividual[] = await getConnection().query(`
    SELECT r.id as id , name ,points, SUBSTRING(description , 0 , 40) as description ,json_build_object('username',username) as user
    ${userId ? `,(SELECT value FROM vote WHERE "userId"=${userId} and "recipieId" = r.id) as "voteStatus"` : ''}
    FROM recipie r
    LEFT JOIN public.user u ON r."userId" = u.id
    ORDER BY r."createdAt" DESC
    OFFSET($1)
    LIMIT($2)
    `,[offset,recipieCountLimitPlusOne])
    return{
        _recipies:recipies.slice(0,10),
        hasMore:recipieCountLimitPlusOne === recipies.length
    }
  
    

    
}

@UseMiddleware(isAuth)
@Mutation(()=>returnValueAndRecipie)
async vote(
    @Arg('value',()=>Int!) value:number,
    @Arg('recipieId',()=>Int) recipieId:number,
    @Ctx() {payload}:MyContext
):Promise<returnValueAndRecipie>{
   
    const recipie = await Recipie.findOne(recipieId);
   const hasVoted = await Vote.findOne({where:{userId:payload.userId,recipieId:recipie.id}});
    if(hasVoted && hasVoted.value !== value){
       let newPoints= recipie!.points;
       if(value === 1){
        newPoints+=2
       }
       else if(value === -1){
        newPoints-=2

       }

    //  await getConnection().query(`
    //    BEGIN;
    //    UPDATE vote
    //    SET value = ${value}
    //    WHERE "userId"=${payload.userId};

    //    UPDATE recipie 
    //    SET points = ${newPoints}
    //    WHERE id=${recipie!.id};
    //    COMMIT;
    //    `)
       await getConnection().transaction(async tm=>{
          await tm.update(Vote,{userId:payload.userId,recipieId:recipie?.id},{value});
          await tm.update(Recipie,{id:recipie?.id},{points:newPoints})
       })
       return {
           edit:true,
           recipieId:recipie!.id,
           value:value
       }
    }
    else if(hasVoted === undefined){
    //    await getConnection().query(`
    //     BEGIN;
    //     INSERT INTO vote("value", "userId", "recipieId" ) VALUES (${value}, ${payload.userId}, ${recipie.id});
    //     UPDATE "recipie" 
    //     SET points = points + ${value}
    //     WHERE id=${recipie!.id};
    //     COMMIT;
    //     `)
        await getConnection().transaction(async tm=>{
            await tm.insert(Vote,{value, userId:payload.userId,recipieId:recipie?.id})
            await tm.update(Recipie,{id:recipie?.id},{points:()=>`points + ${value}`})
         })
         return {
            edit:false,
            recipieId:recipie!.id,
            value:value
        }
    }

    throw new Error('already voted man');





}

@Query(()=>recipieIndividual)
async recipie(@Arg('id',()=>Int) id:number){

    const recipie = await Recipie.findOne(id,{relations:["user"]});
    if(!recipie) throw new Error('no recipie found');
    return recipie;

}

@Mutation(()=>Boolean)
@UseMiddleware(isAuth)
async create(
@Arg('recipieInfo',()=>createRecipie) {description,name}:createRecipie,
@Ctx(){payload}:MyContext
):Promise<Boolean>{

    const user  = await User.findOne(payload.userId)
    const recipie = new Recipie();
    recipie.name=name;
    recipie.description=description;
    recipie.user=user!;

    await recipie.save();
    return true;
}

@Query(()=>paginatedRecipies)
async ChefRecipies(
    @Arg('name') name:string,
    @Arg('offset',()=>Int!) offset:number,
    @Ctx(){req}:MyContext
):Promise<paginatedRecipies>{
 
    let userId = checkTokenForVote(req);

    const recipies = await getConnection().query(`
    SELECT r.name , SUBSTRING(description , 0 , 40) as description , r.id , r.points 
    ${userId ? `,(SELECT value FROM vote WHERE "userId"=${userId} and "recipieId" = r.id) as "voteStatus"` : ''}
    FROM recipie r 
    INNER JOIN public.user u ON r."userId" = u.id
    WHERE u.username = $1
    ORDER BY r."createdAt" DESC
    OFFSET($2)
    LIMIT(11);
    `,[name,offset])

    return {
        _recipies:recipies,
        hasMore: recipies.length === 11
    }


}


@Query(()=>countRecipie)
async countRecipies(
    @Arg('name') name:string
)
:Promise<number>
{
    const count = await getConnection().query(`
    SELECT COUNT(*) 
    FROM recipie 
    WHERE "userId" = (SELECT id FROM public.user WHERE username=$1)
    `,[name])

    return count[0];
}



}
function checkTokenForVote(req:Request){
    let userId;
    if(req.headers["authorization"]){

        const token = req.headers["authorization"].split(' ')[1];
        try{
            const payload:any=verify(token,process.env.ACCESS_TOKEN_SECRET);
            userId=payload.userId;
            return userId;
        
        }
        catch{
            
          return null;
            
        }

    }
}