import {MigrationInterface, QueryRunner} from "typeorm";

export class addRoles1611585887820 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        INSERT INTO role(role) VALUES ('chef');
        INSERT INTO role(role) VALUES ('user');


   
        `)
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
