import { UserRepository } from '../repositories';
import { UserDTO } from '.';


type LoginUserResponse = {
	success: boolean;
	message: string;
	data?: {id: string ; email: string};
};

export class LoginUser {
	async execute(data: UserDTO): Promise<LoginUserResponse> {
		const repository = new UserRepository();

		const findUser = await repository.loginUser(data);

		if (!findUser) {
			return {
				success: false,
				message: 'Senha e/ou email incorretos!',
			};
		}
		
		return {
			success: true,
			message: 'Cadastro encontrado! Bem-vindo(a)',
			data: { 
				id: findUser.toJSON().id, 
				email: findUser.toJSON().email },
		};
	}
}
