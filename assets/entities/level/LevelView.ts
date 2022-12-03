//  LevelView.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Button, CCFloat, Component, Label, Node, Vec3, _decorator } from "cc";
import { LevelModel } from "../../models/LevelModel";
import { ILevelView } from "./ILevelView";
import { LevelController } from "./LevelController";
const { ccclass, property } = _decorator;

@ccclass("LevelView")
export class LevelView extends Component implements ILevelView {
  Bonus1Price: number;
  Bonus2Price: number;
  Bonus3Price: number;
  //#region Privates

  private _model: LevelModel;
  private _controller: LevelController;
  private _aimPoints = 0;
  private _enemyMaxLife = 0;
  private _playerMaxLife = 0;
  private _pointsCount = 0;

  //#endregion

  //#region Cocos properties

  /** Turns count label */
  @property({ type: Label })
  turnsCountLbl: Label;

  /** Points count label */
  @property({ type: Label })
  pointsCountLbl: Label;

  /** bonus price 3 label */
  @property({ type: Label })
  enemyLifeLbl: Label;

  /** bonus price 3 label */
  @property({ type: Label })
  playerLifeLbl: Label;

  /** Player life line node */
  @property({ type: Node })
  playerLifeLine: Node;

  /** Enemy life line node */
  @property({ type: Node })
  enemyLifeLine: Node;

  /** Win block */
  @property({ type: Node })
  winBlock: Node;

  /** Lose block */
  @property({ type: Node })
  loseBlock: Node;

  /** Object wich lock interctions with field */
  @property({ type: Button })
  touchLockObject: Button;

  /** Load line min pos */
  @property({ type: CCFloat })
  loadLineZeroPos = 0;

  /** Load line max pos */
  @property({ type: CCFloat })
  loadLineEndPos = 1;

  //#endregion

  //#region IListView

  public get TurnsCount(): number {
    return Number(this.turnsCountLbl.string);
  }
  public set TurnsCount(value: number) {
    this.turnsCountLbl.string = value.toString();
  }

  public get AimPoints(): number {
    return this._aimPoints;
  }
  public set AimPoints(value: number) {
    this._aimPoints = value;
  }

  public get PointsCount(): number {
    return Number(this.pointsCountLbl.string);
  }
  public set PointsCount(value: number) {
    this.pointsCountLbl.string = value.toString();
    this._pointsCount = value;
  }

  public get EnemyLife(): number {
    return Number(this.enemyLifeLbl.string);
  }

  public set EnemyLife(value: number) {
    this.updateLifeLinePos(this.enemyLifeLine, value, this._enemyMaxLife);
    this.enemyLifeLbl.string = value.toString();
  }

  public get EnemyMaxLife(): number {
    return this._enemyMaxLife;
  }

  public set EnemyMaxLife(value: number) {
    this._enemyMaxLife = value;
  }

  public get PlayerLife(): number {
    return Number(this.playerLifeLbl.string);
  }

  public set PlayerLife(value: number) {
    this.updateLifeLinePos(this.playerLifeLine, value, this._playerMaxLife);
    this.playerLifeLbl.string = value.toString();
  }

  public get PlayerMaxLife(): number {
    return this._playerMaxLife;
  }

  public set PlayerMaxLife(value: number) {
    this._playerMaxLife = value;
  }

  public showWin(show: boolean) {
    this.winBlock.active = show;
  }

  public showLose(show: boolean) {
    this.loseBlock.active = show;
  }

  //#endregion

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pause(show: boolean): void {
    throw new Error("This method is abstract");
  }

  public bonusBtnClick(bonusName: string) {
    this._controller.setBonus(bonusName);
  }

  public lockTuch(lock: boolean) {
    this.touchLockObject.node.active = lock;
  }

  public resetGame() {
    this.showWin(false);
    this.showLose(false);
    this._controller.resetGame();
  }

  public setController(controller: LevelController): void {
    this._controller = controller;
  }

  private updateLifeLinePos(line: Node, value: number, maxValue: number) {
    const coef = (this.loadLineEndPos - this.loadLineZeroPos) / maxValue;

    line.position = new Vec3(
      coef * value + this.loadLineZeroPos,
      line.position.y,
      line.position.z
    );
  }
}
