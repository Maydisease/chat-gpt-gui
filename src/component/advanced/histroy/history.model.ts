import {Injectable} from "@angular/core";
import {ChatGPTDatabases} from "../../../databases";

export interface HistoryListItem {
    id?: number;
    key: string;
    selected: number;
    value: string;
    updateTime: number;
}

export type HistoryListItemList = HistoryListItem[];

@Injectable({providedIn: 'root'})
export class historyModel {
    public chatDB = new ChatGPTDatabases();
    public table = this.chatDB.TABLE_HISTORY;

    public async add(item: HistoryListItem) {
        return new Promise(async (resolve) => {
            this.chatDB.transaction('rw', this.table, async () => {
                const id = await this.table.add(item);
                resolve(id);
            });
        })
    }

    public delete(id: number) {
        return new Promise(async (resolve) => {
            this.chatDB.transaction('rw', this.table, async () => {
                await this.table.where('id').equals(id).delete();
                resolve(id);
            });
        })
    }

    public getList(): Promise<HistoryListItem[]> {
        return new Promise((resolve) => {
            this.chatDB.transaction('rw', this.table, async () => {
                const result = await this.table.orderBy('updateTime').reverse().toArray();
                resolve(result);
            });
        })
    }

    public getListCount(): Promise<number> {
        return new Promise((resolve) => {
            this.chatDB.transaction('rw', this.table, async () => {
                const count = await this.table.count();
                resolve(count);
            });
        })
    }

    public has(where: { [key: string]: any }) {
        return new Promise(async (resolve) => {
            const count = await this.table.where(where).count();
            resolve(count);
        })
    }

    public find(where: { [key: string]: any }): Promise<any> {
        return new Promise(async (resolve) => {
            const result = await this.table.where(where).first();
            resolve(result);
        })
    }

    public update(id: number, payload: Partial<HistoryListItem>) {
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
