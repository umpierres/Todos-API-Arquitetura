import { UUID } from 'crypto';
import { Note } from '../../../classes';
import { UserRepository } from '../../users/repositories';
import { NoteRepository } from '../repositories';
import { CacheRepository } from '../../../shared/database/repositories';

export type CreateNoteDTO = {
    title:string,
    description: string,
    favorited: boolean,
    archived: boolean,
    ownerID: string,
}

export type ReturnNote = {
	success: boolean;
	message: string;
	data?: {
        note?: Note
        notes?: Array<Note>
    };
};

export class CreateNote{
	async execute(data: CreateNoteDTO): Promise<ReturnNote>{
		const userRepository = new UserRepository();
		const cacheRepository = new CacheRepository();
        
		const currentUser = await userRepository.findUserByID(data.ownerID);

		if(!currentUser) {
			return {
				success: false,
				message: 'Usuário não encontrado.',
			}; 
		}

		const repository = new NoteRepository();


		const newNote = await repository.createNote({
			title:data.title,
			description: data.description,
			favorited: data.favorited,
			archived: data.archived,
			ownerID: data.ownerID as UUID,
		});

		const notes = await repository.listNotes(data.ownerID, {});
		await cacheRepository.delete(`notes-user-${data.ownerID}`);
		await cacheRepository.delete(`note-${newNote.toJSON().id}`);


		return {
			success:true,
			message: 'Nota cadastrado com sucesso.',
			data: {
				note: newNote,
				notes: notes,
			},
		};
	}
}