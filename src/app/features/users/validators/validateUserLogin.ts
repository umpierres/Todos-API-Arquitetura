import { NextFunction, Request, Response } from 'express';

export function validateUserLogin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { email, password } = req.body;

	if (!email) {
		return res.status(400).json({
			success: false, message: 'Campo email é obrigatório!',
		});
	}

	if (!password) {
		return res.status(400).json({
			success: false, message: 'Campo senha é obrigatório!',
		});
	}

	next();
}