"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
require("dotenv-safe/config");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const typeorm_1 = require("typeorm");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("./entity/User");
const sendRefreshToken_1 = require("./utils/sendRefreshToken");
const auth_1 = require("./utils/auth");
const cors_1 = __importDefault(require("cors"));
const recipies_1 = require("./resolvers/recipies");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.use(cors_1.default({
        credentials: true,
        origin: ['http://localhost:3001']
    }));
    const connectionDB = yield typeorm_1.createConnection();
    yield connectionDB.runMigrations();
    app.use(cookie_parser_1.default());
    app.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies.jid;
        if (!refreshToken) {
            return res.send({ ok: false, accessToken: "" });
        }
        let payload = null;
        try {
            payload = jsonwebtoken_1.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        catch (err) {
            return res.send({ ok: false, accessToken: "" });
        }
        const user = yield User_1.User.findOne({ id: payload.userId });
        if (!user) {
            return res.send({ ok: false, accessToken: "" });
        }
        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: "" });
        }
        sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
        return res.send({ ok: true, accessToken: auth_1.createAccessToken(user) });
    }));
    const Apollo = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [user_1.UserResolver, recipies_1.RecipieResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res })
    });
    Apollo.applyMiddleware({ app, cors: false });
    app.listen(parseInt(process.env.PORT), () => console.log('server started ...'));
}))();
//# sourceMappingURL=index.js.map