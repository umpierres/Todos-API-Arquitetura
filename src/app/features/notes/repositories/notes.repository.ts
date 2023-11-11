import { UUID } from 'crypto';
import { FindOptionsWhere } from 'typeorm';
import { DatabaseConnection } from '../../../../main/database';
import { Note, User } from '../../../classes';
import { NoteEntity, UserEntity } from '../../../shared/database/entities';


export type CreateNoteDTO = {
  title:string,
  description: string,
  favorited: boolean,
  archived: boolean,
  ownerID: UUID,
}
export type UpdateNoteDTO = {
  noteID: string
  title?:string,
  description?: string,
  updatedAt: Date
}

export type Filter = {
  title?: string;
  favorited?: boolean;
  archived?: boolean;
}

export class NoteRepository {
	private _manager = DatabaseConnection.connection.manager;
	async createNote(data: CreateNoteDTO) : Promise<Note>  {
		const { title, description, favorited, archived, ownerID } = data;

		const user = await this._manager.findOneOrFail(UserEntity, {
			where:
      { 
      	id: ownerID
      }
		});
		const newNote = this._manager.create(NoteEntity, {
			idUser: ownerID,
			title,
			description,
			favorited,
			archived,
			user
		});

		const note = await this._manager.save(newNote);

		return this.entityToClass(note);
	}

	async listNotes(ownerID: string, filter?:Filter) : Promise<Note[]> {
		const condition: FindOptionsWhere<NoteEntity> = {
			idUser: ownerID,
		};
		if(filter) {
			if(filter.title){
				condition.title = filter.title;
			}

			if(filter.favorited){
				condition.favorited = filter.favorited;
			}

			if(filter.archived){
				condition.archived = filter.archived;
			}
		}

		const filteredList = await this._manager.find(NoteEntity, {
			where: condition, 
			relations: {
				user: true
			}
		});

		return filteredList.map((note) => this.entityToClass(note));
	}
      
	async findNoteByID(ownerID: string, noteID: string): Promise<Note | undefined> {
		const note = await this._manager.findOne(NoteEntity,{
			where: {
				id: noteID,
				idUser: ownerID
			},
			relations: {
				user: true
			}
		});

		if (!note) return undefined;
    
		return this.entityToClass(note);
	}

	async updateNote(data: UpdateNoteDTO): Promise<Note | null> {
		const {title, description, noteID, updatedAt} = data;

		 const updatedNote = await this._manager.findOne(NoteEntity, {
			where: { id: noteID }
		});

		if (updatedNote) {
			updatedNote.title = title || updatedNote.title;
			updatedNote.description = description || updatedNote.description;
			updatedNote.updatedAt = updatedAt;

			await this._manager.save(updatedNote);

			return this.entityToClass(updatedNote);
		}

		return null;

	}
      
	async toggleArchiveStatus(noteID: string): Promise<Note | null> {
		const note = await this._manager.findOne(NoteEntity, {
			where: {
				id: noteID,
			}
		});

		if (!note) return null;

		note.archived = !note.archived;
		await this._manager.save(NoteEntity, note);

		return this.entityToClass(note);
	}

	async toggleFavoriteStatus(noteID: string): Promise<Note | null> {
		const note = await this._manager.findOne(NoteEntity, {
			where: {
				id: noteID,
			}
		});

		if (!note) return null;

		note.favorited = !note.favorited;
		await this._manager.save(NoteEntity, note);

		return this.entityToClass(note);
	}

	async deleteNote(noteID: string): Promise<void> {
		const note = await this._manager.findOne(NoteEntity, {
			where: {
				id: noteID,
			},
			relations: {
				user: true,
			},
		});
  
		if (note) {
			await this._manager.remove(note); 
		}
	}

	public async clear() {
		await this._manager.delete(NoteEntity, {});
	}

	private entityToClass(dataDB: NoteEntity): Note {
		const user = new User(dataDB.user.id, dataDB.user.email, dataDB.user.password);
		const note = new Note(dataDB.id, dataDB.title, dataDB.description, dataDB.archived,dataDB.favorited, user);
  
		return note;
	}
}
