import { randomRangeInt, tween } from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";
import { AudioManager } from "../../../soundsPlayer/AudioManager";
import { ReadonlyMatrix2D } from "../../field/ReadonlyMatrix2D";

export class PanicCardSubehaviour extends CardsSubBehaviour {
  private _tilesToPanic: TileController[] = [];
  private _cache: ObjectsCache | null;
  protected powerCard = 1;
  private _targetTile: StdTileController;
  private _soundEffect: AudioManager | null;
  private maxCount: number;

  prepare(): boolean {
    const maxCountForEachSide = this.powerCard;
    this._targetTile = this.parent.target as StdTileController;

    if (this._targetTile instanceof StdTileController) {
      if (
        this._targetTile.playerModel ==
        this.parent.cardService.getCurrentPlayerModel()
      ) {
        return false;
      }
    } else {
      return false;
    }

    this.maxCount = 6;
    const matrix = this.parent.field?.fieldMatrix;
    this._cache = ObjectsCache.instance;
    this._tilesToPanic = [];
    let currentTile: TileController = this._targetTile;

    /* next code change near tiles from target tile

    this.parent.field?.fieldMatrix.forEachCol(
      this._targetTile.col,
      (tile, rowId) => {
        if (tile.playerModel == this.parent.currentOponentModel) {
          if (
            this._targetTile.row + maxCountForEachSide >= rowId &&
            this._targetTile.row - maxCountForEachSide <= rowId
          ) {
            this._tilesToPanic.push(tile);
          }
        }
      }
    );

    this.parent.field?.fieldMatrix.forEachInRow(
      this._targetTile.row,
      (tile, colId) => {
        if (tile.playerModel == this.parent.currentOponentModel) {
          if (
            this._targetTile.col + maxCountForEachSide >= colId &&
            this._targetTile.col - maxCountForEachSide <= colId
          ) {
            this._tilesToPanic.push(tile);
          }
        }
      }
    );
    */

    /* next code change tiles like worm card*/
    for (let index = 0; index < this.maxCount; index++) {
      const applicantsToDestroy: TileController[] = [];

      const ids = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];

      ids.forEach((i) =>
        this.getNearTile(
          matrix,
          applicantsToDestroy,
          currentTile.row + i[0],
          currentTile.col + i[1]
        )
      );

      if (applicantsToDestroy.length == 0) return true;
      currentTile =
        applicantsToDestroy[randomRangeInt(0, applicantsToDestroy.length)];
      this._tilesToPanic.push(currentTile);
    }

    return true;
  }

  private getNearTile(
    matrix: ReadonlyMatrix2D<TileController>,
    applicantsToDestroy: TileController[],
    row: number,
    col: number
  ) {
    if (row < matrix.rows && col < matrix.cols && row >= 0 && col >= 0) {
      const tile = matrix?.get(row, col);
      if (tile.playerModel == this.parent.cardService.getOponentModel()) {
        if (!this._tilesToPanic.some((t) => t == tile))
          applicantsToDestroy.push(tile);
      }
    }
  }

  run(): boolean {
    this.parent.debug?.log("[panic_card_sub] Starting run.");

    const tModel = this._targetTile.tileModel;

    if (tModel == undefined) {
      this.parent.debug?.log(
        "[panic_card_sub][error] panic model is null. return false."
      );
      return false;
    }

    const pModel = this.parent.cardService.getOponentModel();

    if (pModel == undefined || pModel == null) {
      this.parent.debug?.log(
        "[panic_card_sub][error] OponentPlayerModel is null or undefined." +
          " return false."
      );
      return false;
    }

    this._tilesToPanic.forEach((t) => {
      if (t.tileModel != this._targetTile.tileModel) {
        t.cacheDestroy();

        this.parent.field?.createTile({
          row: t.row,
          col: t.col,
          tileModel: tModel,
          playerModel: pModel,
          position: t.node.position,
          putOnField: true,
        });
      }
    });

    this.parent.debug?.log("[panic_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    this.parent.fieldViewController.moveTilesAnimate();
    this.parent.audioManager.playSoundEffect("panic");

    return true;
  }
}
