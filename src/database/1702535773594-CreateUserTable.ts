import { MigrationInterface, QueryRunner,Table } from "typeorm"

export class  CreateUserTable1702535773594 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(
           new Table({
             name: 'user',
             columns: [
               {
                 name: 'id',
                 type: 'int',
                 isGenerated: true,
                 generationStrategy: 'increment',
                 isUnique: true,
               },
               {
                 name: 'name',
                 type: 'varchar',
                 isNullable: false,
               },
               {
                 name: 'phone',
                 type: 'varchar',
                 isNullable: false,
               },
               {
                 name: 'user_type',
                 type: 'enum',
                 enum: ['user', 'super_admin'],
                 enumName: 'UserTypeEnum',
               },
               {
                 name: 'email',
                 type: 'varchar',
                 isNullable: true,
               },
               {
                 name: 'password',
                 type: 'varchar',
                 isNullable: true,
               },
               {
                 name: 'otpSecret',
                 type: 'varchar',
                 isNullable: true,
               },
               {
                 name: 'created_at',
                 type: 'timestamp',
                 default: 'CURRENT_TIMESTAMP',
                 isNullable: false,
               },
               {
                 name: 'updated_at',
                 type: 'timestamp',
                 default: 'CURRENT_TIMESTAMP',
                 onUpdate: 'CURRENT_TIMESTAMP',
                 isNullable: false,
               },
             ],
           }),
         );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropTable('user');
    }

}
