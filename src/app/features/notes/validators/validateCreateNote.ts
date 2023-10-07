import { NextFunction,Request,Response } from "express";
import { CreateNoteDTO } from "../usecases";

export function validateCreateNote(req:Request, res: Response, next: NextFunction){
    const note: CreateNoteDTO = req.body;

	if (!note.description || !note.title ) {
		return res
			.status(400)
			.json({success: false, message: 'Insira todos os dados da nota.' });
	}

	if(note.description.length < 5 || note.title.length < 2 ){
		return res
			.status(400)
			.json({success: false, message: 'Texto muito curto.' });
	}
	if( note.description.length > 100 || note.title.length > 15){
		return res
			.status(400)
			.json({success: false, message: 'Texto muito longo.' });
	}

	if(typeof note.title !== 'string' || typeof note.description !== 'string' ) {
		return res
			.status(400)
			.json({success: false, message: 'O titulo e/ou a descrição precisa conter alguma letra!' });
	}

	next();
}