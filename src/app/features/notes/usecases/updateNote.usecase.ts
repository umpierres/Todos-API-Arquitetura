import { UserRepository } from '../../users/repositories';
import { NoteRepository } from '../repositories';
import { ReturnNote } from './createNote.usecase';

export type UpdateDTO = {
    ownerID: string,
    noteID:string,
    action: 'update' | 'archive' | 'favorite',
    newInfo: {
        title?:string,
        description?: string,
    }
}


export class UpdateNote {
    async execute(data: UpdateDTO): Promise<ReturnNote> {
        const {newInfo, noteID, ownerID} = data
        const noteRepository = new NoteRepository()
        const userRepository = new UserRepository();

        const currentUser = await userRepository.findUserByID(ownerID)

        if(!currentUser) {
            return {
				success: false,
				message: 'Usuário não encontrado. Não foi possivel atualizar a nota.',
			}; 
        }

        const note = await noteRepository.findNoteByID(
            ownerID,
            noteID
        )

       
        let updatedNote;
        if (data.action === 'update') {
         updatedNote =  await noteRepository.updateNote({
                noteID, title: newInfo.title, description: newInfo.description, updatedAt: new Date()
            })
        } else if(data.action === "archive") {
            updatedNote = await noteRepository.toggleArchiveStatus(noteID)
        } else if(data.action === "favorite"){
            updatedNote = await noteRepository.toggleFavoriteStatus(noteID)
        }

        if(!updatedNote){
            return {
				success: false,
				message: 'Nota não encontrado.',
			}; 
        }
        return {
            success: true,
            message: "Nota atualizada com sucesso.",
            data: {
                note: updatedNote
            }
        };
    }
}