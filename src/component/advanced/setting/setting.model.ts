import {Injectable} from "@angular/core";
import {ChatGPTDatabases} from "../../../databases";

export interface SettingConfig {
    config: SettingConfigItem
}

export interface SettingConfigItem {
    id?: number;
    BASE_SECRET_KEY: string;
    CONTEXT_ENABLE: 0 | 1;
    CONTEXT_ENABLE_AUTO_CUT: 0 | 1;
    [key: string]: any;
}

@Injectable({providedIn: 'root'})
export class SettingModel {
    public db = new ChatGPTDatabases();
    public table = this.db.TABLE_SETTING;


    public async update(item: SettingConfigItem) {
        return new Promise(async (resolve) => {
            this.db.transaction('rw', this.table, async () => {
                await this.table.clear();
                await this.table.add({config: item});
                resolve(true);
            });
        })
    }

    // public async add(item: SettingItem) {
    //     return new Promise(async (resolve) => {
    //         this.db.transaction('rw', this.table, async () => {
    //             const id = await this.table.add(item);
    //             resolve(id);
    //         });
    //     })
    // }

    // public delete(id: number) {
    //     return new Promise(async (resolve) => {
    //         this.db.transaction('rw', this.table, async () => {
    //             await this.table.where('id').equals(id).delete();
    //             resolve(id);
    //         });
    //     })
    // }

    // public getList(): Promise<AskContextItem[]> {
    //     return new Promise((resolve) => {
    //         this.db.transaction('rw', this.table, async () => {
    //             resolve(await this.table.toArray());
    //         });
    //     })
    // }
    //
    // public getListCount(): Promise<number> {
    //     return new Promise((resolve) => {
    //         this.db.transaction('rw', this.table, async () => {
    //             const count = await this.table.count();
    //             resolve(count);
    //         });
    //     })
    // }
    //
    public count() {
        return new Promise(async (resolve) => {
            const count = await this.table.count();
            resolve(count);
        })
    }

    public async get(): Promise<SettingConfigItem | undefined> {
        return new Promise(async (resolve) => {
            const list = await this.table.toArray();
            if (list && list.length > 0 && list[0].config) {
                resolve(list[0].config);
            } else {
                resolve(undefined)
            }
        })
    }
    public clear() {
        return new Promise(async (resolve) => {
            await this.table.clear();
            resolve(true);
        })
    }
}
