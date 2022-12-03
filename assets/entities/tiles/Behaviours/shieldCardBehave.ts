import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";

import { CardsSubBehaviour } from "./SubBehaviour";

export class ShieldCardSubehaviour extends CardsSubBehaviour {
  prepare(): boolean {
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();
    if (playerTag == null) return false;

    if (targetTile instanceof StdTileController) {
      if (targetTile.tileModel.containsTag(playerTag)) {
        return true;
      }
    } else {
      return false;
    }

    return false;
  }

  run(): boolean {
    const cardsService = this.parent.cardsService;
    const field = this.parent.field;
    if (cardsService == null) return false;
    if (field == null) return false;

    const tile = this.parent.target as StdTileController;
    const resultSet = new Set<TileController>();

    this.parent.fieldAnalizer?.findConnectedTiles(tile, resultSet);

    if (resultSet.size > 1) {
      let stdexists = false;
      resultSet.forEach((tile) => {
        if (tile instanceof StdTileController) {
          tile.activateShield(true);
          stdexists = true;
        }
      });

      if (stdexists) {
        return true;
      }
    }

    return false;
  }
}
