import { random } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { CardAnalizator } from "./CardAnalizator";

export class MineCardBotAnalizator extends CardAnalizator {
  private readonly procToInvoke = 0.7;
  tileToInvoke: TileController | null;

  analize(data: AnalizedData): number {
    console.log(`[Bot][ShieldCard] start analize`);
    this.weight = 0;

    const tileService = this.bot.tileService;

    if (this.bot.botModel == null) return 0;
    if (tileService == null) return 0;
    const card = this.getBonus(this.cardMnemonic);
    if (card == null) return 0;

    if (this.bot.botModel.manaCurrent < card.priceToActivate) return 0;

    const mybotConnectedTiles = data.connectedTiles.filter((tpct) => {
      if (tpct.playerModel == this.bot.botModel) {
        if (tpct.connectedTiles.size > 0) {
          let res = false;
          const ct = tpct.connectedTiles.values().next().value;

          if (ct instanceof StdTileController) {
            res = !ct.shieldIsActivated;
          }

          return res;
        }
      }
      return false;
    });

    if (mybotConnectedTiles.length < 0) {
      return 0;
    }

    const sortedGroups = mybotConnectedTiles.sort(
      (a, b) => -(a.connectedTiles.size - b.connectedTiles.size)
    );

    const rnd = random();
    console.log(`[Bot][ShieldCard] decision value: ${rnd}`);
    if (rnd < this.procToInvoke) {
      this.weight = 1;

      this.tileToInvoke = sortedGroups[0].connectedTiles.values().next().value;

      return 1;
    }

    return 0;
  }

  decide() {
    console.log("[Bot][ShieldCard] start to decide");

    if (this.bot.tileService == null) return;

    const card = this.getBonus(this.cardMnemonic);
    if (card == null) return;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus: shield");

    this.bot.pressTile(this.tileToInvoke);
  }
}
