import { CacheRepository } from '../../../shared/database/repositories';
import { UserRepository } from '../../users/repositories';
import { NoteRepository } from '../repositories';
import { ReturnNote } from './createNote.usecase';

type DeleteNoteDTO = {
    ownerID: string;
    noteID: string
}

export class DeleteNote {
	async execute(data: DeleteNoteDTO): Promise<ReturnNote> {
		const {noteID, ownerID} = data;
		const noteRepository = new NoteRepository();
		const userRepository = new UserRepository();
		const cacheRepository = new CacheRepository();

		const currentUser = await userRepository.findUserByID(ownerID);

		if(!currentUser) {
			return {
				success: false,
				message: 'Usuário não encontrado. Não foi possivel atualizar a nota.',
			}; 
		}

		const note = await noteRepository.findNoteByID(
			ownerID,
			noteID
		);

		if(!note){
			return {
				success: false,
				message: 'Nota não encontrado.',
			}; 
		}

		await noteRepository.deleteNote(noteID);
		await cacheRepository.delete(`notes-user-${ownerID}`);
		await cacheRepository.delete(`note-${noteID}`);

		return {
			success: true,
			message: 'Nota deletada com sucesso.',
			data: {
				note: note
			}
		};
	}
}
