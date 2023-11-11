import { randomUUID } from 'crypto';
import { ListByID } from '../../../../../src/app/features/notes/usecases';
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import { Note, User } from '../../../../../src/app/classes';
import { NoteRepository } from '../../../../../src/app/features/notes/repositories';
import { CacheRepository } from '../../../../../src/app/shared/database/repositories';

describe('Testes para o usecase de listar nota por ID', () => {
	jest.mock('../../../../../src/app/features/notes/repositories');
	jest.mock('../../../../../src/app/features/users/repositories');
	jest.mock('../../../../../src/app/shared/database/repositories');

	function createSut() {
		return new ListByID();
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

	test('deve retornar um objeto de erro quando o usuário não existir', async () => {
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(undefined);
	
		const sut = createSut();
		const result = await sut.execute({
		  ownerID: randomUUID(),
		  noteID: randomUUID(),
		});
	
		expect(result).toEqual({
		  success: false,
		  message: 'Usuário não encontrado. Não foi possível listar as notas.',
		});
	  });
	
	  test('deve retornar um objeto de erro quando a nota não existir no cache nem no banco de dados', async () => {
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(new User('validUserID', 'any_email', 'any_password'));
	
		jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(undefined);
		jest.spyOn(NoteRepository.prototype, 'findNoteByID').mockResolvedValue(undefined);
	
		const sut = createSut();
		const result = await sut.execute({
		  ownerID: randomUUID(),
		  noteID: randomUUID(),
		});
	
		expect(result).toEqual({
		  success: false,
		  message: 'Nota não encontrada.',
		});
	  });
	
	  test('deve retornar um objeto de sucesso com os dados da nota encontrada no cache', async () => {
		const fakeUser = new User('validUserID', 'any_email', 'any_password');
		const fakeNote = new Note('validNoteID', 'any_title', 'any_description', false, false, fakeUser);
	
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(fakeUser);
		jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(fakeNote);
	
		const sut = createSut();
		const result = await sut.execute({
		  ownerID: fakeUser.toJSON().id,
		  noteID:  fakeNote.toJSON().id,
		});
	
		expect(result).toEqual({
		  success: true,
		  message: 'Notas em cache buscadas com sucesso.',
		  data: {
				note: fakeNote,
		  },
		});
	  });
	
	  test('deve retornar um objeto de sucesso com os dados da nota encontrada no banco de dados e armazenada no cache', async () => {
		const fakeUser = new User(randomUUID(), 'any_email', 'any_password');
		const fakeNote = new Note(randomUUID(), 'any_title', 'any_description', false, false, fakeUser);
	
		jest.spyOn(UserRepository.prototype, 'findUserByID').mockResolvedValue(fakeUser);
		jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(undefined);
		jest.spyOn(NoteRepository.prototype, 'findNoteByID').mockResolvedValue(fakeNote);
		jest.spyOn(CacheRepository.prototype, 'set').mockResolvedValue('OK');
	
		const sut = createSut();
		const result = await sut.execute({
			ownerID: fakeUser.toJSON().id,
			noteID:  fakeNote.toJSON().id,
		});
	
		expect(result).toEqual({
		  success: true,
		  message: 'Nota buscada com sucesso',
		  data: {
				note: fakeNote,
		  },
		});
	  });
});