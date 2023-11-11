import {LoginUser} from '../../../../../src/app/features/users/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import { createUsers } from '../../../../helpers/create-users.builder';

describe('Testes para usecase de logar usuario', () =>{
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

	afterEach(async () =>{
		await new UserRepository().clear();
	});


	test('Deve retornar um objeto de erro quando usuario não existir', async () => {
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
		const user = await createUsers();
		const sut = createSut();

		const result = await sut.execute(user.json);

		expect(result).toEqual({
			success:true,
			message: 'Cadastro encontrado! Bem-vindo(a)',
			data:  {
				id: user.class.toJSON().id,
				email: user.class.toJSON().email 
			},
		},
		);
	});
});