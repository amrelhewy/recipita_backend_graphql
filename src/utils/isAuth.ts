import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "src/MyContext";
import { verify } from "jsonwebtoken";

export const isAuth:Middleware<MyContext>=({context},next)=>{
const auth = context.req.headers['authorization'];
if(!auth) throw new Error('not authorized');
const token = auth.split(' ')[1];
try{
    const payload:any=verify(token,process.env.ACCESS_TOKEN_SECRET);
    context.payload = payload
    return next();
}
catch{
    
    throw new Error('not authenticated')
    
}

}