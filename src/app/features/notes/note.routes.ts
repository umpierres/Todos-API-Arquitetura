import express from 'express';
import { NoteController } from './controllers';
import { validateCreateNote, validateUpdateNote } from './validators';
import { validateIDUser } from './validators/';

const routerNote = express.Router();
const noteController = new NoteController();

routerNote.post('/', validateIDUser, validateCreateNote, noteController.create);
routerNote.get('/:ownerID', noteController.listNotes);
routerNote.put('/:noteID/archive', validateIDUser, noteController.archive);
routerNote.put('/:noteID/favorite', validateIDUser, noteController.favorite);
routerNote.put('/:noteID', validateIDUser, validateUpdateNote, noteController.update);
routerNote.delete('/:noteID', validateIDUser, noteController.delete);

export default routerNote;