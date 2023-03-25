//  StdTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  _decorator,
  Sprite,
  SpriteFrame,
  Vec3,
  instantiate,
  Prefab,
  UITransform,
  Node,
} from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { CardService } from "../../services/CardService";
const { ccclass, property } = _decorator;

@ccclass("StdTileController")
export class StdTileController extends TileController {
  private _curSprite: Sprite | null;
  private _state: TileState;
  private _shieldIsActivated: boolean;

  /** Destroy particle system */
  @property(Prefab)
  destroyPartycles: Prefab;

  @property(Node)
  shieldSprite: Node;
  private _cardService: CardService | null;

  get shieldIsActivated() {
    return this._shieldIsActivated;
  }

  start() {
    super.start();

    this._cardService = this.getService(CardService);
  }

  public get state(): TileState {
    return this._state;
  }

  public activateShield(activate: boolean) {
    this._shieldIsActivated = activate;
    this.shieldSprite.active = activate;
  }

  public destroyTile() {
    this.createParticles();
    super.destroyTile();
  }

  turnEnds(): void {
    if (
      this._shieldIsActivated &&
      this._cardService?.getOponentModel() == this.playerModel
    ) {
      this.activateShield(false);
    }
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
