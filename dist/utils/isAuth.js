"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = ({ context }, next) => {
    const auth = context.req.headers['authorization'];
    if (!auth)
        throw new Error('not authorized');
    const token = auth.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload;
        return next();
    }
    catch (_a) {
        throw new Error('not authenticated');
    }
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map