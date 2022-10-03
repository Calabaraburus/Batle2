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

  get shieldIsActivated() {
    return this._shieldIsActivated;
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

  public get state(): TileState {
    return this._state;
  }

  public activateShield(activate: boolean) {
    this._shieldIsActivated = activate;
    this.shieldSprite.active = activate;
  }

  public setModel(tileModel: TileModel) {
    super.setModel(tileModel);
    this.updateSprite();
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
