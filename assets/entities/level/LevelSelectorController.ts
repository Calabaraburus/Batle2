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
  assert,
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
import { GameConfigurationModel } from "../game/GameConfiguration";
import { GameLevelCfgModel } from "../game/GameLevelCfgModel";
import { PlayerCurrentGameState } from "../services/PlayerCurrentGameState";
const { ccclass, property } = _decorator;

@ccclass("LevelSelectorController")
export class LevelSelectorController extends Service {
  private _sceneLoader: SceneLoaderService;
  private _bonusSorted: BonusModel[][];
  configDict = new Map<string, (config: LevelConfiguration) => void>();
  private _settingsLoader: SettingsLoader;

  start() {
    this._sceneLoader = this.getServiceOrThrow(SceneLoaderService);
    this._settingsLoader = this.getServiceOrThrow(SettingsLoader);
    this._settingsLoader.loadGameConfiguration();
    this.fillConfigurations();
  }

  loadLevel(sender: object, levelName: string): void {
    if (this._sceneLoader == null) throw Error("SceneLoader is null");
    const cfgAction = this.configDict.get(levelName);

    if (cfgAction == null)
      throw Error("No configuration for " + levelName + " level");
    this._sceneLoader.loadGameScene("scene_game_field", cfgAction);
  }

  loadScene(sender: object, sceneName: string): void {
    this._sceneLoader.loadLevel(sceneName);
  }

  fillConfigurations() {
    this.configDict.set("test", (config) => {
      config.botHeroName = "testBot";
      config.playerHeroName = "testPlayer";
    });

    const settingsLoader = this.getServiceOrThrow(SettingsLoader);

    settingsLoader.gameConfiguration.levels.forEach((lvl) => {
      this.configDict.set(lvl.lvlName, (config: LevelConfiguration) => {
        config.levelName = lvl.lvlName;

        const player = this.configPlayerStd({
          config,
          name: lvl.playerHeroName,
          life: Number(lvl.playerLife),
        });
        const bot = this.configPlayerStd({
          config,
          name: lvl.botHeroName,
          life: Number(lvl.botLife),
          isBot: true,
        });

        assert(player != null);
        assert(bot != null);

        this.loadPlayerState(
          config,
          lvl,
          settingsLoader.playerCurrentGameState,
          player
        );

        const bonuses: { name: string; price: number }[] = [];

        bonuses.length = 0;
        lvl.botCards.forEach((c) =>
          bonuses.push({ name: c.mnemonic, price: Number(c.price) })
        );

        this.addBonuses(config, bot, bonuses);

        switch (lvl.endLevelBonus.toLowerCase()) {
          case "onecard":
            this.setEndBonusCard(config, lvl.endLevelBonusParams[0]);
            break;
          case "twocards":
            this.setEndBonusTwoCards(config, lvl.endLevelBonusParams);
            break;
          case "life":
            this.setEndBonusLife(config, lvl.endLevelBonusParams[0]);
            break;
          default:
            break;
        }

        config.updateData();
      });
    });

    // arena of 1st part
    this.configDict.set("arena", (config) => {
      const bonuses = config.node
        .getChildByName("BonusModels")
        ?.getComponentsInChildren(BonusModel);

      const botHero = config.node
        .getChildByName("HeroModels")!
        .getChildByName("HeroBot")
        ?.getComponent(PlayerModel);

      if (!bonuses) return;
      if (!botHero) return;

      const bonusLevel = randomRangeInt(0, 3);
      this._bonusSorted = [[], [], []];
      this.filterBonuses(bonuses, bonusLevel);

      //this.compliteBonuses(playerHero);
      this.compliteBonuses(botHero);

      config.botHeroName = "rnd_bot";
      config.playerHeroName = "rnd_player";
    });
  }

  private loadPlayerState(
    config: LevelConfiguration,
    lvlCfg: GameLevelCfgModel,
    playerState: PlayerCurrentGameState,
    playerModel: PlayerModel
  ) {
    playerModel.life =
      lvlCfg.playerLife == "" ? playerState.life : Number(lvlCfg.playerLife);
    playerModel.lifeMax = playerModel.life;

    playerModel.playerName =
      lvlCfg.playerHeroName == "" ? playerState.hero : lvlCfg.playerHeroName;

    const bonuses: { name: string; price: number }[] = [];

    if (lvlCfg.playerCards.length > 0) {
      lvlCfg.playerCards.forEach((c) =>
        bonuses.push({ name: c.mnemonic, price: Number(c.price) })
      );
    } else {
      playerState.cards.forEach((c) =>
        bonuses.push({ name: c.mnemonic, price: Number(c.price) })
      );
    }

    if (bonuses.length > 0) this.addBonuses(config, playerModel, bonuses);
  }

  setEndBonusCard(config: LevelConfiguration, cardParams: string) {
    const cardUpBonus = config.node.getComponentInChildren(
      EndLevelCardUpdateBonusModel
    );

    if (cardUpBonus) {
      cardUpBonus.cardMnemonic = cardParams.split(":")[0];
      cardUpBonus.cardPrice = Number(cardParams.split(":")[1]);
      config.endLevelBonuses.push(cardUpBonus);
    }
  }

  setEndBonusTwoCards(config: LevelConfiguration, cardParams: string[]) {
    const cardsSelectorBonus = config.node.getComponentInChildren(
      EndLevelCardSelectorBonusModel
    );

    if (cardsSelectorBonus) {
      cardsSelectorBonus.cardOne = cardParams[0].split(":")[0];
      cardsSelectorBonus.cardOnePrice = Number(cardParams[0].split(":")[1]);

      cardsSelectorBonus.cardTwo = cardParams[1].split(":")[0];
      cardsSelectorBonus.cardTwoPrice = Number(cardParams[1].split(":")[1]);
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

  addBonuses(
    config: LevelConfiguration,
    playerModel: PlayerModel | null,
    bonusCards: { name: string; price: number }[]
  ) {
    const bonuses = config.node
      .getChildByName("BonusModels")
      ?.getComponentsInChildren(BonusModel);

    if (playerModel) {
      playerModel.bonusesMetaData.length = 0;
    }

    bonusCards.forEach((bc) => {
      const bonusModel = bonuses?.find((bm) => bm.mnemonic == bc.name);

      if (bonusModel && playerModel) {
        if (bc.price > 0) bonusModel.priceToActivate = bc.price;
        playerModel.bonusesMetaData.push(bonusModel);
      }
    });

    playerModel?.updateData();
  }

  configPlayerStd({
    config,
    name,
    life = -1,
    isBot = false,
  }: {
    config: LevelConfiguration;
    name: string;
    life?: number;
    isBot?: boolean;
  }) {
    if (isBot) {
      config.botHeroName = name;
    } else {
      config.playerHeroName = name;
    }

    const player = config.node
      .getChildByName("HeroModels")!
      .getChildByName(LevelSelectorController.titleCaseWord(name) + "Hero")
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

  static titleCaseWord(word: string) {
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
