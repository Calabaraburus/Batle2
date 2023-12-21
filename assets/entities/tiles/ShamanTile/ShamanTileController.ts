//  MineTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2023
//

import { _decorator, Sprite, Prefab, Node, tween } from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { IAttackable } from "../IAttackable";
import { GameManager } from "../../game/GameManager";
import { CardService } from "../../services/CardService";
import { PlayerModel } from "../../../models/PlayerModel";
import { DataService } from "../../services/DataService";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { HealingEffect } from "../../effects/HealingEffect";
import { EffectsService } from "../../services/EffectsService";
import { AudioManagerService } from "../../../soundsPlayer/AudioManagerService";
import { Service } from "../../services/Service";
const { ccclass, property } = _decorator;

@ccclass("ShamanTileController")
export class ShamanTileController
  extends TileController
  implements IAttackable {
  private _cardService: CardService | null;
  private _curSprite: Sprite | null;
  private _state: TileState;
  private _attacksCountToDestroy: number;
  private _attackedNumber: number;
  private _aimForEffect: Node;
  private _cache: ObjectsCache | null;

  /** Destroy particle system */
  @property(Prefab)
  destroyPartycles: Prefab;
  private _effectsService: EffectsService | null;

  get attacksCountToDestroy() {
    return this._attacksCountToDestroy;
  }

  start() {
    super.start();
    this._cardService = Service.getService(CardService);
    this._effectsService = Service.getService(EffectsService);
    this._cache = ObjectsCache.instance;
  }

  turnEnds(): void {
    const playerModel = this._cardService?.getOponentModel();

    if (this._cardService?.getCurrentPlayerModel() != this.playerModel) {
      if (playerModel || playerModel != null) {
        if (playerModel.life < playerModel.lifeMax) {
          this.playEffect();
          Service.getService(AudioManagerService)?.playSoundEffect(
            "shaman_attack"
          );
          playerModel.life = playerModel.life + 5;
        }
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

  prepareForEffect() {
    if (this._aimForEffect != null) return;

    const tmpAim =
      this.playerModel != this.dataService?.playerModel
        ? this.dataService.enemyFieldController?.playerImage.node
        : this.dataService.playerFieldController?.playerImage.node;

    if (tmpAim == null) {
      throw Error("catapult effect aim is null");
    }

    this._aimForEffect = tmpAim;
  }

  playEffect() {
    this.prepareForEffect();

    const effect = this._cache?.getObject(HealingEffect);

    if (effect != null) {
      effect.node.position = this.node.position;
      effect.node.parent =
        this._effectsService != null ? this._effectsService?.effectsNode : null;

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
