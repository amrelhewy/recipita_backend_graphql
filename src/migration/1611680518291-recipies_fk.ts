import {MigrationInterface, QueryRunner} from "typeorm";

export class recipiesFk1611680518291 implements MigrationInterface {
    name = 'recipiesFk1611680518291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipie" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "recipie" ADD CONSTRAINT "FK_d2f5bdd50f768a48ae26dffa693" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipie" DROP CONSTRAINT "FK_d2f5bdd50f768a48ae26dffa693"`);
        await queryRunner.query(`ALTER TABLE "recipie" DROP COLUMN "userId"`);
    }

}
