import { random } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { BotAnalizator } from "./BotAnalizator";
import { CardAnalizator } from "./CardAnalizator";

export class PushCardBotAnalizator extends CardAnalizator {
  private readonly procToInvoke = 0.9;
  private bonusName = "push";

  analize(data: AnalizedData): number {
    console.log(`[Bot][pushCard] start analize`);
    this.weight = 0;
    if (this.bot.botModel == null) return 0;
    if (this.bot.tileService == null) return 0;
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    if (this.bot.botModel.manaCurrent < card.priceToActivate) return 0;

    let closeColsCount = 0;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tiles = this.bot.tileService.getTilesByTagInColumn(index, "enemy");

      if (tiles.length >= 9 || tiles.length <= 2) {
        closeColsCount++;
      }
    }

    const rnd = random();
    console.log(`[Bot][push] decision value: ${rnd}`);
    if (rnd <= this.procToInvoke && closeColsCount == 2) {
      this.weight = 1;
      return 1;
    } else if (rnd <= this.procToInvoke + 0.1 && closeColsCount == 3) {
      this.weight = 1;
      return 1;
    } else if (closeColsCount > 3) {
      this.weight = 1;
      return 1;
    }

    return 0;
  }

  decide() {
    console.log("[Bot][push] start to decide");

    if (this.bot.tileService == null) return;

    const card = this.getBonus(this.bonusName);
    if (card == null) return;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus: push");

    const tiles = this.bot.tileService.getPlayerTiles();
    this.bot.pressTileArray(tiles);
  }
}
