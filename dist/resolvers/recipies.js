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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipieResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Recipie_1 = require("../entity/Recipie");
const typeorm_1 = require("typeorm");
const isAuth_1 = require("../utils/isAuth");
const Vote_1 = require("../entity/Vote");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("../entity/User");
let createRecipie = class createRecipie {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], createRecipie.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], createRecipie.prototype, "description", void 0);
createRecipie = __decorate([
    type_graphql_1.InputType()
], createRecipie);
let returnValueAndRecipie = class returnValueAndRecipie {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], returnValueAndRecipie.prototype, "edit", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], returnValueAndRecipie.prototype, "recipieId", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], returnValueAndRecipie.prototype, "value", void 0);
returnValueAndRecipie = __decorate([
    type_graphql_1.ObjectType()
], returnValueAndRecipie);
let countRecipie = class countRecipie {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], countRecipie.prototype, "count", void 0);
countRecipie = __decorate([
    type_graphql_1.ObjectType()
], countRecipie);
let recipieOwner = class recipieOwner {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], recipieOwner.prototype, "username", void 0);
recipieOwner = __decorate([
    type_graphql_1.ObjectType()
], recipieOwner);
let recipieIndividual = class recipieIndividual {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], recipieIndividual.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], recipieIndividual.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], recipieIndividual.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => recipieOwner),
    __metadata("design:type", recipieOwner)
], recipieIndividual.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], recipieIndividual.prototype, "points", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], recipieIndividual.prototype, "voteStatus", void 0);
recipieIndividual = __decorate([
    type_graphql_1.ObjectType()
], recipieIndividual);
let paginatedRecipies = class paginatedRecipies {
};
__decorate([
    type_graphql_1.Field(() => [recipieIndividual]),
    __metadata("design:type", Array)
], paginatedRecipies.prototype, "_recipies", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], paginatedRecipies.prototype, "hasMore", void 0);
paginatedRecipies = __decorate([
    type_graphql_1.ObjectType()
], paginatedRecipies);
let RecipieResolver = class RecipieResolver {
    recipies(offset, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = checkTokenForVote(req);
            const recipieCountLimitPlusOne = 11;
            const recipies = yield typeorm_1.getConnection().query(`
    SELECT r.id as id , name ,points, SUBSTRING(description , 0 , 40) as description ,json_build_object('username',username) as user
    ${userId ? `,(SELECT value FROM vote WHERE "userId"=${userId} and "recipieId" = r.id) as "voteStatus"` : ''}
    FROM recipie r
    LEFT JOIN public.user u ON r."userId" = u.id
    ORDER BY r."createdAt" DESC
    OFFSET($1)
    LIMIT($2)
    `, [offset, recipieCountLimitPlusOne]);
            return {
                _recipies: recipies.slice(0, 10),
                hasMore: recipieCountLimitPlusOne === recipies.length
            };
        });
    }
    vote(value, recipieId, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipie = yield Recipie_1.Recipie.findOne(recipieId);
            const hasVoted = yield Vote_1.Vote.findOne({ where: { userId: payload.userId, recipieId: recipie.id } });
            if (hasVoted && hasVoted.value !== value) {
                let newPoints = recipie.points;
                if (value === 1) {
                    newPoints += 2;
                }
                else if (value === -1) {
                    newPoints -= 2;
                }
                yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.update(Vote_1.Vote, { userId: payload.userId, recipieId: recipie === null || recipie === void 0 ? void 0 : recipie.id }, { value });
                    yield tm.update(Recipie_1.Recipie, { id: recipie === null || recipie === void 0 ? void 0 : recipie.id }, { points: newPoints });
                }));
                return {
                    edit: true,
                    recipieId: recipie.id,
                    value: value
                };
            }
            else if (hasVoted === undefined) {
                yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.insert(Vote_1.Vote, { value, userId: payload.userId, recipieId: recipie === null || recipie === void 0 ? void 0 : recipie.id });
                    yield tm.update(Recipie_1.Recipie, { id: recipie === null || recipie === void 0 ? void 0 : recipie.id }, { points: () => `points + ${value}` });
                }));
                return {
                    edit: false,
                    recipieId: recipie.id,
                    value: value
                };
            }
            throw new Error('already voted man');
        });
    }
    recipie(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipie = yield Recipie_1.Recipie.findOne(id, { relations: ["user"] });
            if (!recipie)
                throw new Error('no recipie found');
            return recipie;
        });
    }
    create({ description, name }, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(payload.userId);
            const recipie = new Recipie_1.Recipie();
            recipie.name = name;
            recipie.description = description;
            recipie.user = user;
            yield recipie.save();
            return true;
        });
    }
    ChefRecipies(name, offset, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = checkTokenForVote(req);
            const recipies = yield typeorm_1.getConnection().query(`
    SELECT r.name , SUBSTRING(description , 0 , 40) as description , r.id , r.points 
    ${userId ? `,(SELECT value FROM vote WHERE "userId"=${userId} and "recipieId" = r.id) as "voteStatus"` : ''}
    FROM recipie r 
    INNER JOIN public.user u ON r."userId" = u.id
    WHERE u.username = $1
    ORDER BY r."createdAt" DESC
    OFFSET($2)
    LIMIT(11);
    `, [name, offset]);
            return {
                _recipies: recipies,
                hasMore: recipies.length === 11
            };
        });
    }
    countRecipies(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield typeorm_1.getConnection().query(`
    SELECT COUNT(*) 
    FROM recipie 
    WHERE "userId" = (SELECT id FROM public.user WHERE username=$1)
    `, [name]);
            return count[0];
        });
    }
};
__decorate([
    type_graphql_1.Query(() => paginatedRecipies),
    __param(0, type_graphql_1.Arg('offset', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RecipieResolver.prototype, "recipies", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => returnValueAndRecipie),
    __param(0, type_graphql_1.Arg('value', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('recipieId', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], RecipieResolver.prototype, "vote", null);
__decorate([
    type_graphql_1.Query(() => recipieIndividual),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecipieResolver.prototype, "recipie", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('recipieInfo', () => createRecipie)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createRecipie, Object]),
    __metadata("design:returntype", Promise)
], RecipieResolver.prototype, "create", null);
__decorate([
    type_graphql_1.Query(() => paginatedRecipies),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Arg('offset', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], RecipieResolver.prototype, "ChefRecipies", null);
__decorate([
    type_graphql_1.Query(() => countRecipie),
    __param(0, type_graphql_1.Arg('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipieResolver.prototype, "countRecipies", null);
RecipieResolver = __decorate([
    type_graphql_1.Resolver(Recipie_1.Recipie)
], RecipieResolver);
exports.RecipieResolver = RecipieResolver;
function checkTokenForVote(req) {
    let userId;
    if (req.headers["authorization"]) {
        const token = req.headers["authorization"].split(' ')[1];
        try {
            const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
            userId = payload.userId;
            return userId;
        }
        catch (_a) {
            return null;
        }
    }
}
//# sourceMappingURL=recipies.js.map