import { randomUUID } from 'crypto';
import { ListNotes } from '../../../../../src/app/features/notes/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import { Note, User } from '../../../../../src/app/classes';
import { NoteRepository } from '../../../../../src/app/features/notes/repositories';

describe('Testes para o usecase de listar todas notas', () => {
	jest.mock('../../../../../src/app/features/notes/repositories');
	jest.mock('../../../../../src/app/features/users/repositories');
	jest.mock('../../../../../src/app/shared/database/repositories');

	function createSut() {
		return new ListNotes();
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

	test('deve retornar um objeto de erro quando o usuario não existir', async () => {
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(undefined);

		const sut = createSut();
		const result = await sut.execute(
			randomUUID()
		);

		expect(result).toEqual({
			success: false,
			message: 'Usuário não encontrado.',
		});
	});

	test('deve retornar um objeto de sucesso com os dados das notas listadas corretamente', async () => {
		const fakeUser = new User( randomUUID(), 'any_email','any_password');
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(fakeUser);

		const fakeNote1 = new Note(randomUUID(), 'any_title_1', 'any_description_1', false, false, fakeUser);
		const fakeNote2 = new Note(randomUUID(), 'any_title_2', 'any_description_2', false, false, fakeUser);
		const fakeNote3 = new Note(randomUUID(), 'any_title_3', 'any_description_3', false, false, fakeUser);

		jest.spyOn(NoteRepository.prototype, 'listNotes').mockResolvedValue([fakeNote1, fakeNote2, fakeNote3]);

		const sut = createSut();
		const result = await sut.execute(fakeUser.toJSON().id);

		expect(result).toEqual({
			success: true,
			message: 'Notas listadas com sucesso.',
			data: {
				notes: [fakeNote1, fakeNote2, fakeNote3],
			},
		});
	});

});