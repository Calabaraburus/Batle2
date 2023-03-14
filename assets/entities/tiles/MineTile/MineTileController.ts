//  MineTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2023
//
//  Author:Natalchishin Taras
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
import { GameManager } from "../../game/GameManager";
import { CardService } from "../../services/CardService";
const { ccclass, property } = _decorator;

@ccclass("MineTileController")
export class MineTileController extends TileController {
  private _cardService: CardService | null;
  start() {
    super.start();
    this._cardService = this.getService(CardService);
  }

  turnEnds(): void {
    if (this._cardService?.getOponentModel() == this.playerModel) {
      this.destroyTile();
    }
  }
}
