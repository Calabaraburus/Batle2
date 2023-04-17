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
  Vec2,
  Quat,
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
import { ShootEffect } from "../../effects/ShootEffect";
import { Line } from "../../effects/Line";
import { ShootSmokeEffect } from "../../effects/shootSmokeEffect";
import { Service } from "../../services/Service";
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
  private _shootEffect: ShootEffect | null;

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
    this._shootEffect = this.getService(ShootEffect);
  }

  turnEnds(): void {
    if (this._cardService?.getCurrentPlayerModel() != this.playerModel) {
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
      this.playEffect();
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
        this.destroyTile();
      }
    }
  }

  playEffect() {
    console.log("fire wall effect");

    if (this._tilesToDestroy == null) return;

    this._shootEffect?.makeShoots(
      this._tilesToDestroy.map<Line>(
        (t) =>
          new Line(
            new Vec2(this.node.position.x, this.node.position.y),
            new Vec2(t.node.position.x, t.node.position.y)
          )
      )
    );

    const timeObj = { time: 0 };
    const animator = tween(timeObj);

    const effects: CardEffect[] = [];

    this._tilesToDestroy.forEach((t) => {
      let dir: Vec3 = new Vec3();
      dir = Vec3.subtract(dir, this.node.position, t.node.position);
      //= Vec2.signAngle(dir.normalize(), Vec3.UP);
      const vec: Vec2 = new Vec2(dir.x, dir.y).normalize();
      const angle = -vec.signAngle(new Vec2(0, 1));

      // const dd = Vec3.distance(this.node.position, t.node.position) / 10;

      for (let index = 0; index < 10; index++) {
        const smokeEffect = this._cache?.getObject(ShootSmokeEffect);

        if (smokeEffect == null) {
          return;
        }

        smokeEffect.rotate(angle);

        smokeEffect.node.parent =
          this._effectsService != null
            ? this._effectsService?.effectsNode
            : null;

        smokeEffect.node.position = Vec3.lerp(
          smokeEffect.node.position,
          t.node.position,
          this.node.position,
          index * (1 / 10)
        );

        smokeEffect.play();
        effects.push(smokeEffect);
      }
    });

    animator
      .delay(0.5)
      .call(() => this.fieldController.moveTilesAnimate())
      .delay(1)
      .call(() => effects.forEach((e) => e.cacheDestroy()))
      .start();

    return true;
  }
}
