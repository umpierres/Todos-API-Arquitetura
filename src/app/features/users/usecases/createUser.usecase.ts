import { UserJSON } from '../../../classes';
import { UserRepository } from '../repositories';

export type UserDTO = {
    id?:string;
    email:string,
    password: string,
}

export type ReturnCreateUser = {
	success: boolean;
	message: string;
	data?: Omit<UserJSON, 'password'>;
};

export class CreateUser{
	public async execute(newUser: UserDTO): Promise<ReturnCreateUser>{
		const repository = new UserRepository();

		const exist = await repository.doesUserExist(newUser.email);
		if(exist){
			return {
				success: false,
				message: 'Usuário já existe.',
			};
		}

		const userCreated = await repository.createUser(newUser);

		return {
			success:true,
			message: 'Usuário cadastrado com sucesso.',
			data:{
				id: userCreated.toJSON().id, 
				email: userCreated.toJSON().email
			},
		};
	}
}