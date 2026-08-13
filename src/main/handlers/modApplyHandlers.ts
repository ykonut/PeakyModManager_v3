import { ipcMain } from "electron";
import fs from "fs-extra";
import path from "path";
import { applyMods } from "../domain/modApply";
import { getLibraryPath, getTargetPath } from "../services/storeService";
import { ModApplyDeps } from "../domain/modApply";

const deps: ModApplyDeps = {
  getLibraryPath,
  getTargetPath,
  pathExists: (p: string) => fs.pathExists(p),
  remove: (p: string) => fs.remove(p),
  ensureSymlink: (src: string, dest: string, type: string) => {
    if (process.platform === "win32") {
      // Windows: junction
      return fs.ensureSymlink(src, dest, type as "junction");
    } else {
      // POSIX: normal symlink, type ignored
      return fs.ensureSymlink(src, dest);
    }
  },
  pathJoin: (...segments: string[]) => path.join(...segments),
};

export const registerApplyHandlers = () => {
  ipcMain.handle("apply-mods", async (_event, changes: Record<string, boolean>) => applyMods(changes, deps));
};