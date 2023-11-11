import { UserRepository } from '../../src/app/features/users/repositories';

export async function createUsers() {
	const repoUser = new UserRepository();
	const user = {
		email:'any_email@email.com',
		password:'any_password'
	};
	const userCreated = await repoUser.createUser(user);

	return {
		json: user,
		class: userCreated
	};
}