import Dexie, {Table} from "dexie";
import {Injectable} from "@angular/core";

export interface FavoriteItem {
  id?: number;
  questionContent?: string;
  answerContent?: string;
  inputTime?: number;
  updateTime?: number;

}

//
// Declare Database
//
export class FavoriteDatabase extends Dexie {
  public favorite!: Table<FavoriteItem, number>; // id is number in this case

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

  public async add(item: FavoriteItem) {
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

  public getList(): Promise<FavoriteItem[]> {
    return new Promise((resolve) => {
      this.favoriteDB.transaction('rw', this.favoriteDB.favorite, async () => {
        const list: FavoriteItem[] = [];
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

// const db = new FriendDatabase();
//
//
// const db = new FriendDatabase();
//
// db.transaction('rw', db.friends, async () => {
//
//   // Make sure we have something in DB:
//   if ((await db.friends.where({questionContent: 'Josephine'}).count()) === 0) {
//     const id = await db.friends.add({questionContent: "Josephine"});
//     console.log('Addded friend with id:', id)
//   }
//
//   // Query:
//   const youngFriends = await db.friends.each((res) => {
//     console.log('res:', res)
//   })
//   //   .where({}).toArray();
//   //
//   // console.log('youngFriends:', youngFriends)
//
//   // Show result:
//   // alert("My young friends: " + JSON.stringify(youngFriends));
//
// }).catch(e => {
//   alert(e.stack || e);
// });
