import { Component, Label, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LoseGameMenu")
export class LoseGameMenu extends Component {
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
    this.enemyTotal.string = matchState.tilesNumber.toString();
    this.enemySword.string = matchState.swordNumber.toString();
    this.enemyBow.string = matchState.bowNumber.toString();
    this.enemyShield.string = matchState.shieldNumber.toString();

    this.playerTotal.string = matchState.tilesNumber.toString();
    this.playerSword.string = matchState.swordNumber.toString();
    this.playerBow.string = matchState.bowNumber.toString();
    this.playerShield.string = matchState.shieldNumber.toString();
  }
}
