import cors from 'cors';
import express from 'express';
import { makeRoutes } from './routes.config';

export function app(){
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended:false }));

    makeRoutes(app)

    return app
}