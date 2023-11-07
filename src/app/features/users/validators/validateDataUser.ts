import { NextFunction,Request,Response } from 'express';
import { UserDTO } from '../usecases';

export function validateDataUser(req:Request, res: Response, next: NextFunction){
	const user: UserDTO = req.body;

	if (!user.email || !user.password) {
		return res
			.status(400)
			.json({success: false, message: 'Insira todos os dados para cadastrar o usúario.' });
	}

	if (typeof user.email !== 'string' || !user.email.includes('@') || !user.email.includes('.com') ) {
		return res.status(400).json({success: false, message: 'Insira um email válido.' });
	}

	if (user.password.length < 6 ) {
		return res
			.status(400)
			.json({ success: false, message: 'Insira no mínimo 6 caracteres para senha.' });
	}

	if (typeof user.password !== 'string') { 
		return res
			.status(400)
			.json({ success: false, message: 'A senha precisa de letras e numeros!' });
	}

	next();

}