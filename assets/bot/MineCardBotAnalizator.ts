import { random, randomRangeInt } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { CardAnalizator } from "./CardAnalizator";

export class MineCardBotAnalizator extends CardAnalizator {
  private readonly procToInvoke = 0.7;
  tileToInvoke: TileController | null;

  analize(data: AnalizedData): number {
    console.log(`[Bot][${this.cardMnemonic}Card] start analize`);
    this.weight = 0;

    const tileService = this.bot.tileService;

    if (this.bot.botModel == null) return 0;
    if (tileService == null) return 0;
    const card = this.getBonus(this.cardMnemonic);
    if (card == null) return 0;

    if (!this.canActivateCard(card)) return 0;

    const weightedTilesList: { weight: number; tile: TileController }[] = [];

    const playerModel = this.bot.dataService?.playerModel;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tiles = tileService
        .getTilesInColumn(index, (t) => t.playerModel == playerModel)
        .filter((t) => {
          if (t instanceof StdTileController) {
            return !t.shieldIsActivated;
          } else {
            return false;
          }
        });

      const coef = Math.exp(-1 * ((tiles.length - 2) / 5) ** 2);

      if (tiles.length > 0) {
        const tileToInvoke = tiles[Math.ceil((tiles.length - 1) / 2)];
        weightedTilesList.push({ weight: coef, tile: tileToInvoke });
      }
    }

    if (weightedTilesList.length <= 0) {
      return 0;
    }

    const res = weightedTilesList.sort((t1, t2) => -(t1.weight - t2.weight))[0];

    const rnd = random();
    console.log(`[Bot][${this.cardMnemonic}}] decision value: ${rnd}`);
    if (rnd < this.procToInvoke) {
      this.weight = 1;

      this.tileToInvoke = res.tile;

      return 1;
    }

    return 0;
  }

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
}
