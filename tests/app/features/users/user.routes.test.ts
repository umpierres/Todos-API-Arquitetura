import supertest from 'supertest';
import { createServer } from '../../../../src/main/config/server.config';
import { DatabaseConnection, RedisConnection } from '../../../../src/main/database';
import { UserRepository } from '../../../../src/app/features/users/repositories';
import { createUsers } from '../../../helpers/create-users.builder';
import { Server } from 'http';

describe('Teste de rotas de User', () => {
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
	
	afterEach(async () =>{
		await new UserRepository().clear();
	});

	test('Deve retornar 400 se não for enviado um dos dados para cadastro', async () =>{

		await supertest(app).post('/users/signup').send({}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Insira todos os dados para cadastrar o usúario.'
			});
		});
	});

	test('Deve retornar 400 se o email não for valido', async () => {
		await supertest(app)
			.post('/users/signup')
			.send({
				email: 'any_email',
				password: 'any_password',
			})
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({
					success: false,
					message: 'Insira um email válido.',
				});
			});
	});
    
	test('Deve retornar 400 se a senha ser menor que 6 caracteres', async ()=>{
		await supertest(app)
			.post('/users/signup')
			.send({
				email: 'any_email@.com',
				password: '12345',
			})
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({
					success: false,
					message: 'Insira no mínimo 6 caracteres para senha.',
				});
			});
	});

	test('Deve retornar 400 se a senha não ser uma string', async ()=>{
		await supertest(app)
			.post('/users/signup')
			.send({
				email: 'any_email@.com',
				password: 10,
			})
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({
					success: false,
					message: 'A senha precisa de letras e numeros!',
				});
			});
	});

	test('Deve retornar 400 se o email já existir na base de dados', async ()=>{
		await createUsers();

		await supertest(app)
			.post('/users/signup')
			.send({
				email: 'any_email@email.com',
				password: 'any_password',
			})
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({
					success: false,
					message: 'Usuário já existe.',
				});
			});
	});

	test('Deve retornar 201 quando o email não existir na base de dados', async ()=>{
		
		await supertest(app)
			.post('/users/signup')
			.send({
				email: 'any_email@email.com',
				password: 'any_password',
			})
			.expect(201)
			.expect((res) => {
				expect(res.body.success).toBe(true);
				expect(res.body.message).toBe('Usuário cadastrado com sucesso.');
				expect(res.body.data).toBeDefined();
			});
	});

	test('Login - Deve retornar 401 se usuario não for valido', async () =>{

		await supertest(app).post('/users/signin').send({
			email: 'any_email@email.com',
			password: 'any_password'
		}).expect(401).expect((res) => {
			expect(res.body).toEqual({
				success: false,
				message: 'Senha e/ou email incorretos!',
			});
		});
	});

	test('Login - Deve retornar 202 quando o usuario existir na base de dados', async ()=>{
		await createUsers();

		await supertest(app)
			.post('/users/signin')
			.send({
				email: 'any_email@email.com',
				password: 'any_password',
			})
			.expect(202)
			.expect((res) => {
				expect(res.body.success).toBe(true);
				expect(res.body.message).toBe('Cadastro encontrado! Bem-vindo(a)');
				expect(res.body.data).toBeDefined();
			});
	});

	test('Login - Deve retornar 400 se não for enviado o email', async () =>{

		await supertest(app).post('/users/signin').send({password: 'any_password'}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Campo email é obrigatório!'
			});
		});
	});

	test('Login - Deve retornar 400 se não for enviado a senha', async () =>{

		await supertest(app).post('/users/signin').send({email: 'any_email'}).expect(400).expect((res) => {
			expect(res.body).toEqual({
				success: false, 
				message: 'Campo senha é obrigatório!'
			});
		});
	});
});