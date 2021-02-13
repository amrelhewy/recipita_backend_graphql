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
exports.update1611930500520 = void 0;
class update1611930500520 {
    constructor() {
        this.name = 'update1611930500520';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "vote" ("value" integer NOT NULL, "userId" integer NOT NULL, "recipieId" integer NOT NULL, CONSTRAINT "PK_7570e230e6aefb4eea1a095a467" PRIMARY KEY ("userId", "recipieId"))`);
            yield queryRunner.query(`ALTER TABLE "recipie" ADD "points" integer NOT NULL DEFAULT '0'`);
            yield queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_ecc98fb6b51261bcac14f4baca7" FOREIGN KEY ("recipieId") REFERENCES "recipie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_ecc98fb6b51261bcac14f4baca7"`);
            yield queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`);
            yield queryRunner.query(`ALTER TABLE "recipie" DROP COLUMN "points"`);
            yield queryRunner.query(`DROP TABLE "vote"`);
        });
    }
}
exports.update1611930500520 = update1611930500520;
//# sourceMappingURL=1611930500520-update.js.map