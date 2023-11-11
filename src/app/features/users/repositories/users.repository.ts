import { DatabaseConnection } from '../../../../main/database/';
import { User } from '../../../classes';
import { UserEntity } from '../../../shared/database/entities';
import { UserDTO } from '../usecases';


export class UserRepository { 
	private _manager = DatabaseConnection.connection.manager;
	async doesUserExist(email:string): Promise<boolean>{

		const userExist = await this._manager.findOneBy(UserEntity,{email});

		return !!userExist;
	}

	async createUser(data:UserDTO): Promise<User>{
		const { email, password } = data;
		const newUser = this._manager.create(UserEntity,{ email, password });
		const userCreated = await this._manager.save(newUser);
  
		return this.entityToClass(userCreated);

	}

	async loginUser(data: UserDTO): Promise<User | undefined> {
		const { email, password } = data;
		const user = await this._manager.findOneBy(UserEntity,{ email, password });
  
		if (!user) {
			return undefined;
		}
  
		return this.entityToClass(user);

	}     
    
	async findUserByID(ownerID: string): Promise<User | undefined> {
		const user = await this._manager.findOneBy(UserEntity,{ id: ownerID });
  
		if (!user) {
			return undefined;
		}
  
		return this.entityToClass(user);
	}

	public async clear() {
		await this._manager.delete(UserEntity, {});
	}

	private entityToClass(userEntity: UserEntity): User {
		return new User(userEntity.id, userEntity.email, userEntity.password );
	}

}