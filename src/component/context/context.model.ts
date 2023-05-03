import Dexie, {Table} from "dexie";
import {Injectable} from "@angular/core";

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

export class ContextDatabase extends Dexie {
    public context!: Table<AskContextItem, number>; // id is number in this case

    public constructor() {
        super("CHAT_GPT_DATABASES");
        this.version(4).stores({
            context: "++id,key,selected,value"
        });
    }
}

@Injectable({providedIn: 'root'})
export class ContextModel {
    public contextDB = new ContextDatabase();

    public async add(item: AskContextItem) {
        return new Promise(async (resolve) => {
            this.contextDB.transaction('rw', this.contextDB.context, async () => {
                const id = await this.contextDB.context.add(item);
                resolve(id);
            });
        })
    }

    public delete(id: number) {
        return new Promise(async (resolve) => {
            this.contextDB.transaction('rw', this.contextDB.context, async () => {
                await this.contextDB.context.where('id').equals(id).delete();
                resolve(id);
            });
        })
    }

    public getList(): Promise<AskContextItem[]> {
        return new Promise((resolve) => {
            this.contextDB.transaction('rw', this.contextDB.context, async () => {
                const list: AskContextItem[] = [];
                await this.contextDB.context.each((item) => {
                    list.push(item);
                });
                resolve(list);
            });
        })
    }

    public getListCount(): Promise<number> {
        return new Promise((resolve) => {
            this.contextDB.transaction('rw', this.contextDB.context, async () => {
                const count = await this.contextDB.context.count();
                resolve(count);
            });
        })
    }

    public find(where: { [key: string]: any }) {
        return new Promise(async (resolve) => {
            const count = await this.contextDB.context.where(where).count();
            resolve(count);
        })
    }

    public update(id: number, payload: Partial<AskContextItem>) {
        return new Promise(async (resolve) => {
            await this.contextDB.context.update(id, payload)
            resolve(true);
        })
    }

    public clear() {
        return new Promise(async (resolve) => {
            await this.contextDB.context.clear();
            resolve(true);
        })
    }
}
