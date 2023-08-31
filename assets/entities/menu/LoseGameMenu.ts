import { Component, Label, _decorator } from "cc";
import { MatchState } from "../game/MatchState";
const { ccclass, property } = _decorator;

@ccclass("LoseGameMenu")
export class LoseGameMenu extends Component {
  private _matchState: MatchState;

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

  updateStatistic() {
    this.enemyTotal.string = this._matchState.tilesNumber.toString();
    this.enemySword.string = this._matchState.swordNumber.toString();
    this.enemyBow.string = this._matchState.bowNumber.toString();
    this.enemyShield.string = this._matchState.shieldNumber.toString();

    this.playerTotal.string = this._matchState.tilesNumber.toString();
    this.playerSword.string = this._matchState.swordNumber.toString();
    this.playerBow.string = this._matchState.bowNumber.toString();
    this.playerShield.string = this._matchState.shieldNumber.toString();
  }
}
