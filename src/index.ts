import "reflect-metadata";
import express from 'express'
import "dotenv-safe/config"
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { UserResolver } from "./resolvers/user"
import { createConnection, getConnection } from "typeorm"
import { MyContext } from "./MyContext"
import parser from 'cookie-parser'
import {verify} from 'jsonwebtoken'
import { User } from "./entity/User"
import { sendRefreshToken } from "./utils/sendRefreshToken"
import { createRefreshToken, createAccessToken } from "./utils/auth"
import cors from 'cors'
import { RecipieResolver } from "./resolvers/recipies";

(async()=>{
const app = express();
app.use(cors({
  credentials:true,
  origin:['http://localhost:3001']
}))
const connectionDB= await createConnection();
 await connectionDB.runMigrations();
//  await getConnection().query(`
//  BEGIN;
//  TRUNCATE vote;
//  UPDATE recipie SET points=0;
//  COMMIT;
//  `)
app.use(parser())
app.post('/refresh-token',async (req,res)=>{
    const refreshToken = req.cookies.jid
    if(!refreshToken){
        return res.send({ok:false,accessToken:""})

    }
    let payload:any = null;
    try{
        payload = verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!)

    }catch(err){
        return res.send({ok:false,accessToken:""})

    }
      //token is valid and we can send back and access token.
      const user = await User.findOne({id:payload.userId})
      if(!user){
        return res.send({ok:false,accessToken:""})
      }

      if(user.tokenVersion !== payload.tokenVersion){
        return res.send({ok:false,accessToken:""})
      }
      //check version of refresh token.---
      //invalidate old refresh token
      // await User.update({id:user.id},{tokenVersion:user.tokenVersion+1});
      sendRefreshToken(res,createRefreshToken(user))
      return res.send({ok:true,accessToken:createAccessToken(user)})



});

const Apollo =  new ApolloServer({
schema: await buildSchema({
    resolvers:[UserResolver,RecipieResolver],
    validate:false

})
,
context:({req,res}):MyContext=>({req,res}) // all resolvers see this object.

})
Apollo.applyMiddleware({app,cors:false})

app.listen(parseInt(process.env.PORT),()=>console.log('server started ...'));


})()
