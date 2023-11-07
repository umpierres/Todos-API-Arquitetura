import { randomUUID } from 'crypto';
import { User } from '../../../../../src/app/classes';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import {LoginUser} from '../../../../../src/app/features/users/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';

describe('Testes para usecase de logar usuario', () =>{
	jest.mock('../../../../../src/app/features/users/repositories');

	function createSut() {
		return new LoginUser();
	}

	beforeAll(async () => {
		await DatabaseConnection.connect();
		await RedisConnection.connect();
	});

	afterAll(async () => {
		await DatabaseConnection.destroy();
		await RedisConnection.destroy();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('Deve retornar um objeto de erro quando usuario não existir', async () => {
		jest.spyOn(UserRepository.prototype, 'loginUser').mockResolvedValue(undefined);
		const sut = createSut();

		const result = await sut.execute({
			email: 'any_email',
			password: 'any_password'
		});

		expect(result).toEqual({
			success: false,
			message: 'Senha e/ou email incorretos!',
		});
	});

	test('Deve logar um usuario que existe na base de dados', async () => {
		const fakeUser = new User( randomUUID(), 'any_email','any_password');
		jest.spyOn(UserRepository.prototype, 'loginUser').mockResolvedValue(fakeUser);

		const sut = createSut();

		const result = await sut.execute({
			email: 'any_email',
			password: 'any_password'
		});

		expect(result).toEqual({
			success:true,
			message: 'Cadastro encontrado! Bem-vindo(a)',
			data: {
				id: fakeUser.toJSON().id, 
				email: fakeUser.toJSON().email
			},
		});
	});
});