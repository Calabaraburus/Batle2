import { random, randomRangeInt } from "cc";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { CardAnalizator } from "./CardAnalizator";

export class BerserkCardBotAnalizator extends CardAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.7;
  protected bonusName = "berserk";

  decide() {
    console.log(`[Bot][${this.cardMnemonic}card] start to decide`);

    if (this.bot.tileService == null) return;

    const card = this.getBonus(this.cardMnemonic);
    if (card == null) return;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log(`[Bot] Activate bonus: ${this.cardMnemonic}`);

    this.bot.pressTile(this.tileToInvoke);
  }

  analize(): number {
    console.log(`[Bot][${this.cardMnemonic}Card] start analize`);
    this.weight = 0;

    const tileService = this.bot.tileService;

    if (this.bot.botModel == null) return 0;
    if (tileService == null) return 0;
    const card = this.getBonus(this.cardMnemonic);
    if (card == null) return 0;

    if (!this.canActivateCard(card)) return 0;

    const myTiles = this.bot.field.fieldMatrix.filter((tile) => {
      if (tile.playerModel == this.bot.botModel) {
        if (tile instanceof StdTileController) {
          return !tile.shieldIsActivated;
        }
      }
      return false;
    });

    if (myTiles.length < 0) {
      return 0;
    }

    const rnd = random();
    console.log(`[Bot][${this.cardMnemonic}}] decision value: ${rnd}`);
    if (rnd < this.procentToInvoke) {
      this.weight = 1;

      this.tileToInvoke = myTiles[randomRangeInt(0, myTiles.length)];

      return 1;
    }

    return 0;
  }
}
