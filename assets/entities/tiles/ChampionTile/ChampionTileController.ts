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
const { ccclass, property } = _decorator;

@ccclass("ChampionTileController")
export class ChampionTileController
  extends TileController
  implements IAttackable
{
  private _cardService: CardService;
  private _state: TileState;
  private _attacksCountToDestroy: number;
  private _attackedNumber: number;
  private _gameManager: GameManager;

  /** Destroy particle system */
  @property(Prefab)
  destroyPartycles: Prefab;
  maxCount: number;
  _tilesToDestroy: TileController[] | undefined;
  private _dataService: DataService;
  _fieldViewController: FieldController;

  get attacksCountToDestroy() {
    return this._attacksCountToDestroy;
  }

  start() {
    super.start();
    this._cardService = Service.getServiceOrThrow(CardService);
    this._dataService = Service.getServiceOrThrow(DataService);
    this._gameManager = Service.getServiceOrThrow(GameManager);
    this._fieldViewController = Service.getServiceOrThrow(FieldController);
    this.updateSprite();
  }

  turnEnds(): void {
    if (this._cardService?.getCurrentPlayerModel() != this.playerModel) {
      this.playEffect();

      this.maxCount = 2;
      this._tilesToDestroy = [];

      const oponentModel = this._cardService?.getCurrentPlayerModel();
      const matrix = this.fieldController.fieldMatrix;
      let vectorAttack = 1;

      if (this.playerModel == this._dataService.botModel) {
        vectorAttack = -1;
      }

      for (let index = 0; index < this.maxCount; index++) {
        const enemyTile = matrix.get(this.row + vectorAttack, this.col);
  
        if (enemyTile.playerModel == oponentModel) {
          Service.getServiceOrThrow(AudioManagerService).playSoundEffect(
            "berserk_attack"
          );
        }

        if (!enemyTile) return;
        this._tilesToDestroy.push(enemyTile);
      }

      if (oponentModel || oponentModel != null) {
        this._tilesToDestroy.forEach((t) => {
          if (isIAttackable(t)) {
            (<IAttackable>t).attack(1);
          } else {
            this.fieldController.destroyTile(t.row, t.col, (t) => {
              return t.playerModel !== this.playerModel;
            });
          }
        });
      }
      this.fieldController.moveTilesLogicaly(this._gameManager.playerTurn);
    }
  }

  public get state(): TileState {
    return this._state;
  }

  public setModel(tileModel: TileModel) {
    super.setModel(tileModel);

    this._attacksCountToDestroy = 2;

    this._attackedNumber = this.attacksCountToDestroy;
  }

  public cacheCreate(): void {
    super.cacheCreate();

    this._attackedNumber = this.attacksCountToDestroy;
  }

  /** Attack this enemy with power.
   * @power Power.
   */
  public attack(power = 1) {
    if (this._attackedNumber > 0) {
      this._attackedNumber -= power;

      if (this._attackedNumber <= 0) {
        this.fakeDestroy();
      }
    }
  }

  playEffect() {
    console.log("berserk effect");

    const timeObj = { time: 0 };
    const animator = tween(timeObj);
    const effects: CardEffect[] = [];
    // this._tilesToDestroy?.forEach((t, i) => {
    //   const time = 0.1;
    //   animator.delay(i == 0 ? 0 : time).call(() => {
    // const effect =
    //   this._cache?.getObjectByPrefabName<CardEffect>("firewallEffect");
    // if (effect == null) {
    //   return;
    // }

    // effect.node.position = t.node.position;
    // effect.node.parent =
    //   this._effectsService != null
    //     ? this._effectsService?.effectsNode
    //     : null;
    // effect.play();

    // effects.push(effect);
    //   });
    // });

    animator
      .delay(0.2)
      .call(() => this._fieldViewController.moveTilesAnimate());
    // .delay(0.5)
    // .call(() => effects.forEach((e) => e.stopEmmit()))
    // .delay(5)
    // .call(() => effects.forEach((e) => e.cacheDestroy()));

    animator.start();
    return true;
  }
}
