import {Request, Response, Express} from 'express';
import routerUser from '../../app/features/users/user.routes';
import routerNote from '../../app/features/notes/note.routes';

export function makeRoutes(app: Express) {
	app.get('/', (req: Request, res: Response) => {
		res.status(200).json({
			message: 'ok'
		});
	});

	app.use('/users', routerUser);
	app.use('/notes', routerNote);

}