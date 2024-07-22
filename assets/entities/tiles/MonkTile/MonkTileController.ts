//  MineTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2023
//

import {
  _decorator,
  Sprite,
  Vec3,
  instantiate,
  Prefab,
  UITransform,
  randomRangeInt,
  tween,
  CCFloat
} from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { IAttackable, isIAttackable } from "../IAttackable";
import { GameManager } from "../../game/GameManager";
import { CardService } from "../../services/CardService";
import { PlayerModel } from "../../../models/PlayerModel";
import { FieldController } from "../../field/FieldController";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { EffectsService } from "../../services/EffectsService";
import { AudioManagerService } from "../../../soundsPlayer/AudioManagerService";
import { Service } from "../../services/Service";
import { DataService } from "../../services/DataService";
import { EffectsManager } from "../../game/EffectsManager";
import { LifeIndicator_v2 } from "../LifeIndicator_v2";
const { ccclass, property } = _decorator;

@ccclass("MonkTileController")
export class MonkTileController
  extends TileController
  implements IAttackable {
  private _cardService: CardService;
  private _state: TileState;
  private _gameManager: GameManager;

  private _dataService: DataService;
  private _fieldViewController: FieldController;
  private _effectsManager: EffectsManager;
  private _audio: AudioManagerService;
  private _curLife: number;

  @property(CCFloat)
  public Life: number = 6;
  private _lifeIndicator: LifeIndicator_v2 | null;
  private _created = true;
  start() {
    super.start();
    this.isFixed = true;
    this._cardService = Service.getServiceOrThrow(CardService);
    this._dataService = Service.getServiceOrThrow(DataService);
    this._gameManager = Service.getServiceOrThrow(GameManager);
    this._fieldViewController = Service.getServiceOrThrow(FieldController);
    this._effectsManager = Service.getServiceOrThrow(EffectsManager);
    this._audio = Service.getServiceOrThrow(AudioManagerService);
    this._lifeIndicator = this.getComponentInChildren(LifeIndicator_v2);
    this.updateSprite();
    this.setLife();
    this._created = true;
  }

  setLife() {
    this._curLife = this.Life;

    if (this._lifeIndicator) {
      this._lifeIndicator.activeLifes = this.Life;
      this._lifeIndicator.maxLifes = this.Life;
    }
  }

  turnBegins(): void {
    if (this._created) {
      this._created = false;
      return;
    }

    if (this._cardService?.getCurrentPlayerModel() != this.playerModel) {
      this.moveMonk();
    } else {
      this.tryToAttackMonk();
    }
  }

  tryToAttackMonk() {
    const prev = this.fieldController.fieldMatrix.get(this.row + 1, this.col);
    const nxt = this.fieldController.fieldMatrix.get(this.row + 1, this.col);

    if (prev.playerModel == nxt.playerModel && prev.playerModel != this.playerModel) {
      this.attack(1);
    }
  }

  moveMonk() {

    let vectorAttack = 1;

    if (this.playerModel == this._dataService.botModel) {
      vectorAttack = -1;
    }

    if ((this.row + vectorAttack) == this.fieldController.getEndTile(this.col)?.row) {
      this.destroyMonk();
    } else {
      const matrix = this.fieldController.fieldMatrix;

      const aimTile = matrix.get(this.row + vectorAttack, this.col);

      if (!aimTile) {
        return;
      }

      this._effectsManager.PlayEffectNow(() => this.playEffect1(aimTile), 0.6);

      this.exchangeTile(aimTile);

      this.fieldController.moveTilesLogicaly(this._gameManager.playerTurn);
      this.fieldController.fixTiles();
    }
  }

  destroyMonk() {
    this.fakeDestroy();

    this.fieldController.moveTilesLogicaly(this._gameManager.playerTurn);
    this.fieldController.fixTiles();
  }

  exchangeTile(aimTile: TileController) {
    this.fieldController.exchangeTiles(aimTile, this);
  }

  public get state(): TileState {
    return this._state;
  }

  public cacheCreate(): void {
    super.cacheCreate();

    this.setLife();

    this._created = true;
  }

  public setModel(tileModel: TileModel) {
    super.setModel(tileModel);

    this.setLife();

    this._created = true;
  }

  /** Attack this enemy with power.
   * @power Power.
   */
  public attack(power = 1) {
    this._curLife -= power;

    if (this._curLife < 0) {
      this.destroyMonk();
    } else {
      if (this._lifeIndicator)
        this._lifeIndicator.activeLifes = this._curLife;
    }
  }

  playEffect1(aimTile: TileController) {
    console.log("monk effect");

    const timeObj = { time: 0 };
    const animator = tween(timeObj);

    //      this._audio.playSoundEffect(
    //        "berserk_attack"
    //      );

    animator
      .delay(0.2)
      .call(() => this._fieldViewController.moveTilesAnimate());

    animator.start();
    return true;
  }
}
