import { randomUUID } from 'crypto';
import { DeleteNote } from '../../../../../src/app/features/notes/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import { Note, User } from '../../../../../src/app/classes';
import { NoteRepository } from '../../../../../src/app/features/notes/repositories';

describe('Testes para o usecase de deletar uma nota', () => {
	jest.mock('../../../../../src/app/features/notes/repositories');
	jest.mock('../../../../../src/app/features/users/repositories');
	jest.mock('../../../../../src/app/shared/database/repositories');

	function createSut() {
		return new DeleteNote();
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
			noteID: randomUUID(),
			ownerID: randomUUID(),
		});

		expect(result).toEqual({
			success: false,
			message: 'Usuário não encontrado. Não foi possivel atualizar a nota.',
		});
	});

	test('deve retornar um objeto de erro quando a nota não existir', async () => {
		const fakeUser = new User( randomUUID(), 'any_email','any_password');
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(fakeUser);
		jest.spyOn(NoteRepository.prototype, 'findNoteByID').mockResolvedValue(undefined);

		const sut = createSut();
		const result = await sut.execute({
			noteID: randomUUID(),
			ownerID: fakeUser.toJSON().id,
		});

		expect(result).toEqual({
			success: false,
			message: 'Nota não encontrado.',
		});
	});

	test('deve retornar um objeto de sucesso com os dados da nota excluida', async () => {
		const fakeUser = new User( randomUUID(), 'any_email','any_password');
		const fakeNote = new Note(randomUUID(), 'any_title', 'any_description', false, false, fakeUser);
        
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(fakeUser);
		jest.spyOn(NoteRepository.prototype, 'findNoteByID').mockResolvedValue(fakeNote);
		jest.spyOn(NoteRepository.prototype, 'deleteNote').mockResolvedValue();

		const sut = createSut();
		const result = await sut.execute({
			noteID: fakeNote.toJSON().id,
			ownerID: fakeNote.toJSON().owner.id
		});

		expect(result).toEqual({
			success: true,
			message: 'Nota deletada com sucesso.',
			data: {
				note: fakeNote,
			},
		});
	});
});