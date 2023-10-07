import { BaseClass } from "../BaseClass/baseClass.class";
import { User, UserJSON } from "../User/user.class";

type updateNoteDTO = {
	title?: string,
	description?: string,
}

export type NoteJSON = {
    id: string
    title:string,
    description: string,
    favorited: boolean,
    archived: boolean,
    date: Date, 
    ownerID: Omit<UserJSON, 'password'>,
}

export class Note extends BaseClass {
    
    private _date: Date
	constructor(
        id:string,
        private _title: string,
		private _description: string,
		private _favorited: boolean = false,
		private _archived: boolean = false,
		private _owner: Omit<User, 'password'>,
        ) {
		super(id);
        this._date = new Date()
	}


	public toJSON() {
		return {
			id: this._id,
			title: this._title,
			description: this._description,
            favorited: this._favorited, 
			archived: this._archived, 
            date: this._date, 
            owner:{
				id: this._owner.toJSON().id,
				email: this._owner.toJSON().email,
			},
		};
	}

    public updateNoteDetails(newInfo: updateNoteDTO) {
        if(newInfo.title) {
            if(newInfo.title.length < 3) {
                return false;
            }
            this._title = newInfo.title
        }
        if(newInfo.description) {
            if(newInfo.description.length < 3 || newInfo.description.length > 100) {
                return false;
            }
            this._description = newInfo.description
        }
        return true;
    }

    toggleArchiveStatus() {
        this._archived = !this._archived;
    }

    toggleFavoriteStatus() {
        this._favorited = !this._favorited;
    }
}