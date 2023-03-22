import { random, randomRange } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { BotAnalizator } from "./BotAnalizator";
import { CardAnalizator } from "./CardAnalizator";

export class FirewallCardBotAnalizator extends CardAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.8;

  decide() {
    const card = this.getBonus("firewall");
    if (card == null) return 0;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus firewall");

    this.bot.pressTile(this.tileToInvoke);
  }

  analize(data: AnalizedData): number {
    this.tileToInvoke = null;
    if (this.bot.tileService == null) return 0;
    if (this.bot.botModel == null) return 0;
    this.weight = 0;
    const card = this.getBonus("firewall");
    if (card == null) return 0;

    if (this.bot.botModel.manaCurrent < card.priceToActivate) return 0;

    const weightedTilesList: { weight: number; tile: TileController }[] = [];

    const playerModel = this.bot.dataService?.playerModel;

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

      const coef = Math.exp(-1 * ((tiles.length - 4) / 5) ** 2);

      if (tiles.length > 0) {
        const tileToInvoke = tiles[Math.ceil((tiles.length - 1) / 2)];
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
