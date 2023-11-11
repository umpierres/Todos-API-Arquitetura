import { randomUUID } from 'crypto';
import { CreateNote } from '../../../../../src/app/features/notes/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import { createUsers } from '../../../../helpers';
import { NoteRepository } from '../../../../../src/app/features/notes/repositories';

describe('Testes para o usecase de cadastrar uma nota', () => {
	function createSut() {
		return new CreateNote();
	}


	beforeAll(async () => {
		await DatabaseConnection.connect();
		await RedisConnection.connect();
	});

	afterAll(async () => {
		await DatabaseConnection.destroy();
		await RedisConnection.destroy();
	});

	afterEach((async () => {
		await new NoteRepository().clear();
	}));

	afterEach((async () => {
		await new UserRepository().clear();
	}));

	test('deve retornar um objeto de erro quando o usuario não existir', async () => {
		const sut = createSut();
		const result = await sut.execute({
			title:'any_title',
			description:'any_description',
			favorited: false,
			archived: false,
			ownerID: randomUUID(),
		});

		expect(result).toEqual({
			success: false,
			message: 'Usuário não encontrado.',
		});
	});

	test('deve retornar um objeto de sucesso com os dados da nota cadastrada com valores corretos', async () => {
		const user = await createUsers();

		const sut = createSut();
		const result = await sut.execute({
			title:'any_title',
			description:'any_description',
			favorited: false,
			archived: false,
			ownerID: user.class.toJSON().id,
		});

		expect(result.success).toBe(true);
		expect(result.message).toBe('Nota cadastrado com sucesso.');
		expect(result.data?.note).not.toBeUndefined();
		expect(result.data?.notes).toHaveLength(1);
	});
});