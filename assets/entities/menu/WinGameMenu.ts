import { _decorator, Component, Label, Node } from "cc";
import { MatchState } from "../game/MatchState";
const { ccclass, property } = _decorator;

@ccclass("WinGameMenu")
export class WinGameMenu extends Component {
  @property(Label)
  playerTotal: Label;
  @property(Label)
  playerSword: Label;
  @property(Label)
  playerBow: Label;
  @property(Label)
  playerShield: Label;

  @property(Label)
  enemyTotal: Label;
  @property(Label)
  enemySword: Label;
  @property(Label)
  enemyBow: Label;
  @property(Label)
  enemyShield: Label;

  updateStatistic(matchState: any) {
    // const playerAll = this.node
    //   .getChildByPath("PlayerStatistic/AllTileNumber")
    //   ?.getComponent(Label);
    // const playerSword = this.node
    //   .getChildByPath("PlayerStatistic/Sword/SwordNumber")
    //   ?.getComponent(Label);
    // const playerBow = this.node
    //   .getChildByPath("PlayerStatistic/Bow/BowNumber")
    //   ?.getComponent(Label);
    // const playerShield = this.node
    //   .getChildByPath("PlayerStatistic/Shield/ShieldNumber")
    //   ?.getComponent(Label);

    // if (!playerAll || !playerSword || !playerBow || !playerShield) return;

    this.playerTotal.string = matchState.tilesNumber.toString();
    this.playerSword.string = matchState.swordNumber.toString();
    this.playerBow.string = matchState.bowNumber.toString();
    this.playerShield.string = matchState.shieldNumber.toString();

    // const enemyAll = this.node
    //   .getChildByPath("EnemyStatistic/AllTileNumber")
    //   ?.getComponent(Label);
    // const enemySword = this.node
    //   .getChildByPath("EnemyStatistic/Sword/SwordNumber")
    //   ?.getComponent(Label);
    // const enemyBow = this.node
    //   .getChildByPath("EnemyStatistic/Bow/BowNumber")
    //   ?.getComponent(Label);
    // const enemyShield = this.node
    //   .getChildByPath("EnemyStatistic/Shield/ShieldNumber")
    //   ?.getComponent(Label);

    // if (!enemyAll || !enemySword || !enemyBow || !enemyShield) return;

    this.enemyTotal.string = matchState.tilesNumber.toString();
    this.enemySword.string = matchState.swordNumber.toString();
    this.enemyBow.string = matchState.bowNumber.toString();
    this.enemyShield.string = matchState.shieldNumber.toString();
  }
}
