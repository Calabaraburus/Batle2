import { assert, randomRange, randomRangeInt } from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";
import { AnimationEffect } from "../../effects/AnimationEffect";
import { IAttackable, isIAttackable } from "../IAttackable";

/**
 * Co
 * 
 */
export class CounterattackCardSubehaviour extends CardsSubBehaviour {
  private _cache: ObjectsCache;
  private _tilesToDestroy: TileController[];
  private _rndColumns: number[] = [];

  prepare(): boolean {

    this.effectDurationValue = .8;

    const matrix = this.parent.field.fieldMatrix;


    let vectorPuch = -1;

    if (!this.parent.gameState.isPlayerTurn) {
      vectorPuch = 1;
    }

    let targetRow = this.parent.fieldExt.getFirstTileInColumnByTag();

    this._tilesToDestroy = [];

    matrix.forEachInRow(targetRow, (tile, colId) => {
      if (this._rndColumns.indexOf(tile.col) > -1) {
        if (tile.playerModel == this.parent.cardService.getOponentModel()) {
          if (tile instanceof StdTileController) {
            !tile.shieldIsActivated;
            this._tilesToDestroy?.push(tile);
          }
        }
        const nextTile = matrix.get(tile.row + vectorPuch, tile.col);
        if (
          nextTile.playerModel == this.parent.cardService.getOponentModel()
        ) {
          if (tile instanceof StdTileController) {
            !tile.shieldIsActivated;
            this._tilesToDestroy?.push(nextTile);
          }
        }
      }
    });

    assert(ObjectsCache.instance, "Cache is null");

    this._cache = ObjectsCache.instance;

    return true;
  }

  run(): boolean {
    if (!this._tilesToDestroy) return false;
    this._tilesToDestroy.forEach((tile) => {
      console.log(tile.row);
      console.log(tile.col);
      console.log("-----");
      if (isIAttackable(tile)) {
        (<IAttackable>tile).attack(1);
      } else {
        this.parent.field?.fakeDestroyTile(tile);
      }
    });

    return true;
  }

  effect(): boolean {
    this.parent.debug?.log("[push_card_sub] Start effect.");
    const curPlayer = this.parent.cardService.getCurrentPlayerModel();

    this.parent.audioManager.playSoundEffect("motivate");

    this._matrix.forEach((tile) => {
      if (tile.playerModel != curPlayer) return;

      const effect =
        this._cache?.getObjectByPrefabName<AnimationEffect>("motivateEffect");

      if (effect == null) {
        return false;
      }
      effect.node.parent = tile.node.parent;
      effect.node.position = tile.node.position;
      effect.node.scale = tile.node.scale;
      effect.play();
    });

    this.parent.debug?.log("[push_card_sub] End effect.");

    return true;
  }
}
