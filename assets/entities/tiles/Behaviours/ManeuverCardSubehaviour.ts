import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class ManeuverCardSubehaviour extends CardsSubBehaviour {
  private _tilesToPanic: TileController[] = [];
  private _tilesShufflePanic: TileController[] = [];
  private _tilesPanicCopy: TileController[] = [];
  private _cache: ObjectsCache | null;
  private countForEachSide = 2;

  prepare(): boolean {
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();
    const enemyTag = this.parent.cardsService?.getOponentTag();

    if (playerTag == null || enemyTag == null) return false;
    if (this.parent.cardsService == null) return false;

    if (targetTile instanceof StdTileController) {
      if (targetTile.tileModel.containsTag(enemyTag)) {
        return false;
      }
    } else {
      return false;
    }

    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 1;
    this._tilesToPanic = [];
    const currentTile: TileController = targetTile;

    // list with columns index
    const ids = [-1, 0, 1];

    ids.forEach((i) =>
      this.completFieldOfTiles(currentTile, currentTile.col + i)
    );

    this._tilesPanicCopy = this._tilesToPanic.slice();
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

  // get tile and col to complete panic list
  private completFieldOfTiles(currentTile: TileController, targetCol: number) {
    this.parent.field?.fieldMatrix.forEachCol(targetCol, (tile, rowId) => {
      if (this.parent.cardsService == null) return;
      if (tile.tileModel.containsTag(this.parent.cardsService.getPlayerTag())) {
        if (
          currentTile.row + this.countForEachSide >= rowId &&
          currentTile.row - this.countForEachSide <= rowId
        ) {
          this._tilesToPanic.push(tile);
        }
      }
    });
  }

  run(): boolean {
    this.parent.debug?.log("[maneuvertotem_card_sub] Starting run.");

    const matrix = this.parent.field?.fieldMatrix;
    if (matrix == null) return false;

    for (let index = 0; index < this._tilesToPanic.length; index++) {
      const tile: TileController = matrix?.get(
        this._tilesToPanic[index].row,
        this._tilesToPanic[index].col
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
    this.parent.field?.moveTilesAnimate();

    return true;
  }
}
