"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    username: joi_1.default.string()
        .alphanum()
        .min(3)
        .message("username too short.")
        .max(30),
    password: joi_1.default.string()
        .min(3).message('password too short.'),
    email: joi_1.default.string().
        email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).message('email is weird'),
    role_id: joi_1.default.number().min(1).message('add a role.')
});
//# sourceMappingURL=registerSchemaValidation.js.map