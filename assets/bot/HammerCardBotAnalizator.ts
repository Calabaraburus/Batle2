import { random } from "cc";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { CardAnalizator } from "./CardAnalizator";

export class HammerCardBotAnalizator extends CardAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.8;
  protected powerCoef = 3;
  protected bonusName = "hammer";

  decide() {
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus hammer");

    this.bot.pressTile(this.tileToInvoke);
  }

  analize(): number {
    this.tileToInvoke = null;
    if (this.bot.tileService == null) return 0;
    if (this.bot.botModel == null) return 0;
    this.weight = 0;
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    if (!this.canActivateCard(card)) return 0;

    const weightedTilesList: { weight: number; tile: TileController }[] = [];

    const playerModel = this.bot.dataService?.playerModel;

    const matrix = this.bot.dataService?.field?.fieldMatrix;

    if (matrix == null) return 0;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tiles = this.bot.tileService
        .getTilesInColumn(index, (t) => t.playerModel == playerModel)
        .filter((t) => {
          if (t instanceof StdTileController) {
            return !t.shieldIsActivated;
          } else {
            return true;
          }
        });

      tiles.forEach((t) => {
        const tilesInRow = [];
        const coord = [-1, 1];
        coord.forEach((item) => {
          const tile = matrix.get(t.row, t.col + item);
          if (tile) {
            if (tile.playerModel == playerModel) {
              tilesInRow.push(tile);
            }
          }
        });

        let coefRow = 1;
        if (tilesInRow.length == 2) {
          coefRow = 1;
        } else {
          coefRow = 0.8;
        }

        const coef =
          Math.exp(
            -1 * ((tiles.length - this.powerCoef) / (this.powerCoef + 1)) ** 2
          ) * coefRow;

        if (tiles.length > 0) {
          const tileToInvoke = tiles[Math.ceil(tiles.length - 1)];
          weightedTilesList.push({ weight: coef, tile: tileToInvoke });
        }
      });
    }

    if (weightedTilesList.length > 0) {
      const res = weightedTilesList.sort(
        (t1, t2) => -(t1.weight - t2.weight)
      )[0];
      if (res == null) return 0;

      this.tileToInvoke = res.tile;
      const desision = random();
      this.weight = desision > 1 - this.procentToInvoke ? 1 : 0;
    }

    return this.weight;
  }
}
