import { random } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { CardAnalizator } from "./CardAnalizator";

export class CounterattackCardBotAnalizator extends CardAnalizator {
  private readonly procToInvoke = 0.6;
  private bonusName = "c_attack";

  analize(data: AnalizedData): number {
    console.log(`[Bot][c_attackCard] start analize`);
    this.weight = 0;
    if (this.bot.botModel == null) return 0;
    if (this.bot.tileService == null) return 0;
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    if (this.bot.botModel.manaCurrent < card.priceToActivate) return 0;

    let closeColsCount = 0;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tiles = this.bot.tileService.getTilesByTagInColumn(index, "player");

      if (tiles.length >= 9) {
        closeColsCount++;
      }
    }

    const rnd = random();
    console.log(`[Bot][c_attackCard] decision value: ${rnd}`);
    if (rnd <= this.procToInvoke && closeColsCount < 2) {
      this.weight = 1;
      return 1;
    } else if (closeColsCount >= 2) {
      this.weight = 1;
      return 1;
    }

    return 0;
  }

  decide() {
    console.log("[Bot][PushCard] start to decide");

    if (this.bot.tileService == null) return;

    const card = this.getBonus(this.bonusName);
    if (card == null) return;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus: Push");

    const tiles = this.bot.tileService.getPlayerTiles();
    this.bot.pressTileArray(tiles);
  }
}
