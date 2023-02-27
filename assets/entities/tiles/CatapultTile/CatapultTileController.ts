//  StdTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { _decorator, Sprite, Vec3, instantiate, Prefab, UITransform } from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { IAttackable } from "../IAttackable";
import { CardService } from "../../services/CardService";
import { Service } from "../../services/Service";
import { GameManager } from "../../game/GameManager";
const { ccclass, property } = _decorator;

@ccclass("CatapultTileController")
export class CatapultTileController
  extends TileController
  implements IAttackable
{
  private _curSprite: Sprite | null;
  private _state: TileState;
  private _attacksCountToDestroy: number;
  private _attackedNumber: number;
  private service = new Service();

  /** Destroy particle system */
  @property(Prefab)
  destroyPartycles: Prefab;

  get attacksCountToDestroy() {
    return this._attacksCountToDestroy;
  }

  start() {
    super.start();
    this.updateSprite();
  }

  updateSprite() {
    this._curSprite = this.getComponent(Sprite);

    if (this._curSprite != null) {
      this._curSprite.spriteFrame = this.tileModel.sprite;
    }
  }

  public attackOponent() {
    const _cardService = this.service.getService(CardService);
    const lifeOponent = _cardService?.getOponentModel()?.life;

    const _gameManager = this.service.getService(GameManager);
    const endTurn = _gameManager?.endTurn();
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
