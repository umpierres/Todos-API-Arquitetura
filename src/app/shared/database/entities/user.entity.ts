import {Entity, PrimaryColumn, Column, BaseEntity, OneToMany, BeforeInsert} from 'typeorm';
import { NoteEntity } from './note.entity';
import { randomUUID } from 'crypto';

@Entity({name:'users'})
export class UserEntity extends BaseEntity{
    @PrimaryColumn({name:'id', type: 'uuid'})
    	id!: string;

    @Column({unique:true, length:250, type:'varchar'})
    	email!:string;

    @Column({length:250, type:'varchar'})
    	password!:string;

    @Column({name:'created_at'})
    	createdAt!:Date;

    @OneToMany(() => NoteEntity, (notes) => notes.idUser)
    	notes!: NoteEntity[];

        @BeforeInsert()
    beforeInsert(){
    	this.id = randomUUID();
    }
}
