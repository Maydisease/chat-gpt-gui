import Dexie, {Table} from "dexie";
import {Injectable} from "@angular/core";

export interface HistoryListItem {
    id?: number;
    key: string;
    selected: boolean;
    value: string;
    updateTime: number;
}

export type HistoryListItemList = HistoryListItem[];

export class HistoryDatabase extends Dexie {
    public history!: Table<HistoryListItem, number>; // id is number in this case

    public constructor() {
        super("historyDatabase");
        this.version(5).stores({
            history: "++id,updateTime,key,selected,value"
        });
    }
}

@Injectable({providedIn: 'root'})
export class historyModel {
    public historyDB = new HistoryDatabase();

    public async add(item: HistoryListItem) {
        return new Promise(async (resolve) => {
            this.historyDB.transaction('rw', this.historyDB.history, async () => {
                const id = await this.historyDB.history.add(item);
                resolve(id);
            });
        })
    }

    public delete(id: number) {
        return new Promise(async (resolve) => {
            this.historyDB.transaction('rw', this.historyDB.history, async () => {
                await this.historyDB.history.where('id').equals(id).delete();
                resolve(id);
            });
        })
    }

    public getList(): Promise<HistoryListItem[]> {
        return new Promise((resolve) => {
            this.historyDB.transaction('rw', this.historyDB.history, async () => {
                const result = await this.historyDB.history.orderBy('updateTime').reverse().toArray();
                resolve(result);
            });
        })
    }

    public getListCount(): Promise<number> {
        return new Promise((resolve) => {
            this.historyDB.transaction('rw', this.historyDB.history, async () => {
                const count = await this.historyDB.history.count();
                resolve(count);
            });
        })
    }

    public find(where: {[key: string]: any}) {
        return new Promise(async (resolve) => {
            const count = await this.historyDB.history.where(where).count();
            resolve(count);
        })
    }

    public update(id: number, payload: Partial<HistoryListItem>){
        return new Promise(async (resolve) => {
            await this.historyDB.history.update(id, payload)
            resolve(true);
        })
    }

    public clear(){
        return new Promise(async (resolve) => {
            await this.historyDB.history.clear();
            resolve(true);
        })
    }
}
