import { random } from "cc";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { BotAnalizator } from "./BotAnalizator";

export class PanicCardBotAnalizator extends BotAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.8;
  protected bonusName = "panic";

  decide() {
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus panic");

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
    const tService = this.bot.tileService;
    if (tService == undefined) return 0;

    const weightedTilesList: { weight: number; tile: TileController }[] = [];

    const playerModel = this.bot.dataService?.playerModel;

    let tilesMatrix: TileController[] | undefined = [];

    let coefType = 0;

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

      const ids = [-1, 0, 1];

      tilesInCol.forEach((tile) => {
        tilesMatrix = [];
        ids.forEach((i) => {
          const tilesCol = tService.getMatrixOfTiles(
            tile,
            tile.col + i,
            (t) => t.playerModel == playerModel
          );
          if (tilesCol != undefined) {
            tilesMatrix = tilesMatrix?.concat(tilesCol);
          }
        });
        const amountTileTypes: number[] = [0, 0, 0];
        if (tilesMatrix == undefined) return;
        tilesMatrix.forEach((t) => {
          if (t.tileModel.tileName == "b") {
            amountTileTypes[0] += 1;
          } else if (t.tileModel.tileName == "g") {
            amountTileTypes[1] += 1;
          } else if (t.tileModel.tileName == "k") {
            amountTileTypes[2] += 1;
          }
        });
        if (
          Math.min(...amountTileTypes) != 0 &&
          Math.max(...amountTileTypes) >= 4
        ) {
          coefType = 2;
        } else {
          coefType = 0;
        }

        const coef =
          Math.exp(-1 * ((tilesMatrix.length - 8) / 9) ** 2) * coefType;

        if (tilesMatrix.length >= 5) {
          const tileToInvoke =
            tilesInCol[Math.ceil((tilesInCol.length - 1) / 2)];
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
