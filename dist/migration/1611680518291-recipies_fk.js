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
exports.recipiesFk1611680518291 = void 0;
class recipiesFk1611680518291 {
    constructor() {
        this.name = 'recipiesFk1611680518291';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "recipie" ADD "userId" integer`);
            yield queryRunner.query(`ALTER TABLE "recipie" ADD CONSTRAINT "FK_d2f5bdd50f768a48ae26dffa693" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "recipie" DROP CONSTRAINT "FK_d2f5bdd50f768a48ae26dffa693"`);
            yield queryRunner.query(`ALTER TABLE "recipie" DROP COLUMN "userId"`);
        });
    }
}
exports.recipiesFk1611680518291 = recipiesFk1611680518291;
//# sourceMappingURL=1611680518291-recipies_fk.js.map