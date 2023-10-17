import { Note } from "../../../classes";
import { CacheRepository } from "../../../shared/database/repositories";
import { UserRepository } from "../../users/repositories";
import { NoteRepository } from "../repositories";
import { ReturnNote } from "./createNote.usecase";

type ListByIDDTO = {
	ownerID: string;
	noteID: string;
};

export class ListByID {
	public async execute(data: ListByIDDTO): Promise<ReturnNote> {
		const { noteID, ownerID } = data;

		const noteRepository = new NoteRepository();
        const userRepository = new UserRepository();
        const cacheRepository = new CacheRepository();

		const currentUser = await userRepository.findUserByID(ownerID);

		if (!currentUser) {
			return {
				success: false,
				message: 'Usuário não encontrado. Não foi possível listar as notas.',
			};
		}

		const noteCache = await cacheRepository.get<Note>(`note-${noteID}`)


		if (!noteCache) {
			const note = await noteRepository.findNoteByID(ownerID, noteID);

			if (!note) {
				return {
					success: false,
					message: 'Nota não encontrada.',
				};
			}

			await cacheRepository.set<Note>(`note-${noteID}`, note)

			return {
				success: true,
				message: 'Nota buscada com sucesso',
				data: {
					note: note,
				},
			};
		}

		return {
			success:true,
            message: "Notas em cache buscadas com sucesso.",
            data: {
                note: noteCache
            },
		};
	}
}
