import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1694845270350 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isNullable: false,
						isPrimary: true,
						default: 'uuid_generate_v4()',
					},
					{
						name: 'email',
						type: 'varchar',
						length: '255',
						isNullable: false,
						isUnique: true,
					},
					{
						name: 'password',
						type: 'varchar',
						length: '255',
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						isNullable: false,
						default: 'now()',
					},
				],
		
			})
			, true
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users', true, true, true);
	}

}
