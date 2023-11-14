import supertest from 'supertest';
import { createServer } from '../../../../src/main/config/server.config';
import { DatabaseConnection, RedisConnection } from '../../../../src/main/database';
import { NoteRepository } from '../../../../src/app/features/notes/repositories';
import {  randomUUID } from 'crypto';
import { Server } from 'http';
import { createNotes } from '../../../helpers/create-notes.builder';
import { UserRepository } from '../../../../src/app/features/users/repositories';
import { createUsers } from '../../../helpers/create-users.builder';

let app: Express.Application;
let server: Server;

beforeAll(async () => {
	await DatabaseConnection.connect();
	await RedisConnection.connect();

	const { app: expressApp, server: expressServer } = createServer();
	app = expressApp;
	server = expressServer;
});

afterAll(async () => {
	await DatabaseConnection.destroy();
	await RedisConnection.destroy();

	server.close();
});

afterEach(async () => {
	await new NoteRepository().clear();
	await new UserRepository().clear();
});

describe('CREATE - Teste de rotas de criar Notas', () => {
	test('CREATE - Deve retornar 400 se não for enviado um ID no body', async () =>{

		await supertest(app).post('/notes/').send({}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Você precisa informar o ID do usuario'
			});
		});
	});

	test('CREATE - Deve retornar 400 se não for encontrado nenhum usuario com o ID enviado', async () =>{

		await supertest(app).post('/notes/').send({
			title: 'any_title',
			description: 'any_description',
			favorited: false,
			archived: false,
			ownerID: randomUUID(),
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Usuário não encontrado.',
			});
		});
	});

	test('CREATE - Deve retornar 400 se não for enviado todos os dados da nota', async () =>{

		await supertest(app).post('/notes/').send({
			ownerID: randomUUID()
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Insira todos os dados da nota.'
			});
		});
	});

	test('CREATE - Deve retornar 400 se o texto for muito curto', async () =>{

		await supertest(app).post('/notes/').send({
			title: 'a',
			description: 'a',
			favorited: false,
			archived: false,
			ownerID: randomUUID(),
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Texto muito curto.'
			});
		});
	});

	test('CREATE - Deve retornar 400 se o texto for muito longo', async () =>{

		await supertest(app).post('/notes/').send({
			title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			description: 'aaaaaaaa',
			favorited: false,
			archived: false,
			ownerID: randomUUID(),
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Texto muito longo.'
			});
		});
	});

	test('CREATE - Deve retornar 400 se o texto não for string', async () =>{

		await supertest(app).post('/notes/').send({
			title: 1,
			description: 1,
			favorited: false,
			archived: false,
			ownerID: randomUUID(),
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'O titulo e/ou a descrição precisa conter alguma letra!'
			});
		});
	});

	test('CREATE - Deve retornar 201 quando todos os dados forem validos', async ()=>{
		const note = await createNotes();

		await supertest(app)
			.post('/notes/')
			.send(note.json)
			.expect(201)
			.expect((res) => {
				expect(res.body.success).toBe(true);
				expect(res.body.message).toBe('Nota cadastrado com sucesso.');
				expect(res.body.data).toBeDefined();
			});
	});
});

describe('LIST - Teste de rotas de listar Notas', () => {
	test('LIST - Deve retornar 400 se não for encontrado nenhum usuário com o ID enviado', async () => {
	  await supertest(app)
			.get(`/notes/${randomUUID()}`)
			.expect(400)
			.expect((res) => {
		  expect(res.body).toEqual({
					success: false,
					message: 'Usuário não encontrado.',
		  });
			});
	});
  
	test('LIST - Deve retornar 201 ao encontrar a lista do usuario', async () => {
	  const user = await createUsers();
  
	  await supertest(app)
			.get(`/notes/${user.class.toJSON().id}`)
			.expect(201)
			.expect((res) => {
		  expect(res.body.success).toBe(true);
		  expect(res.body.message).toBe('Notas listadas com sucesso.');
		  expect(res.body.data).toBeDefined();

			});
	});

});

