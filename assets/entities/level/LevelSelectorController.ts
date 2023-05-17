//  LevelSelectorController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, director, _decorator, randomRangeInt, random } from "cc";
import { Service } from "../services/Service";
import { SceneLoaderService } from "../services/SceneLoaderService";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { BonusModel } from "../../models/BonusModel";
import { PlayerModel } from "../../models/PlayerModel";
import { MeteoriteLowCardSubehaviour } from "../tiles/Behaviours/MeteoriteLowCardSubehaviour";
const { ccclass, property } = _decorator;

@ccclass("LevelSelectorController")
export class LevelSelectorController extends Service {
  sceneLoader: SceneLoaderService | null;
  _bonusSorted: BonusModel[][];

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
    this.sceneLoader.loadGameScene("scene_dev_art_1", cfgAction);
  }

  fillConfigurations() {
    this.configDict.set("lvl1", (config) => {
      config.botHeroName = "bot1";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteLow";
      });

      if (!heroBonusOne) return;

      playerHero?.bonuses.push(heroBonusOne);
    });
    this.configDict.set("lvl2", (config) => {
      config.botHeroName = "bot2";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteLow";
      });

      if (!heroBonusOne) return;

      playerHero?.bonuses.push(heroBonusOne);
    });
    this.configDict.set("lvl3", (config) => {
      config.botHeroName = "monkey";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 50;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteLow";
      });

      if (!heroBonusOne) return;

      playerHero?.bonuses.push(heroBonusOne);
    });
    this.configDict.set("lvl4", (config) => {
      config.botHeroName = "bot3";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 60;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteMiddle";
      });

      if (!heroBonusOne) return;

      playerHero?.bonuses.push(heroBonusOne);
    });
    this.configDict.set("lvl5", (config) => {
      config.botHeroName = "bot4";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 70;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteMiddle";
      });

      if (!heroBonusOne) return;

      playerHero?.bonuses.push(heroBonusOne);
    });
    this.configDict.set("lvl6", (config) => {
      config.botHeroName = "bear";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 70;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteMiddle";
      });
      const heroBonusTwo = bonuses?.find((value) => {
        return value.cardName == "assassin";
      });

      if (!heroBonusOne || !heroBonusTwo) return;

      playerHero?.bonuses.push(heroBonusOne);
      playerHero?.bonuses.push(heroBonusTwo);
    });
    this.configDict.set("lvl7", (config) => {
      config.botHeroName = "bot5";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 80;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteMiddle";
      });
      const heroBonusTwo = bonuses?.find((value) => {
        return value.cardName == "assassin";
      });

      if (!heroBonusOne || !heroBonusTwo) return;

      playerHero?.bonuses.push(heroBonusOne);
      playerHero?.bonuses.push(heroBonusTwo);
    });
    this.configDict.set("lvl8", (config) => {
      config.botHeroName = "bot6";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 80;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteMiddle";
      });
      const heroBonusTwo = bonuses?.find((value) => {
        return value.cardName == "assassin";
      });
      const heroBonusThree = bonuses?.find((value) => {
        return value.cardName == "c_attack";
      });

      if (!heroBonusOne || !heroBonusTwo || !heroBonusThree) return;

      playerHero?.bonuses.push(heroBonusOne);
      playerHero?.bonuses.push(heroBonusTwo);
      playerHero?.bonuses.push(heroBonusThree);
    });
    this.configDict.set("lvl9", (config) => {
      config.botHeroName = "bot7";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 90;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteoriteMiddle";
      });
      const heroBonusTwo = bonuses?.find((value) => {
        return value.cardName == "assassin";
      });
      const heroBonusThree = bonuses?.find((value) => {
        return value.cardName == "c_attack";
      });

      if (!heroBonusOne || !heroBonusTwo || !heroBonusThree) return;

      playerHero?.bonuses.push(heroBonusOne);
      playerHero?.bonuses.push(heroBonusTwo);
      playerHero?.bonuses.push(heroBonusThree);
    });
    this.configDict.set("lvl10", (config) => {
      config.botHeroName = "panda";
      config.playerHeroName = "lion";

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      playerHero!.life = 90;

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.cardName == "meteorite";
      });
      const heroBonusTwo = bonuses?.find((value) => {
        return value.cardName == "assassin";
      });
      const heroBonusThree = bonuses?.find((value) => {
        return value.cardName == "c_attack";
      });

      if (!heroBonusOne || !heroBonusTwo || !heroBonusThree) return;

      playerHero?.bonuses.push(heroBonusOne);
      playerHero?.bonuses.push(heroBonusTwo);
      playerHero?.bonuses.push(heroBonusThree);
    });

    // arena of 1st part
    this.configDict.set("lvlrnd", (config) => {
      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("HeroPlayer")
        ?.getComponent(PlayerModel);

      const botHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("HeroBot")
        ?.getComponent(PlayerModel);

      if (!bonuses) return;
      if (!playerHero || !botHero) return;

      const bonusLevel = randomRangeInt(0, 3);
      this._bonusSorted = [[], [], []];
      this.filterBonuses(bonuses, bonusLevel);

      this.compliteBonuses(playerHero);
      this.compliteBonuses(botHero);

      config.botHeroName = "rnd_bot";
      config.playerHeroName = "rnd_player";
    });
  }

  compliteBonuses(player: PlayerModel) {
    this._bonusSorted.forEach((item) => {
      player.bonuses.push(item[randomRangeInt(0, item.length)]);
    });
  }

  filterBonuses(bonuses: BonusModel[], bonusLevel: number) {
    bonuses.forEach((value) => {
      switch (value.activateType) {
        case "close_range":
          if (bonusLevel == value.bonusLevel) {
            this._bonusSorted[0].push(value);
          }
          break;
        case "long_range":
          this._bonusSorted[1].push(value);
          break;
        case "protect":
          this._bonusSorted[2].push(value);
          break;
      }
    });
  }
}
