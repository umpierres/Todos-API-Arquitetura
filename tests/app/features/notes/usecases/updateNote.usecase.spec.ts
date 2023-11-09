import { randomUUID } from 'crypto';
import { UpdateNote } from '../../../../../src/app/features/notes/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import { Note, User } from '../../../../../src/app/classes';
import { NoteRepository } from '../../../../../src/app/features/notes/repositories';

describe('Testes para o usecase de atualizar uma nota', () => {
	jest.mock('../../../../../src/app/features/notes/repositories');
	jest.mock('../../../../../src/app/features/users/repositories');
	jest.mock('../../../../../src/app/shared/database/repositories');

	function createSut() {
		return new UpdateNote();
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
			action: 'update',
			newInfo: {description:'any_description', title:'any_title'},
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
			action: 'update',
			newInfo: {description:'any_description', title:'any_title'},
			noteID: randomUUID(),
			ownerID: randomUUID(),
		});

		expect(result).toEqual({
			success: false,
			message: 'Nota não encontrado.',
		});
	});

	test('deve retornar um objeto de sucesso com os dados da nota atualizada', async () => {
		const fakeUser = new User( randomUUID(), 'any_email','any_password');
		const fakeUpdatedNote = new Note(randomUUID(), 'any_title', 'any_description', false, false, fakeUser);
        
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(fakeUser);
		jest.spyOn(NoteRepository.prototype, 'findNoteByID').mockResolvedValue(fakeUpdatedNote);
		jest.spyOn(NoteRepository.prototype, 'updateNote').mockResolvedValue(fakeUpdatedNote);

		const sut = createSut();
		const result = await sut.execute({
			action: 'update',
			newInfo: {description:'any_description', title:'any_title'},
			noteID: randomUUID(),
			ownerID: randomUUID(),
		});

		expect(result).toEqual({
			success: true,
			message: 'Nota atualizada com sucesso.',
			data: {
				note: fakeUpdatedNote!
			}
		});
	});
});