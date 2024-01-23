import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class ManeuverCardSubehaviour extends CardsSubBehaviour {
  private _tilesToManuv: TileController[] | undefined = [];
  private _tilesShufflePanic: TileController[] = [];
  private _tilesPanicCopy: TileController[] = [];
  private _cache: ObjectsCache | null;
  private countForEachSide = 2;

  prepare(): boolean {
    if (this.parent.cardService == null) return false;

    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 1;

    this._tilesToManuv = this.parent.field?.fieldMatrix.filter((tile) => {
      if (tile.tileModel.tileName != "berserk") {
        return tile.playerModel == this.parent.currentPlayerModel;
      }
    });

    if (!this._tilesToManuv) return false;

    this._tilesPanicCopy = this._tilesToManuv.slice();
    this._tilesShufflePanic = [];

    while (this._tilesPanicCopy.length > 0) {
      this.shuffleArray();
    }
    return true;
  }

  private shuffleArray() {
    const j = Math.floor(Math.random() * this._tilesPanicCopy.length);
    this._tilesShufflePanic.push(this._tilesPanicCopy[j]);
    this._tilesPanicCopy.splice(j, 1);
  }

  run(): boolean {
    this.parent.debug?.log("[maneuver_card_sub] Starting run.");

    const matrix = this.parent.field?.fieldMatrix;
    if (matrix == null) return false;
    if (!this._tilesToManuv) return false;

    for (let index = 0; index < this._tilesToManuv.length; index++) {
      const tile: TileController = matrix?.get(
        this._tilesToManuv[index].row,
        this._tilesToManuv[index].col
      );
      const tileChange: TileController = matrix?.get(
        this._tilesShufflePanic[index].row,
        this._tilesShufflePanic[index].col
      );

      this.parent.field?.exchangeTiles(tile, tileChange);
    }

    this.parent.debug?.log("[maneuver_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    this.parent.fieldViewController.moveTilesAnimate();
    this.parent.audioManager.playSoundEffect("maneuver");

    return true;
  }
}
