import { Service } from "../services/Service";
import { GameCardCfgModel } from "./GameCardCfgModel";
import { GameLevelCfgModel } from "./GameLevelCfgModel";

export class GameConfigurationModel {
  levels: GameLevelCfgModel[] = [];

  static getDefaultConfig() {
    const config = new GameConfigurationModel();

    const addLevel = (clb: (glvl: GameLevelCfgModel) => void) => {
      const lvl = new GameLevelCfgModel();

      clb(lvl);

      config.levels.push(lvl);
    };

    addLevel((lvl) => {
      lvl.lvlName = "lvl1";
      lvl.botHeroName = "bot1";
      lvl.botLife = "5";
      lvl.playerHeroName = "rezkar";
      lvl.playerLife = "40";
      lvl.endLevelBonus = "twocards";
      lvl.endLevelBonusParams = ['firewallLow:3', "meteoriteLow:3"];
    });

    addLevel((lvl) => {
      lvl.lvlName = "lvl2";
      lvl.botHeroName = "bot2";
      lvl.botLife = "40";
      lvl.botCards = [{ mnemonic: "firewallLow", price: "3" }];
      lvl.playerHeroName = "rezkar";
      lvl.playerLife = "";
      lvl.playerCards = [{ mnemonic: "", price: "" }];
      lvl.endLevelBonus = "life";
      lvl.endLevelBonusParams = ["20"];

    });

    return config;
  }

  /*   this.configDict.set("lvl1", (config) => {
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
*/

}
