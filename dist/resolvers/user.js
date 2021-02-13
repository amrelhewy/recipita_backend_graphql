"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entity/User");
const registerSchemaValidation_1 = require("../utils/registerSchemaValidation");
const argon2_1 = __importDefault(require("argon2"));
const typeorm_1 = require("typeorm");
const sendRefreshToken_1 = require("../utils/sendRefreshToken");
const auth_1 = require("../utils/auth");
const isAuth_1 = require("../utils/isAuth");
const Role_1 = require("../entity/Role");
let tokenReturn = class tokenReturn {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], tokenReturn.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], tokenReturn.prototype, "accessToken", void 0);
tokenReturn = __decorate([
    type_graphql_1.ObjectType()
], tokenReturn);
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let userInfo = class userInfo {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], userInfo.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], userInfo.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], userInfo.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], userInfo.prototype, "role_id", void 0);
userInfo = __decorate([
    type_graphql_1.InputType()
], userInfo);
let returnType = class returnType {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], returnType.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], returnType.prototype, "user", void 0);
returnType = __decorate([
    type_graphql_1.ObjectType()
], returnType);
let UserResolver = class UserResolver {
    me({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(payload.userId, { relations: ["role"] });
            if (!user)
                return null;
            return user;
        });
    }
    users() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.find({ relations: ["role"] });
        });
    }
    register({ email, password, username, role_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            if (user)
                return {
                    errors: [{ message: "This email already exists.", field: "email" }]
                };
            const response = registerSchemaValidation_1.registerSchema.validate({ email, password, username, role_id });
            let errorArray = [];
            if (response.error) {
                errorArray.push({ message: response.error.details[0].message, field: response.error.details[0].message.split(' ')[0] });
                return {
                    errors: errorArray
                };
            }
            const hashedPw = yield argon2_1.default.hash(password);
            const userRole = yield Role_1.Role.findOne(role_id);
            if (!userRole) {
                return { errors: [{ message: 'enter a proper role man', field: 'role' }] };
            }
            const newUser = new User_1.User();
            newUser.role = userRole;
            newUser.username = username;
            newUser.password = hashedPw;
            newUser.email = email;
            yield typeorm_1.getConnection().manager.save(newUser);
            return {
                user: newUser
            };
        });
    }
    login({ email, password }, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            if (!user || !password) {
                return {
                    errors: [{ message: "invalid login.", field: 'email' }]
                };
            }
            const validatePassword = yield argon2_1.default.verify(user.password, password);
            if (!validatePassword) {
                return {
                    errors: [{ message: "invalid login.", field: "password" }]
                };
            }
            sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
            return {
                accessToken: auth_1.createAccessToken(user)
            };
        });
    }
    logout({ res }) {
        res.clearCookie('jid', { path: '/refresh-token' });
        return true;
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Mutation(() => returnType),
    __param(0, type_graphql_1.Arg('userInfo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userInfo]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => tokenReturn),
    __param(0, type_graphql_1.Arg('userInfo')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userInfo, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Boolean)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map