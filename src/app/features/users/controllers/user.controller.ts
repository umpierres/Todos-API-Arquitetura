import { Request, Response } from "express"
import { CreateUser } from '../usecases/';
import { LoginUser } from "../usecases/";
export class UserController {

    public async signup(req: Request, res:Response){
        const {email, password} = req.body

        const usecase = new CreateUser()

        const response = await usecase.execute({ email, password })

        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(201).json(response);
    }

    public async signin(req: Request, res: Response) {
		const { email, password } = req.body;

		const usecase = new LoginUser();

		const response = await usecase.execute({ email, password});

		if (!response.success) {
			return res.status(401).json(response);
		}

		return res.status(202).json(response);
	}
}
