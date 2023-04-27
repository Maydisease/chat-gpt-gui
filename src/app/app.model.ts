import Dexie, {Table} from "dexie";
import {Injectable} from "@angular/core";
import {HISTORY_LIST_ITEM_STATE, STREAM_STATE} from "./app.service";

export interface AskFavoriteListItem {
    id?: number;
    key?: string;
    questionContent?: string;
    answerContent?: string;
    answerMarkdown?: string;
    inputTime: number;
    updateTime: number;
    state: HISTORY_LIST_ITEM_STATE;
    streamDone: STREAM_STATE;
}

export type AskFavoriteList = AskFavoriteListItem[];
//
// Declare Database
//
export class FavoriteDatabase extends Dexie {
    public favorite!: Table<AskFavoriteListItem, number>; // id is number in this case

    public constructor() {
        super("favoriteDatabase");
        this.version(4).stores({
            favorite: "++id,questionContent,answerContent"
        });
    }
}

@Injectable({providedIn: 'root'})
export class FavoriteModel {
    public favoriteDB = new FavoriteDatabase();

    public async add(item: AskFavoriteListItem) {
        return new Promise(async (resolve) => {
            this.favoriteDB.transaction('rw', this.favoriteDB.favorite, async () => {
                const id = await this.favoriteDB.favorite.add(item);
                resolve(id);
            });

        })
    }

    public delete(id: number) {
        return new Promise(async (resolve) => {
            this.favoriteDB.transaction('rw', this.favoriteDB.favorite, async () => {
                await this.favoriteDB.favorite.where('id').equals(id).delete();
                resolve(id);
            });
        })
    }

    public getList(): Promise<AskFavoriteListItem[]> {
        return new Promise((resolve) => {
            this.favoriteDB.transaction('rw', this.favoriteDB.favorite, async () => {
                const list: AskFavoriteListItem[] = [];
                await this.favoriteDB.favorite.each((item) => {
                    list.push(item);
                });
                resolve(list);
            });
        })
    }

    public getListCount(): Promise<number> {
        return new Promise((resolve) => {
            this.favoriteDB.transaction('rw', this.favoriteDB.favorite, async () => {
                const count = await this.favoriteDB.favorite.count();
                resolve(count);
            });
        })
    }
}
