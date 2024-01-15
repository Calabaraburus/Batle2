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
import { SettingsLoader } from "../services/SettingsLoader";
const { ccclass, property } = _decorator;

@ccclass("LevelSelectorController")
export class LevelSelectorController extends Service {
  sceneLoader: SceneLoaderService | null;
  _bonusSorted: BonusModel[][];
  private _aManager: AudioManagerService | null;

  //private _lifeBonus: EndLevelLifeBonusModel | null;
  //private _cardUpBonus: EndLevelCardUpdateBonusModel | null;
  //private _cardsSelectorBonus: EndLevelCardSelectorBonusModel | null;

  configDict = new Map<string, (config: LevelConfiguration) => void>();
  private _settingsLoader: SettingsLoader;

  start() {
    this.sceneLoader = this.getService(SceneLoaderService);
    this._settingsLoader = this.getServiceOrThrow(SettingsLoader);
    this._settingsLoader.loadGameConfiguration();
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

      // this._lifeBonus = config.node.getComponentInChildren(
      //   EndLevelLifeBonusModel
      // );
      // this._cardUpBonus = config.node.getComponentInChildren(
      //   EndLevelCardUpdateBonusModel
      // );
      // this._cardsSelectorBonus = config.node.getComponentInChildren(
      //   EndLevelCardSelectorBonusModel
      // );
      // if (this._cardsSelectorBonus) {
      //   this._cardsSelectorBonus.cardOne = "firewall";
      //   this._cardsSelectorBonus.cardTwo = "meteorite";
      //   config.endLevelBonuses.push(this._cardsSelectorBonus);
      // }
    });

    this._settingsLoader.gameConfiguration.levels.forEach(lvl => {
      this.configDict.set(lvl.lvlName, (config) => {

        const player = this.configPlayerStd({ config, name: lvl.playerHeroName, life: Number(lvl.playerLife) })
        const bot = this.configPlayerStd({ config, name: lvl.botHeroName, life: Number(lvl.botLife), isBot: true })

        const bonuses: { name: string, price: number }[] = []

        lvl.playerCards.forEach(c => bonuses.push({ name: c.mnemonic, price: Number(c.price) }));

        this.addBonuses(config, player, bonuses);

        bonuses.length = 0;
        lvl.botCards.forEach(c => bonuses.push({ name: c.mnemonic, price: Number(c.price) }));

        this.addBonuses(config, bot, bonuses);

        switch (lvl.endLevelBonus.toLowerCase()) {
          case 'onecard':
            this.setEndBonusCard(config, lvl.endLevelBonusParams[0]);
            break;
          case 'twocards':
            this.setEndBonusTwoCards(config, lvl.endLevelBonusParams);
            break;
          case 'life':
            this.setEndBonusLife(config, lvl.endLevelBonusParams[0]);
            break;
          default:
            break;
        }


      });
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
    const cardUpBonus = config.node.getComponentInChildren(
      EndLevelCardUpdateBonusModel
    );

    if (cardUpBonus) {
      cardUpBonus.cardUp = cardName;
      config.endLevelBonuses.push(cardUpBonus);
    }
  }

  setEndBonusTwoCards(config: LevelConfiguration, cardNames: string[]) {
    const cardsSelectorBonus = config.node.getComponentInChildren(
      EndLevelCardSelectorBonusModel
    );

    if (cardsSelectorBonus) {
      cardsSelectorBonus.cardOne = cardNames[0];
      cardsSelectorBonus.cardOne = cardNames[1];
      config.endLevelBonuses.push(cardsSelectorBonus);
    }
  }

  setEndBonusLife(config: LevelConfiguration, life: string) {
    const lifeBonus = config.node.getComponentInChildren(
      EndLevelLifeBonusModel
    );

    if (lifeBonus) {
      lifeBonus.life = life;
      config.endLevelBonuses.push(lifeBonus);
    }
  }

  addBonuses(config: LevelConfiguration, playerModel: PlayerModel | null, bonusCards: { name: string, price: number }[]) {
    const bonuses = config.node
      .getChildByName("BonusModels")
      ?.getComponentsInChildren(BonusModel);

    if (playerModel) {
      playerModel.bonuses.length = 0;
    }

    bonusCards.forEach((bc) => {
      const bonusModel = bonuses?.find((bm) => bm.mnemonic == bc.name);

      if (bonusModel && playerModel) {
        bonusModel.priceToActivate = bc.price;
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