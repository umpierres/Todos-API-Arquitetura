import {Entity, PrimaryColumn, Column, BaseEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({name:'tasks'})
export class NoteEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    	id!: string;
    
    @PrimaryColumn({name:'id_user'})
    	idUser!: string;

    @Column({length:255, type:'varchar'})
    	title!:string;

    @Column({type:'text'})
    	description!:string;

    @Column({name:'created_at'})
    	createdAt!:Date;

    @Column({name:'updated_at'})
    	updatedAt!:Date;

    @Column({default: false})
    	favorited!:boolean;

    @Column({default: false})
    	archived!:boolean;

    @ManyToOne(()=> UserEntity, (user) => user.notes)
    @JoinColumn({
    	name: 'id_user',
    	foreignKeyConstraintName:'tasks_id_user_fkey',
    	referencedColumnName:'id'
    })
    	user!: UserEntity;
}
