//  MineTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2023
//

import { _decorator, Sprite, Vec3, instantiate, Prefab, UITransform } from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { IAttackable } from "../IAttackable";
import { GameManager } from "../../game/GameManager";
import { CardService } from "../../services/CardService";
import { PlayerModel } from "../../../models/PlayerModel";
const { ccclass, property } = _decorator;

@ccclass("ShamanTileController")
export class ShamanTileController
  extends TileController
  implements IAttackable
{
  private _cardService: CardService | null;
  private _curSprite: Sprite | null;
  private _state: TileState;
  private _attacksCountToDestroy: number;
  private _attackedNumber: number;

  /** Destroy particle system */
  @property(Prefab)
  destroyPartycles: Prefab;

  get attacksCountToDestroy() {
    return this._attacksCountToDestroy;
  }

  start() {
    super.start();
    this._cardService = this.getService(CardService);
    this.updateSprite();
  }

  updateSprite() {
    this._curSprite = this.getComponent(Sprite);

    if (this._curSprite != null) {
      this._curSprite.spriteFrame = this.tileModel.sprite;
    }
  }

  turnEnds(): void {
    const playerModel = this._cardService?.getCurrentPlayerModel();

    if (this._cardService?.getCurrentPlayerModel() == this.playerModel) {
      if (playerModel || playerModel != null) {
        if (playerModel.life < 100) {
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
}