describe('UPDATE - Teste de rotas de atualizar Notas', () => {
	test('UPDATE - Deve retornar 400 se não for enviado um ID de usuario no body', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).put(`/notes/${noteID}`).send({
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Você precisa informar o ID do usuario'
			});
		});
	});

	test('UPDATE - Deve retornar 400 se não for encontrado nenhum usuario com o ID enviado', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;
		
		await supertest(app).put(`/notes/${noteID}`).send({
			title: 'any_title',
			description: 'any_description',
			favorited: false,
			archived: false,
			ownerID: randomUUID(),
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Usuário não encontrado. Não foi possivel atualizar a nota.',
			});
		});
	});

	test('UPDATE - deve retornar um objeto de erro quando a nota não existir', async () => {
		const note = await createNotes();
		await supertest(app).put(`/notes/${randomUUID()}`).send({
			ownerID: note.class.toJSON().owner.id,
			title: 'any_title'
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Nota não encontrado.',
			});
		});
	  });

	test('UPDATE - Deve retornar 400 se não for enviado algum dos dados para atualizar a nota', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).put(`/notes/${noteID}`).send({
			ownerID: note.json.ownerID
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Insira algum dado para atualizar a nota.'
			});
		});
	});

	test('UPDATE - Deve retornar 400 se o tamanho do titulo sair do escopo ', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).put(`/notes/${noteID}`).send({
			title: 'a',
			description: 'any_description',
			ownerID: note.json.ownerID
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'O tamanho do titulo está fora do escopo da aplicação'
			});
		});
	});

	test('UPDATE - Deve retornar 400 se o tamanho da descrição sair do escopo ', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).put(`/notes/${noteID}`).send({
			title: 'any_title',
			description: 'a',
			ownerID: note.json.ownerID
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'O tamanho da descrição está fora do escopo da aplicação'
			});
		});
	});

	test('UPDATE - Deve retornar 400 se o titulo e a descrição não forem string', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).put(`/notes/${noteID}`).send({
			title: 1,
			description: 1,
			ownerID: note.json.ownerID
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'O titulo e/ou a descrição precisa conter alguma letra!'
			});
		});
	});

	test.only('UPDATE - Deve retornar 201 quando todos os dados forem validos para atualizar', async ()=>{
		const note = await createNotes();

		console.log('Note JSON', note.json);
		await supertest(app)
			.put(`/notes/${note.noteID}`)
			.send({
				ownerID: note.json.ownerID, 
				description: 'not_any_description',
				title: 'title att',
			})
			.expect(201)
			.expect((res) => {
				expect(res.body.success).toBe(true);
				expect(res.body.message).toBe('Nota atualizada com sucesso.');
				expect(res.body.data).toBeDefined();
			});
	});
	  
});

describe('DELETE - Teste de rotas de deletar Notas', () => {
	test('DELETE - Deve retornar 400 se não for enviado um ID de usuario no body', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).delete(`/notes/${noteID}`).send({
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Você precisa informar o ID do usuario'
			});
		});
	});

	test('DELETE - Deve retornar 400 se não for encontrado nenhum usuario com o ID enviado', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).delete(`/notes/${noteID}`).send({
			title: 'any_title',
			description: 'any_description',
			favorited: false,
			archived: false,
			ownerID: randomUUID(),
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Usuário não encontrado. Não foi possivel atualizar a nota.',
			});
		});
	});

	test('DELETE - deve retornar 400 quando a nota não existir', async () => {
		const note = await createNotes();
		await supertest(app).delete(`/notes/${randomUUID()}`).send({
			ownerID: note.class.toJSON().owner.id,
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Nota não encontrado.',
			});
		});
	});
});

describe('ARCHIVE - Teste de rota de arquivar Notas', () => {
	test('ARCHIVE - Deve retornar 400 se não for enviado um ID de usuario no body', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).put(`/notes/${noteID}/archive`).send({
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Você precisa informar o ID do usuario'
			});
		});
	});

	test('ARCHIVE - Deve retornar 400 se não for encontrado nenhum usuário com o ID enviado', async () => {
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

	  await supertest(app)
			.put(`/notes/${noteID}/archive`)
			.send({
		  ownerID: randomUUID(),
			})
			.expect(400)
			.expect((res) => {
		  expect(res.body).toEqual({
					success: false,
					message: 'Usuário não encontrado. Não foi possivel atualizar a nota.',
		  });
			});
	});
});
  
describe('FAVORITE - Teste de rota de favoritar Notas', () => {
	test('FAVORITE - Deve retornar 400 se não for enviado um ID de usuario no body', async () =>{
		const note = await createNotes();
		const noteID = note.class.toJSON().id;

		await supertest(app).put(`/notes/${noteID}/favorite`).send({
		}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Você precisa informar o ID do usuario'
			});
		});
	});

	test('FAVORITE - Deve retornar 400 se não for encontrado nenhum usuário com o ID enviado', async () => {
		const note = await createNotes();
		const noteID = note.class.toJSON().id;
	  await supertest(app)
			.put(`/notes/${noteID}/favorite`)
			.send({
		  ownerID: randomUUID(),
			})
			.expect(400)
			.expect((res) => {
		  expect(res.body).toEqual({
					success: false,
					message: 'Usuário não encontrado. Não foi possivel atualizar a nota.',
		  });
			});
	});
  
});

