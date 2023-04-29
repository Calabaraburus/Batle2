//  LevelSelectorController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, director, _decorator } from "cc";
import { Service } from "../services/Service";
import { SceneLoaderService } from "../services/SceneLoaderService";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
const { ccclass, property } = _decorator;

@ccclass("LevelSelectorController")
export class LevelSelectorController extends Service {
  sceneLoader: SceneLoaderService | null;

  configDict = new Map<string, (config: LevelConfiguration) => void>();

  start() {
    this.sceneLoader = this.getService(SceneLoaderService);
    this.fillConfigurations();
  }

  loadLevel(sender: object, levelName: string): void {
    if (this.sceneLoader == null) throw Error("SceneLoader is null");
    const cfgAction = this.configDict.get(levelName);

    if (cfgAction == null)
      throw Error("No configuration for " + levelName + " level");
    this.sceneLoader.loadGameScene("scene_dev_nt", cfgAction);
  }

  fillConfigurations() {
    this.configDict.set("lvl1", (config) => {
      config.botHeroName = "panda";
      config.playerHeroName = "bear";
    });
    this.configDict.set("lvl2", (config) => {
      config.botHeroName = "lion";
      config.playerHeroName = "bear";
    });
  }
}
