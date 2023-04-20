// @ts-ignore
import {encode} from "../libs/mod.js";

export class ChatGptTokensUtil {
    public static tokenLen(str: string) {
        let c = 0;
        try {
            c = encode(str).length;
        } catch (err) {

        }
        return c;
    }
}
