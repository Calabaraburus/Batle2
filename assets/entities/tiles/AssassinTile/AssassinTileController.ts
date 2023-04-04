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
const { ccclass, property } = _decorator;

@ccclass("AssassinTileController")
export class AssassinTileController
  extends TileController
  implements IAttackable
{
  private _cardService: CardService | null;
  private _effectsService: EffectsService | null;
  private _curSprite: Sprite | null;
  private _state: TileState;
  private _attacksCountToDestroy: number;
  private _attackedNumber: number;
  private _cache: ObjectsCache | null;
  private _gameManager: GameManager | null;

  /** Destroy particle system */
  @property(Prefab)
  destroyPartycles: Prefab;
  maxCount: number;
  _tilesToDestroy: TileController[] | undefined;

  get attacksCountToDestroy() {
    return this._attacksCountToDestroy;
  }

  start() {
    super.start();
    this._cardService = this.getService(CardService);
    this._effectsService = this.getService(EffectsService);
    this.updateSprite();
    this._cache = ObjectsCache.instance;
    this._gameManager = this.getService(GameManager);
  }

  updateSprite() {
    this._curSprite = this.getComponent(Sprite);

    if (this._curSprite != null) {
      this._curSprite.spriteFrame = this.tileModel.sprite;
    }
  }

  turnEnds(): void {
    if (this._cardService?.getCurrentPlayerModel() != this.playerModel) {
      this.playEffect();
      this.maxCount = 2;
      this._tilesToDestroy = [];

      const oponentModel = this._cardService?.getCurrentPlayerModel();

      const oponentTiles = this.fieldController.fieldMatrix.filter((tile) => {
        return tile.playerModel == oponentModel;
      });

      for (let index = 0; index < this.maxCount; index++) {
        this._tilesToDestroy.push(
          oponentTiles[randomRangeInt(0, oponentTiles.length)]
        );
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

      this.fieldController.moveTilesLogicaly(this._gameManager?.playerTurn);
    }
  }

  public get state(): TileState {
    return this._state;
  }

  public setModel(tileModel: TileModel) {
    super.setModel(tileModel);

    this._attacksCountToDestroy = 1;

    this._attackedNumber = this.attacksCountToDestroy;

    this.updateSprite();
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

  public destroyTile() {
    this.createParticles();
    super.destroyTile();
  }

  private createParticles() {
    const ps = instantiate(this.destroyPartycles);
    ps.parent = this.node.parent;
    const ui = this.getComponent(UITransform);

    if (ui == null) {
      return;
    }

    ps.position = new Vec3(
      this.node.position.x + ui.contentSize.width / 2,
      this.node.position.y + ui.contentSize.height / 2,
      this.node.position.z
    );
  }

  playEffect() {
    console.log("fire wall effect");
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

    animator.delay(0.1).call(() => this.fieldController.moveTilesAnimate());
    // .delay(0.5)
    // .call(() => effects.forEach((e) => e.stopEmmit()))
    // .delay(5)
    // .call(() => effects.forEach((e) => e.cacheDestroy()));

    animator.start();
    return true;
  }
}
