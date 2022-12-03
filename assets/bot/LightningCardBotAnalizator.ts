import { random } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { BotAnalizator } from "./BotAnalizator";

export class LightningCardBotAnalizator extends BotAnalizator {
  private readonly procToInvoke = 0.7;

  analize(data: AnalizedData): number {
    console.log(`[Bot][ligtningCard] start analize`);
    this.weight = 0;
    if (this.bot.botModel == null) return 0;
    if (this.bot.tileService == null) return 0;
    const card = this.getBonus("lightning");
    if (card == null) return 0;

    if (card.currentAmmountToActivate < card.priceToActivate) return 0;

    let closeColsCount = 0;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tiles = this.bot.tileService.getTilesByTagInColumn(index, "enemy");

      if (tiles.length <= 2) {
        closeColsCount++;
      }
    }

    const rnd = random();
    console.log(`[Bot][ligtningCard] decision value: ${rnd}`);
    if (rnd < this.procToInvoke && closeColsCount >= 2) {
      this.weight = 1;
      return 1;
    }

    return 0;
  }

  decide() {
    console.log("[Bot][ligtningCard] start to decide");

    if (this.bot.tileService == null) return;

    const card = this.getBonus("lightning");
    if (card == null) return;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus: lightning");

    const tiles = this.bot.tileService.getPlayerTiles();
    this.bot.pressTileArray(tiles);
  }
}
