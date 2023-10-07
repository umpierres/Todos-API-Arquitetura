import { NextFunction,Request,Response } from "express";
import { CreateNoteDTO } from "../usecases";

export function validateUpdateNote(req:Request, res: Response, next: NextFunction){
    const note: CreateNoteDTO = req.body;

	if (!note.description && !note.title ) {
		return res
			.status(400)
			.json({success: false, message: 'Insira algum dado para atualizar a nota.' });
	}
	if(note.title){
		if( note.title.length < 2 || note.title.length > 40){
			return res
				.status(400)
				.json({success: false, message: 'O tamanho do titulo está fora do escopo da aplicação' });
		}
	}
	
	if(note.description) {
		if(note.description.length < 5 || note.description.length > 100){
			return res
				.status(400)
				.json({success: false, message: 'O tamanho da descrição está fora do escopo da aplicação'  });
		}
	}
	
	if(note.title && typeof note.title !== 'string' || note.description && typeof note.description !== 'string' ) {
		return res
			.status(400)
			.json({success: false, message: 'O titulo e/ou a descrição precisa conter alguma letra!' });
	}

	next();
}