import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

export const handleIsTauri = () => {
  return Boolean(typeof window !== 'undefined' && window !== undefined && window.__TAURI_IPC__ !== undefined)
}

import {AppModule} from "./app/app.module";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
