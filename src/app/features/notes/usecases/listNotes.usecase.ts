import { Note } from '../../../classes';
import { CacheRepository } from '../../../shared/database/repositories';
import { UserRepository } from '../../users/repositories';
import { Filter, NoteRepository } from '../repositories';
import { ReturnNote } from './createNote.usecase';

export class ListNotes{
    async execute(ownerID: string, filter?: Filter) : Promise<ReturnNote> {
        const noteRepository = new NoteRepository();
        const userRepository = new UserRepository();
        const cacheRepository = new CacheRepository();

        const currentUser = await userRepository.findUserByID(ownerID)

        if(!currentUser) {
            return {
				success: false,
				message: 'Usuário não encontrado.',
			}; 
        }

        const notesCache = await cacheRepository.get<Note[]>(`notes-user-${ownerID}`)
        let notes: Note[] = [];

        if(!notesCache){
            const notesCurrentUser = await noteRepository.listNotes(ownerID);
            notes = notesCurrentUser

            await cacheRepository.set<Note[]>(`notes-user-${ownerID}`, notes)
        } else {
            notes = notesCache
        }

        return {
            success:true,
            message: "Notas listadas com sucesso.",
            data: {
                notes
            },
        }
    }
}