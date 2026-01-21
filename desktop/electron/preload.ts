import { contextBridge, shell } from "electron";

contextBridge.exposeInMainWorld("orb", {
  openApp: () => shell.openExternal("https://YOUR-WEBSITE-URL"),
});
