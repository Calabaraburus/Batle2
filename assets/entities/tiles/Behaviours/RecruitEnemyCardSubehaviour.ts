import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class RecruitEnemyCardSubehaviour extends CardsSubBehaviour {
  private _tilesToRecruit: TileController[] = [];
  private _cache: ObjectsCache | null;
  private countForEachSide = 1;

  prepare(): boolean {
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();
    const matrix = this.parent.field?.fieldMatrix;
    if (playerTag == null) return false;
    if (this.parent.cardsService == null) return false;

    if (!matrix) return false;
    if (
      matrix.get(targetTile.row - 1, targetTile.col).tileModel.getTags() ==
      targetTile.tileModel.getTags()
    )
      return false;
    if (targetTile instanceof StdTileController) {
      if (targetTile.tileModel.containsTag(playerTag)) {
        return false;
      }
    } else {
      return false;
    }

    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 1;
    this._tilesToRecruit = [];
    const currentTile: TileController = targetTile;

    this._tilesToRecruit.push(currentTile);

    matrix.forEachCol(targetTile.col, (tile, colId) => {
      if (this.parent.cardsService == null) return;
      if (
        tile.tileModel.containsTag(this.parent.cardsService.getOponentTag())
      ) {
        const rnd = Math.floor(Math.random() * 2);
        if (rnd == 0) {
          this._tilesToRecruit.push(tile);
        } else return true;
      }
    });

    return true;
  }

  run(): boolean {
    this._tilesToRecruit.forEach((tile) => {
      tile.destroyTile();

      this.parent.field?.createTile({
        row: tile.row,
        col: tile.col,
        tileModel: tile.tileModel,
        position: tile.node.position,
        putOnField: true,
      });
    });

    return true;
  }

  effect(): boolean {
    this.parent.field?.moveTilesAnimate();

    return true;
  }
}
