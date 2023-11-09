import { randomUUID } from 'crypto';
import { CreateNote } from '../../../../../src/app/features/notes/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import { Note, User } from '../../../../../src/app/classes';
import { NoteRepository } from '../../../../../src/app/features/notes/repositories';

describe('Testes para o usecase de cadastrar uma nota', () => {
	jest.mock('../../../../../src/app/features/notes/repositories');
	jest.mock('../../../../../src/app/features/users/repositories');
	jest.mock('../../../../../src/app/shared/database/repositories');

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

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('deve retornar um objeto de erro quando o usuario não existir', async () => {
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(undefined);

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
		const fakeUser = new User( randomUUID(), 'any_email','any_password');
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(fakeUser);

		const fakeNote = new Note(randomUUID(), 'any_title', 'any_description', false, false, fakeUser);
		jest.spyOn(NoteRepository.prototype, 'createNote').mockResolvedValue(fakeNote);
		jest.spyOn(NoteRepository.prototype, 'listNotes').mockResolvedValue([fakeNote]);

		const sut = createSut();
		const result = await sut.execute({
			title:'any_title',
			description:'any_description',
			favorited: false,
			archived: false,
			ownerID: fakeUser.toJSON().id,
		});

		expect(result).toEqual({
			success:true,
			message: 'Nota cadastrado com sucesso.',
			data: {
				note: fakeNote,
				notes: [fakeNote],
			},
		});
	});
});