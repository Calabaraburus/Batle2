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
  resources,
  TextAsset,
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
import { GameCardCfgModel } from "../game/GameCardCfgModel";
import { FieldModel } from "../../models/FieldModel";
const { ccclass, property } = _decorator;

@ccclass("LevelSelectorController")
export class LevelSelectorController extends Service {
  private _sceneLoader: SceneLoaderService;
  //private _bonusSorted: BonusModel[][];
  configDict = new Map<string, (config: LevelConfiguration) => void>();
  private _settingsLoader: SettingsLoader;

  field_maps = new Map<string, TextAsset>();

  start() {
    //    resources.preloadDir("filed_maps");

    resources.loadDir("filed_maps", (err, assets) => {
      assets.forEach((asset) => {
        if (asset instanceof TextAsset) {
          this.field_maps.set(asset.name, asset);
        }
      });
    });

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

    const setMap = (config: LevelConfiguration, mapName: string) => {
      const fm = config.node.getComponentInChildren(FieldModel);
      if (fm) {
        const m = field_maps.get(mapName);
        if (m) {
          fm.fieldMap = m;
        }
      }
    };

    const std_init = (config: LevelConfiguration, lvl: GameLevelCfgModel, mapName = "map6") => {
      setMap(config, mapName);

      config.levelName = lvl.lvlName;

      const player = this.configPlayerStd({ config, name: lvl.playerHeroName, life: Number(lvl.playerLife) })
      const bot = this.configPlayerStd({ config, name: lvl.botHeroName, life: Number(lvl.botLife), isBot: true })

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

      config.endLevelBonuses = [];

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
    }

    const specAlgs = new Map<string, (config: LevelConfiguration, lvl: GameLevelCfgModel) => void>();

    const field_maps = this.field_maps;

    // lvl_walls
    specAlgs.set("lvl_walls", (config: LevelConfiguration, lvl: GameLevelCfgModel) => {

      std_init(config, lvl, "map_walls");

    });

    // lvl_lion_boss
    specAlgs.set("lvl10", (config: LevelConfiguration, lvl: GameLevelCfgModel) => {

      std_init(config, lvl, "map_lion");

    });

    // arena
    specAlgs.set("lvl_arena", (config) => {

      setMap(config, "map6");

      const cardCfgs = this.getAvailableBonusesForArena(config, settingsLoader);

      const lvl = settingsLoader.gameConfiguration.levels.find(l => l.lvlName == "lvl_arena");

      assert(lvl != null);

      const playerHero = this.configPlayerStd({ config, name: lvl.playerHeroName, life: Number(lvl.playerLife) })
      const botHero = this.configPlayerStd({ config, name: lvl.botHeroName, life: Number(lvl.botLife), isBot: true })

      if (!playerHero) return;
      if (!botHero) return;

      const groupedBonuses = this.groupBonuses(config, cardCfgs);

      let bonusList = this.selectBonuses(groupedBonuses).map(c => ({ name: c.mnemonic, price: Number(c.price) }));

      this.addBonuses(config, botHero, bonusList);

      bonusList = this.selectBonuses(groupedBonuses).map(c => ({ name: c.mnemonic, price: Number(c.price) }));

      this.addBonuses(config, playerHero, bonusList);

      // this.fillPlayerWithBonuses(playerHero, groupedBonuses);
      // this.fillPlayerWithBonuses(botHero, groupedBonuses);

      config.updateData();
    });

    settingsLoader.gameConfiguration.levels.forEach(lvl => {
      if (specAlgs.has(lvl.lvlName)) {
        this.configDict.set(lvl.lvlName, (config: LevelConfiguration) => {
          const func = specAlgs.get(lvl.lvlName);
          if (func) func(config, lvl);
        });
      } else {
        this.configDict.set(lvl.lvlName, (config: LevelConfiguration) => {
          std_init(config, lvl);
        });
      }
    });
  }

  getAvailableBonusesForArena(lvlConfig: LevelConfiguration, settingsLoader: SettingsLoader) {
    const bonuses = lvlConfig.bonuses;

    const gameCfg = settingsLoader.gameConfiguration;
    const curState = settingsLoader.playerCurrentGameState;

    const resultBonuses = new Map<string, GameCardCfgModel>();

    const addBonus = (bc: GameCardCfgModel) => {
      if (!resultBonuses.has(bc.mnemonic)) {
        const bonus = bonuses?.find(b => b.mnemonic == bc.mnemonic);
        if (bonus) {
          resultBonuses.set(bc.mnemonic, bc);
        }

      }
    }

    curState.finishedLevels.forEach(lvlName => {
      const lvl = gameCfg.levels.find(v => v.lvlName == lvlName);
      if (lvl) {
        lvl.botCards.forEach(bc => {
          addBonus(bc);
        });
        lvl.playerCards.forEach(bc => {
          addBonus(bc);
        });
      }
    });

    curState.cards.forEach(bc => addBonus(bc));

    return Array.from(resultBonuses.values());
  }

  private loadPlayerState(config: LevelConfiguration,
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

    if (bonuses.length > 0) {
      this.addBonuses(config, playerModel, bonuses);
    } else {
      playerModel.bonusesMetaData.length = 0;
      playerModel?.updateData();
    }
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
    const bonuses = config.bonuses;

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

    const player = this.findPlayerModel(config, name)

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

  findPlayerModel(config: LevelConfiguration, name: string) {
    return config.node
      .getChildByName("HeroModels")!
      .getChildByName(LevelSelectorController.titleCaseWord(name) + "Hero")
      ?.getComponent(PlayerModel);
  }

  static titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substring(1);
  }

  selectBonuses(groupedBonuses: { close_range: GameCardCfgModel[], long_range: GameCardCfgModel[], protect: GameCardCfgModel[] }) {
    const result = [];

    let ar = groupedBonuses.close_range;
    result.push(ar[randomRangeInt(0, ar.length)]);

    ar = groupedBonuses.long_range;
    result.push(ar[randomRangeInt(0, ar.length)]);

    ar = groupedBonuses.protect;
    result.push(ar[randomRangeInt(0, ar.length)]);

    return result;
  }

  groupBonuses(config: LevelConfiguration, cards: GameCardCfgModel[]): { close_range: GameCardCfgModel[], long_range: GameCardCfgModel[], protect: GameCardCfgModel[] } {
    const bonuses = config.node
      .getChildByName("BonusModels")
      ?.getComponentsInChildren(BonusModel);

    const result: { close_range: GameCardCfgModel[], long_range: GameCardCfgModel[], protect: GameCardCfgModel[] } = { close_range: [], long_range: [], protect: [] };

    cards.forEach((card) => {

      const bonus = bonuses?.find(b => b.mnemonic == card.mnemonic);

      if (bonus) {
        switch (bonus.activateType) {
          case "close_range":
            result.close_range.push(card);
            break;
          case "long_range":
            result.long_range.push(card);
            break;
          case "protect":
            result.protect.push(card);
            break;
        }
      }
    });

    return result;
  }

}
