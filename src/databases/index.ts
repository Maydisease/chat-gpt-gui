import Dexie, {Table} from "dexie";
import {AskFavoriteListItem} from "../app/app.model";
import {HistoryListItem} from "../component/advanced/histroy/history.model";
import {AskContextItem} from "../component/advanced/context/context.model";
import {SettingConfig} from "../component/advanced/setting/setting.model";

(Dexie as any).debug = "dexie";

export class ChatGPTDatabases extends Dexie {

    public TABLE_HISTORY!: Table<HistoryListItem, number>;
    public TABLE_CONTEXT!: Table<AskContextItem, number>;
    public TABLE_FAVORITE!: Table<AskFavoriteListItem, number>;
    public TABLE_SETTING!: Table<SettingConfig, number>;

    public constructor() {
        super("CHAT_GPT_DATABASES");
        this.version(16).stores({
            TABLE_FAVORITE: "++id,questionContent,answerContent,answerMarkdown,inputTime,updateTime,state,streamDone,errorCode",
            TABLE_HISTORY: "++id,updateTime,key,selected,value",
            TABLE_CONTEXT: "++id,updateTime",
            TABLE_SETTING: "++id,config",
        });
    }
}
