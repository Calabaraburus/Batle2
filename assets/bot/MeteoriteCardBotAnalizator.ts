import { random } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { BotAnalizator } from "./BotAnalizator";

export class MeteoriteCardBotAnalizator extends BotAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.8;
  protected powerMeteorite = 2;
  protected powerCoef = 4;
  protected bonusName = "meteorite";

  decide() {
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus meteorite");

    this.bot.pressTile(this.tileToInvoke);
  }

  analize(): number {
    this.tileToInvoke = null;
    if (this.bot.tileService == null) return 0;
    if (this.bot.botModel == null) return 0;
    this.weight = 0;
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    if (this.bot.botModel.manaCurrent < card.priceToActivate) return 0;

    const weightedTilesList: { weight: number; tile: TileController }[] = [];

    const playerModel = this.bot.dataService?.playerModel;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tilesInCol = this.bot.tileService
        .getTilesInColumn(index, (t) => t.playerModel == playerModel)
        .filter((t) => {
          if (t instanceof StdTileController) {
            return !t.shieldIsActivated;
          } else {
            return true;
          }
        });

      let tilesInRow: TileController[] = [];

      if (this.powerMeteorite > 0) {
        tilesInCol.forEach((item) => {
          if (this.bot.tileService == null) return;
          tilesInRow = this.bot.tileService
            .getTilesInRow(
              item,
              index,
              this.powerMeteorite,
              (t) => t.playerModel == playerModel
            )
            .filter((t) => {
              if (t instanceof StdTileController) {
                return !t.shieldIsActivated;
              } else {
                return true;
              }
            });
        });
      }

      // const tiles = tilesInCol.concat(tilesInRow);
      const coefRow = tilesInRow.length / 10 + 1;

      const coef =
        Math.exp(
          -1 *
            ((tilesInCol.length - this.powerCoef) / (this.powerCoef + 1)) ** 2
        ) * coefRow;

      if (tilesInCol.length > 0) {
        const tileToInvoke = tilesInCol[Math.ceil((tilesInCol.length - 1) / 2)];
        weightedTilesList.push({ weight: coef, tile: tileToInvoke });
      }
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
