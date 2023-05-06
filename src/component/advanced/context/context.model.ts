import Dexie, {Table} from "dexie";
import {Injectable} from "@angular/core";
import {ChatGPTDatabases} from "../../../databases";

export interface AskContextItem {
    id?: number;
    list: {
        role: 'assistant' | 'user' | 'system';
        content: string;
        token?: number;
    }[]
    updateTime: number;
    token?: number;
}

export type AskContextItemList = AskContextItem[];

@Injectable({providedIn: 'root'})
export class ContextModel {
    public contextDB = new ChatGPTDatabases();
    public table = this.contextDB.TABLE_CONTEXT;

    public async add(item: AskContextItem) {
        return new Promise(async (resolve) => {
            this.contextDB.transaction('rw', this.table, async () => {
                const id = await this.table.add(item);
                resolve(id);
            });
        })
    }

    public delete(id: number) {
        return new Promise(async (resolve) => {
            this.contextDB.transaction('rw', this.table, async () => {
                await this.table.where('id').equals(id).delete();
                resolve(id);
            });
        })
    }

    public getList(): Promise<AskContextItem[]> {
        return new Promise((resolve) => {
            this.contextDB.transaction('rw', this.table, async () => {
                resolve(await this.table.toArray());
            });
        })
    }

    public getListCount(): Promise<number> {
        return new Promise((resolve) => {
            this.contextDB.transaction('rw', this.table, async () => {
                const count = await this.table.count();
                resolve(count);
            });
        })
    }

    public find(where: { [key: string]: any }) {
        return new Promise(async (resolve) => {
            const count = await this.table.where(where).count();
            resolve(count);
        })
    }

    public update(id: number, payload: Partial<AskContextItem>) {
        return new Promise(async (resolve) => {
            await this.table.update(id, payload)
            resolve(true);
        })
    }

    public clear() {
        return new Promise(async (resolve) => {
            await this.table.clear();
            resolve(true);
        })
    }
}
