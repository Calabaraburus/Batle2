import {
  AnalizedData,
  TileTypeToConnectedTiles,
} from "../entities/field/AnalizedData";
import { TileController } from "../entities/tiles/TileController";
import { BotAnalizator } from "./BotAnalizator";

export class ProtectionTilesAttackBotAnalizator extends BotAnalizator {
  resultTiles: TileTypeToConnectedTiles | null;
  decide() {
    if (this.resultTiles == null) {
      return;
    }

    this.bot.pressTileSet(this.resultTiles?.connectedTiles);
  }

  analize(data: AnalizedData): number {
    this.weight = 0;
    const attackingTiles = this.bot.analizer.getAttackingTiles(
      "end",
      this.bot.cardService?.getOponentModel()
    );

    this.resultTiles = this.getMaxConnectedSpecCol(
      data.connectedTiles,
      attackingTiles
    );

    if (this.resultTiles == null) return 0;

    if (this.resultTiles.connectedTiles.size <= 0) return 0;

    this.weight = 1;
    return 1;
  }

  private getMaxConnectedSpecCol(
    connects: TileTypeToConnectedTiles[],
    specTiles: TileController[]
  ): TileTypeToConnectedTiles | null {
    const connects2: TileTypeToConnectedTiles[] = [];
    specTiles.forEach((specTile) => {
      this.bot.field.fieldMatrix.forEachCol(specTile.col, (tile) => {
        if (tile.tileModel.containsTag("player")) {
          const fc = connects.find((c) => c.connectedTiles.has(tile));
          if (fc != undefined) {
            connects2.push(fc);
          }
        }
      });
    });

    if (connects2.length == 0) {
      return null;
    }

    return connects2
      .filter((c) => c.tileModel.containsTag("player"))
      .reduce(
        (acc, connect) =>
          (acc =
            this.bot.tileService!.countShielded(acc.connectedTiles) >
            this.bot.tileService!.countShielded(connect.connectedTiles)
              ? acc
              : connect),
        connects2[0]
      );
  }
}
