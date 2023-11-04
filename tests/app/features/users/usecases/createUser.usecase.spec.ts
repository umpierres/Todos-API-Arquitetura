import { randomUUID } from 'crypto';
import { User } from '../../../../../src/app/classes';
import { UserRepository } from '../../../../../src/app/features/users/repositories';
import {CreateUser} from '../../../../../src/app/features/users/usecases'
import { DatabaseConnection, RedisConnection } from '../../../../../src/main/database'

describe("Testes para usecade de cadastrar usuario", () =>{
    jest.mock('../../../../../src/app/features/users/repositories');

    function createSut() {
        return new CreateUser()
    }

    beforeAll(async () => {
        await DatabaseConnection.connect();
        await RedisConnection.connect();
    });

    afterAll(async () => {
        await DatabaseConnection.destroy();
        await RedisConnection.destroy();
    })

    test("Deve retornar um objeto de erro quando usuario já existir", async () => {
        jest.spyOn(UserRepository.prototype, 'doesUserExist').mockResolvedValue(true);
        const sut = createSut();

        const result = await sut.execute({
            email: "any_email",
            password: "any_password"
        });

        expect(result.success).toBe(false)
        expect(result.message).toBe("Usuário já existe.")
        expect(result.data).toBeUndefined();
    });

    test("Deve retornar um objeto com um usuario com email valido", async () => {
        const fakeUser = new User(randomUUID(), 'any_email', "any_password")
        jest.spyOn(UserRepository.prototype, 'doesUserExist').mockResolvedValue(false);
        jest.spyOn(UserRepository.prototype, 'createUser').mockResolvedValue(fakeUser);

        const sut = createSut();

        const result = await sut.execute({
            email: "any_email",
            password: "any_password"
        });

        expect(result).toEqual({
            success:true,
            message: "Usuário cadastrado com sucesso.",
            data: fakeUser.toJSON(),
        });
    })
})