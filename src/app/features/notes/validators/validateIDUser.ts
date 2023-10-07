import { NextFunction,Request,Response } from "express";

export function validateIDUser(req:Request, res: Response, next: NextFunction){
    const {ownerID} = req.body;

	if (!ownerID) {
		return res
			.status(400)
			.json({success: false, message: 'Você precisa informar o ID do usuario' });
	}

	next()
}