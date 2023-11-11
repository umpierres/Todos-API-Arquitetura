import { UserRepository } from '../../../../../src/app/features/users/repositories';
import {CreateUser} from '../../../../../src/app/features/users/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { createUsers } from '../../../../helpers/create-users.builder';

describe('Testes para usecase de cadastrar usuario', () =>{
	function createSut() {
		return new CreateUser();
	}

	beforeAll(async () => {
		await DatabaseConnection.connect();
		await RedisConnection.connect();
	});

	afterAll(async () => {
		await DatabaseConnection.destroy();
		await RedisConnection.destroy();
	});
	
	afterEach(async () =>{
		await new UserRepository().clear();
	});

	test('Deve retornar um objeto de erro quando usuario já existir', async () => {
		const user = await createUsers();
		const sut = createSut();

		const result = await sut.execute({
			email: user.json.email,
			password: 'any_password'
		});

		expect(result.success).toBe(false);
		expect(result.message).toBe('Usuário já existe.');
		expect(result.data).toBeUndefined();
	});

	test('Deve retornar um objeto com um usuario com email valido', async () => {
		const sut = createSut();

		const result = await sut.execute({
			email: 'any_email',
			password: 'any_password'
		});

		expect(result.success).toBe(true);
		expect(result.message).toBe('Usuário cadastrado com sucesso.');
		expect(result.data).not.toBeUndefined();
	});
});