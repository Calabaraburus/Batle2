import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class TeleportCardSubehaviour extends CardsSubBehaviour {
  private _cache: ObjectsCache | null;
  private tile: TileController | null = null;
  private tileSecond: TileController | null = null;

  prepare(): boolean {
    if (this.tile == null) {
      this.tile = this.parent.target as StdTileController;
      const playerTag = this.parent.cardsService?.getPlayerTag();
      if (playerTag == null) return false;
      if (this.parent.cardsService == null) return false;

      if (this.tile instanceof StdTileController) {
        if (this.tile.tileModel.containsTag(playerTag)) {
          return false;
        }
      } else {
        return false;
      }
      return false;
    } else {
      this.tileSecond = this.parent.target as StdTileController;
      const playerTag = this.parent.cardsService?.getPlayerTag();
      if (playerTag == null) return false;
      if (this.parent.cardsService == null) return false;

      if (this.tileSecond instanceof StdTileController) {
        if (this.tileSecond.tileModel.containsTag(playerTag)) {
          return false;
        }
      } else {
        return false;
      }

      this._cache = ObjectsCache.instance;
      this.effectDurationValue = 1;

      return true;
    }
  }

  run(): boolean {
    if (this.tile != null && this.tileSecond != null) {
      this.parent.field?.exchangeTiles(this.tile, this.tileSecond);
    }
    this.tile = null;
    this.tileSecond = null;

    return true;
  }

  effect(): boolean {
    this.parent.field?.moveTilesAnimate();

    this.parent.audio.playSoundEffect("teleport");

    return true;
  }
}
