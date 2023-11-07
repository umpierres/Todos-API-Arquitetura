import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableNote1694845276066 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'tasks',
				columns:[
					{
						name: 'id',
						type: 'uuid',
						isNullable: false,
						isPrimary: true,
						default: 'uuid_generate_v4()',
					},
					{
						name: 'title',
						type: 'varchar',
						isNullable: false,
						length: '255'
					},
					{
						name: 'description',
						type: 'text',
						isNullable: false,
					},
					{
						name: 'id_user',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						isNullable: false,
						default: 'now()',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						isNullable: false,
					},
					{
						name: 'favorited',
						type: 'boolean',
						isNullable: false,
						default: 'false',
					},
					{
						name: 'archived',
						type: 'boolean',
						isNullable: false,
						default: 'false',
					},
				],
				foreignKeys: [
					{
						columnNames: ['id_user'],
						referencedTableName: 'users',
						referencedColumnNames: ['id'],
					},
				],
			}), true, 
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('tasks', true, true, true);
	}

}
