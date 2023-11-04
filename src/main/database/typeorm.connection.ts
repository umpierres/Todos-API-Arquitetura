import 'reflect-metadata'
import { DataSource } from "typeorm"
import typeorm from '../config/database.config'

export class DatabaseConnection {
    private static _connection: DataSource

    public static get connection() : DataSource{
        if(!this._connection){
            throw new Error('Não existe essa conexão');
        }

        return this._connection;
    }

    public static async connect() {
        if(!this._connection){
            this._connection = await typeorm.initialize();
            console.log("Banco de dados conectado")
        }
    }
    public static async destroy() {
        if(!this._connection){
            throw new Error ("Base de dados não inicializada")
        }
        await this._connection.destroy()
        console.log("Banco de dados desconectado")
    }
}