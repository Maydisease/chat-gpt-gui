import Dexie, {Table} from "dexie";
import {Injectable} from "@angular/core";
import {HISTORY_LIST_ITEM_STATE, STREAM_STATE} from "./app.service";
import {ChatGPTDatabases} from "../databases";

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
    errorCode?: string;
}

export type AskFavoriteList = AskFavoriteListItem[];
//
// Declare Database

@Injectable({providedIn: 'root'})
export class FavoriteModel {
    public favoriteDB = new ChatGPTDatabases();
    public table = this.favoriteDB.TABLE_FAVORITE;

    public async add(item: AskFavoriteListItem) {
        return new Promise(async (resolve) => {
            this.favoriteDB.transaction('rw', this.table, async () => {
                const id = await this.table.add(item);
                resolve(id);
            });

        })
    }

    public delete(id: number) {
        return new Promise(async (resolve) => {
            this.favoriteDB.transaction('rw', this.table, async () => {
                await this.table.where('id').equals(id).delete();
                resolve(id);
            });
        })
    }

    public getList(): Promise<AskFavoriteListItem[]> {
        return new Promise((resolve) => {
            this.favoriteDB.transaction('rw', this.table, async () => {
                const list: AskFavoriteListItem[] = [];
                await this.table.each((item) => {
                    list.push(item);
                });
                resolve(list);
            });
        })
    }

    public getListCount(): Promise<number> {
        return new Promise((resolve) => {
            this.favoriteDB.transaction('rw', this.table, async () => {
                const count = await this.table.count();
                resolve(count);
            });
        })
    }

    public clear() {
        return new Promise((resolve) => {
            this.favoriteDB.transaction('rw', this.table, async () => {
                await this.table.clear();
                resolve(true);
            });
        })
    }
}
