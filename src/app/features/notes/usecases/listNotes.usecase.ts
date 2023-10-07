import { UserRepository } from '../../users/repositories';
import { Filter, NoteRepository } from '../repositories';
import { ReturnNote } from './createNote.usecase';

export class ListNotes{
    async execute(ownerID: string, filter?: Filter) : Promise<ReturnNote> {
        const noteRepository = new NoteRepository()
        const userRepository = new UserRepository();
        const currentUser = await userRepository.findUserByID(ownerID)

        if(!currentUser) {
            return {
				success: false,
				message: 'Usuário não encontrado.',
			}; 
        }

        const notesCurrentUser = await noteRepository.listNotes(ownerID, filter);

        return {
            success:true,
            message: "Notas listadas com sucesso.",
            data: {
                notes: notesCurrentUser
            },
        }
    }
}