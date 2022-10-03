//  LevelController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, Game, Node, _decorator } from "cc";
import { BonusModel } from "../../models/BonusModel";
import { LevelModel } from "../../models/LevelModel";
import { PlayerModel } from "../../models/PlayerModel";
import { EnemyFieldController } from "../enemyField/EnemyFieldController";
import { AnalizedData } from "../field/AnalizedData";
import { FieldController } from "../field/FieldController";
import { GameManager } from "../game/GameManager";
import { PlayerFieldController } from "../playerField/PlayerFieldController";
import { ILevelView } from "./ILevelView";
import { LevelView } from "./LevelView";
const { ccclass, property } = _decorator;

/** Controls level view. */
@ccclass("LevelController")
export class LevelController extends Component {
  private _turnsCount: number;
  private _gameManager: GameManager;

  /** Level view */
  @property({ type: LevelView })
  view: ILevelView;

  /** Level model */
  @property({ type: LevelModel })
  model: LevelModel;

  /** Field Controller */
  @property({ type: FieldController })
  fieldController: FieldController;

  /** Player model */
  @property({ type: PlayerModel })
  playerModel: PlayerModel;

  /** Bot model */
  @property({ type: PlayerModel })
  botModel: PlayerModel;

  @property(PlayerFieldController)
  playerField: PlayerFieldController;

  @property(EnemyFieldController)
  enemyField: EnemyFieldController;

  /** Game manager */
  set gameManager(manager: GameManager) {
    this._gameManager = manager;
  }

  start() {
    this.view.setController(this);
    this._turnsCount = this.model.turnsCount;

    this.playerField.playerModel = this.playerModel;
    this.enemyField.playerModel = this.botModel;

    this.updateData();
  }

  public showWinView(show: boolean) {
    this.view.showWin(show);
  }

  public showLoseView(show: boolean) {
    this.view.showLose(show);
  }

  public lockTuch(lock: boolean) {
    this.view.lockTuch(lock);
  }

  public updateData() {
    this.view.AimPoints = this.model.aimPoints;
    this.view.TurnsCount = this.model.turnsCount;
    this.view.PointsCount = this.model.pointsCount;
    this.view.Bonus1Price = this.model.bonus1Price;
    this.view.Bonus2Price = this.model.bonus2Price;
    this.view.Bonus3Price = this.model.bonus3Price;
    this.view.PlayerLife = this.playerModel.life;
    this.view.EnemyLife = this.botModel.life;
    this.view.PlayerMaxLife = this.playerModel.lifeMax;
    this.view.EnemyMaxLife = this.botModel.lifeMax;

    this.playerField.updateData();
    this.enemyField.updateData();
  }

  public resetGame() {
    this.model.pointsCount = 0;
    this.model.turnsCount = this._turnsCount;

    this.updateData();

    this.fieldController.Reset();
  }

  public setBonus(name: string) {
    const bonus = new BonusModel();
    bonus.price = 15;
    // bonus.type = this.fieldController.fieldModel.getTileModel("bomb");
    this.fieldController.setBonus(bonus);
  }
}
