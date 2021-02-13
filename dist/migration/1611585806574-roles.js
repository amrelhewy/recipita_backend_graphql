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
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles1611585806574 = void 0;
class roles1611585806574 {
    constructor() {
        this.name = 'roles1611585806574';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_367aad98203bd8afaed0d704093" UNIQUE ("role"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "user" ADD "tokenVersion" integer NOT NULL DEFAULT '0'`);
            yield queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
            yield queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
            yield queryRunner.query(`ALTER TABLE "user" ADD "roleId" integer`);
            yield queryRunner.query(`COMMENT ON COLUMN "user"."username" IS NULL`);
            yield queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
            yield queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
            yield queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
            yield queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
            yield queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
            yield queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
            yield queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
            yield queryRunner.query(`COMMENT ON COLUMN "user"."username" IS NULL`);
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenVersion"`);
            yield queryRunner.query(`DROP TABLE "role"`);
        });
    }
}
exports.roles1611585806574 = roles1611585806574;
//# sourceMappingURL=1611585806574-roles.js.map