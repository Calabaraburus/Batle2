//  LevelSelectorController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  Component,
  director,
  _decorator,
  randomRangeInt,
  random,
  AudioSource,
  LineComponent,
} from "cc";
import { Service } from "../services/Service";
import { SceneLoaderService } from "../services/SceneLoaderService";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { BonusModel } from "../../models/BonusModel";
import { PlayerModel } from "../../models/PlayerModel";
import { MeteoriteLowCardSubehaviour } from "../tiles/Behaviours/MeteoriteLowCardSubehaviour";
import { AudioManagerService } from "../../soundsPlayer/AudioManagerService";
import { EndLevelCardSelectorBonusModel } from "../configuration/EndLevelCardSelectorBonusModel";
import { EndLevelLifeBonusModel } from "../configuration/EndLevelLifeBonusModel";
import { EndLevelCardUpdateBonusModel } from "../configuration/EndLevelCardUpdateBonusModel";
const { ccclass, property } = _decorator;

@ccclass("LevelSelectorController")
export class LevelSelectorController extends Service {
  sceneLoader: SceneLoaderService | null;
  _bonusSorted: BonusModel[][];
  private _aManager: AudioManagerService | null;

  private _lifeBonus: EndLevelLifeBonusModel | null;
  private _cardUpBonus: EndLevelCardUpdateBonusModel | null;
  private _cardsSelectorBonus: EndLevelCardSelectorBonusModel | null;

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
    this.sceneLoader.loadGameScene("scene_game_field", cfgAction);
  }

  loadScene(sender: object, sceneName: string): void {
    // stop start audio track
    // const currentScene = director.getScene()?.name;
    // if (currentScene == "scene_dev_art_1") {
    //   this._aManager?.stopMusic();

    //   this._aManager?.playMusic("start_menu");
    // } else if (sceneName == "scene_dev_art_1") {
    //   this._aManager?.stopMusic();
    // }

    director.loadScene(sceneName);
  }


  fillConfigurations() {

    this.configDict.set("test", (config) => {
      config.botHeroName = "testBot";
      config.playerHeroName = "testPlayer";

      this._lifeBonus = config.node.getComponentInChildren(
        EndLevelLifeBonusModel
      );
      this._cardUpBonus = config.node.getComponentInChildren(
        EndLevelCardUpdateBonusModel
      );
      this._cardsSelectorBonus = config.node.getComponentInChildren(
        EndLevelCardSelectorBonusModel
      );
      if (this._cardsSelectorBonus) {
        this._cardsSelectorBonus.cardOne = "firewall";
        this._cardsSelectorBonus.cardTwo = "meteorite";
        config.endLevelBonuses.push(this._cardsSelectorBonus);
      }
    });

    this.configDict.set("lvl1", (config) => {
      config.botHeroName = "bot1";
      config.playerHeroName = "lion";

      this._lifeBonus = config.node.getComponentInChildren(
        EndLevelLifeBonusModel
      );

      const education = config.node.parent?.getChildByPath(
        "LevelView/Education"
      );
      if (!education) return;
      education.active = true;

      if (this._lifeBonus) {
        this._lifeBonus.life = "10";
        config.endLevelBonuses.push(this._lifeBonus);
      }

      const playerHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("LionHero")
        ?.getComponent(PlayerModel);

      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);
      const heroBonusOne = bonuses?.find((value) => {
        return value.mnemonic == "firewallLow";
      });

      heroBonusOne!.currentAmmountToActivate = 3;

      if (!heroBonusOne) return;

      playerHero?.bonuses.push(heroBonusOne);
    });

    this.configDict.set("lvl2", (config) => {
      this.configPlayerStd({ config, name: "bot2", isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 50 })
      this.addBonuses(config, player, ["meteoriteLow"]);

      this.setEndBonusCard(config, "catapult");
    });



    this.configDict.set("lvl3", (config) => {
      this.configPlayerStd({ config, name: "monkey", life: 60, isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 60 })
      this.addBonuses(config, player, ["meteoriteLow"]);
    });

    this.configDict.set("lvl4", (config) => {
      this.configPlayerStd({ config, name: "bot3", life: 60, isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 60 })
      this.addBonuses(config, player, ["meteoriteLow", "assassin"]);
    });

    this.configDict.set("lvl5", (config) => {
      var bot = this.configPlayerStd({ config, name: "bot4", life: 70, isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 70 })
      this.addBonuses(config, player, ["meteoriteMiddle", "assassin"]);
    });

    this.configDict.set("lvl6", (config) => {
      var bot = this.configPlayerStd({ config, name: "bear", isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 70 })
      this.addBonuses(config, player, ["meteoriteLow", "assassin", "c_attack"]);
    });

    this.configDict.set("lvl7", (config) => {
      var bot = this.configPlayerStd({ config, name: "bot5", isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 80 })
      this.addBonuses(config, player, ["meteoriteLow", "assassin", "c_attack"]);
    });

    this.configDict.set("lvl8", (config) => {
      var bot = this.configPlayerStd({ config, name: "bot6", isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 80 })
      this.addBonuses(config, player, ["meteoriteLow", "assassin", "c_attack"]);
    });

    this.configDict.set("lvl9", (config) => {
      var bot = this.configPlayerStd({ config, name: "bot7", isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 80 })
      this.addBonuses(config, player, ["meteoriteLow", "assassin", "c_attack"]);
    });

    this.configDict.set("lvl10", (config) => {
      var bot = this.configPlayerStd({ config, name: "panda", isBot: true })
      var player = this.configPlayerStd({ config, name: "lion", life: 90 })
      this.addBonuses(config, player, ["meteoriteLow", "assassin", "c_attack"]);
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

  setEndBonusCard(config: LevelConfiguration, cardName: string) {
    this._cardUpBonus = config.node.getComponentInChildren(
      EndLevelCardUpdateBonusModel
    );

    if (this._cardUpBonus) {
      this._cardUpBonus.cardUp = cardName;
      config.endLevelBonuses.push(this._cardUpBonus);
    }
  }

  addBonuses(config: LevelConfiguration, playerModel: PlayerModel | null, bonusNames: string[]) {
    const bonuses = config.node
      .getChildByName("BonusModels")
      ?.getComponentsInChildren(BonusModel);

    bonusNames.forEach((bName) => {
      const bonusModel = bonuses?.find((bm) => bm.mnemonic == bName);

      if (bonusModel && playerModel) {
        playerModel.bonuses.push(bonusModel);
      }
    });
  };

  configPlayerStd({
    config,
    name,
    life = -1,
    isBot = false
  }: {
    config: LevelConfiguration,
    name: string,
    life?: number,
    isBot?: boolean
  }) {

    if (isBot) {
      config.botHeroName = name;
    } else {
      config.playerHeroName = name;
    }

    const player = config.node
      .getChildByName("HeroModels")!
      .getChildByName(this.titleCaseWord(name) + "Hero")
      ?.getComponent(PlayerModel);

    if (player) {
      if (life > 0) {
        player.life = life;
        player.lifeMax = life;
      }

      return player;
    } else {
      return null;
    }
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substring(1);
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