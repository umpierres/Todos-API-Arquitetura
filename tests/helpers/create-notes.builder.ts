import { NoteRepository } from '../../src/app/features/notes/repositories';
import { createUsers } from './create-users.builder';

export async function createNotes() {
	const repoNote = new NoteRepository();
	const user = await createUsers();

	const note = {
		title:'any_title',
		description:'any_description',
		favorited: false,
		archived: false,
		ownerID: user.class.toJSON().id,
	};
	const noteCreated = await repoNote.createNote(note);

	return {
		json: note,
		class: noteCreated,
		noteID : noteCreated.toJSON().id
	};
}