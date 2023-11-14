import { math, random, randomRange } from "cc";
import { AnalizedData } from "../entities/field/AnalizedData";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { BotAnalizator } from "./BotAnalizator";
import { CardAnalizator } from "./CardAnalizator";

export class FirewallCardBotAnalizator extends CardAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.8;
  protected powerCoef = 6;
  protected bonusName = "firewall";

  getAvailableTilesForAction(data: AnalizedData): TileController[] {
    return this._fieldExt.getPlayerTiles(this.playerModel).filter(t => {
      if (t instanceof StdTileController) {
        if (!t.shieldIsActivated) {
          return t;
        }
      }
    });
  }
}
