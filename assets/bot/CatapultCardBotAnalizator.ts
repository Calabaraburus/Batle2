import { random } from "cc";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { BotAnalizator } from "./BotAnalizator";

export class CatapultCardBotAnalizator extends BotAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.8;
  protected bonusName = "catapult";
  distanceMatrix = [
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 0],
  ];

  decide() {
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus catapult");

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

    const botModel = this.bot.dataService?.botModel;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tiles = this.bot.tileService
        .getTilesInColumn(index, (t) => t.playerModel == botModel)
        .filter((t) => {
          if (t instanceof StdTileController) {
            return true;
          } else {
            return false;
          }
        });

      tiles.forEach((item) => {
        if (this.bot.tileService == null) return;
        const tileWeight = this.bot.tileService.getDifferentTiles(
          item,
          this.distanceMatrix,
          (t) => t.playerModel == botModel
        );
        if (tileWeight == undefined) return;
        const coef = Math.exp(-1 * ((tileWeight - 4) / 5) ** 2);
        weightedTilesList.push({ weight: coef, tile: item });
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
