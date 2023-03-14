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

import { _decorator, tween } from "cc";
import { TileController } from "../TileController";
import { CardService } from "../../services/CardService";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { EffectsService } from "../../services/EffectsService";
import { GameManager } from "../../game/GameManager";
const { ccclass, property } = _decorator;

@ccclass("MineTileController")
export class MineTileController extends TileController {
  private _cardService: CardService | null;
  private _effectsService: EffectsService | null;
  private _cache: ObjectsCache | null;
  private _gameManager: GameManager | null;

  start() {
    super.start();
    this.attackPower = 0;
    this._cardService = this.getService(CardService);
    this._effectsService = this.getService(EffectsService);
    this._gameManager = this.getService(GameManager);
    this._cache = ObjectsCache.instance;
  }

  turnEnds(): void {
    if (this._cardService?.getOponentModel() == this.playerModel) {
      this.playEffect();
      this.destroyTile();

      this.destroyOtherTile(this.row - 1, this.col);
      this.destroyOtherTile(this.row, this.col - 1);
      this.destroyOtherTile(this.row + 1, this.col);
      this.destroyOtherTile(this.row, this.col + 1);

      this.fieldController.moveTilesLogicaly(this._gameManager?.playerTurn);
    }
  }

  private destroyOtherTile(row: number, col: number) {
    this.fieldController.destroyTile(row, col, (t) => {
      return t.playerModel !== this.playerModel;
    });
  }

  playEffect() {
    const effect =
      this._cache?.getObjectByPrefabName<CardEffect>("explosionEffect");

    if (effect != null) {
      effect.node.position = this.node.position;
      effect.node.parent =
        this._effectsService != null ? this._effectsService?.effectsNode : null;
      effect.play();

      const timeObj = { time: 0 };
      const animator = tween(timeObj);

      animator
        .delay(0.5)
        .call(() => this.fieldController.moveTilesAnimate())
        .delay(0.3)
        .call(() => effect.stopEmmit())
        .delay(5)
        .call(() => effect.cacheDestroy());

      animator.start();
    }
  }
}
