import {MigrationInterface, QueryRunner} from "typeorm";

export class update1611930500520 implements MigrationInterface {
    name = 'update1611930500520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vote" ("value" integer NOT NULL, "userId" integer NOT NULL, "recipieId" integer NOT NULL, CONSTRAINT "PK_7570e230e6aefb4eea1a095a467" PRIMARY KEY ("userId", "recipieId"))`);
        await queryRunner.query(`ALTER TABLE "recipie" ADD "points" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_ecc98fb6b51261bcac14f4baca7" FOREIGN KEY ("recipieId") REFERENCES "recipie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_ecc98fb6b51261bcac14f4baca7"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`);
        await queryRunner.query(`ALTER TABLE "recipie" DROP COLUMN "points"`);
        await queryRunner.query(`DROP TABLE "vote"`);
    }

}
