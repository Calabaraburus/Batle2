//  MineTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2023
//

import { _decorator, Sprite, tween, Node, error, assert } from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { IAttackable } from "../IAttackable";
import { CardService } from "../../services/CardService";
import { EffectsService } from "../../services/EffectsService";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { BalistaCardEffect } from "../../effects/BalistaCardEffect";
import { DataService } from "../../services/DataService";
import { LevelView } from "../../level/LevelView";
import { PlayerModel } from "../../../models/PlayerModel";
import { AudioManagerService } from "../../../soundsPlayer/AudioManagerService";
import { Service } from "../../services/Service";
const { ccclass, property } = _decorator;

@ccclass("CatapultTileController")
export class CatapultTileController
  extends TileController
  implements IAttackable {
  private _cardService: CardService;
  private _state: TileState;
  private _attacksCountToDestroy: number;
  private _attackedNumber: number;
  private _effectsService: EffectsService;
  private _cache: ObjectsCache;
  private _dataService: DataService;
  private _aimForEffect: Node;
  get attacksCountToDestroy() {
    return this._attacksCountToDestroy;
  }

  start(): void {
    super.start();
    this.prepare();
    this.prepareForEffect();
    this.rotateToEnemy(this._aimForEffect);
  }

  prepare() {
    this._cardService = Service.getServiceOrThrow(CardService);
    this._effectsService = Service.getServiceOrThrow(EffectsService);

    assert(ObjectsCache.instance != null, "Cache can't be null");
    this._cache = ObjectsCache.instance;
    this._dataService = Service.getServiceOrThrow(DataService);
  }

  rotateToEnemy(enemy: Node) {
    const dir = enemy.position.clone().subtract(this.node.position).y;

    const foregroundNode = this.node.getChildByName("Foreground");

    if (foregroundNode == null) throw Error("Foreground node is null");

    foregroundNode.angle = dir >= 0 ? 0 : 180;
  }

  turnEnds(): void {
    const damageModel = this._cardService?.getCurrentPlayerModel();

    if (this._cardService?.getCurrentPlayerModel() != this.playerModel) {
      if (damageModel || damageModel != null) {
        this.playEffect();
        Service.getServiceOrThrow(AudioManagerService).playSoundEffect(
          "catapult_attack"
        );
        damageModel.life = damageModel.life - 5;
      }
    }
  }

  public get state(): TileState {
    return this._state;
  }

  public setModel(tileModel: TileModel) {
    super.setModel(tileModel);

    this._attacksCountToDestroy = 1;

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
        this.destroyTile();
      }
    }
  }

  prepareForEffect() {
    if (this._aimForEffect != null) return;

    const tmpAim =
      this.playerModel == this._dataService?.playerModel
        ? this._dataService?.enemyFieldController?.playerImage.node
        : this._dataService?.playerFieldController?.playerImage.node;

    if (tmpAim == null) {
      throw Error("catapult effect aim is null");
    }

    this._aimForEffect = tmpAim;
  }

  playEffect() {
    this.prepareForEffect();

    const effect = this._cache?.getObjectByName<BalistaCardEffect>("BalistaCardEffect");

    if (effect != null) {
      effect.node.position = this.node.position;
      effect.node.parent =
        this._effectsService != null ? this._effectsService?.effectsNode : null;

      effect.aim = this._aimForEffect;

      effect.play();

      const animator = tween(effect.node);

      animator
        .to(0.8, { position: this._aimForEffect.position })
        .delay(0.8)
        .call(() => effect.stopEmmit())
        .delay(1)
        .call(() => effect.cacheDestroy());

      animator.start();
    }
  }
}
