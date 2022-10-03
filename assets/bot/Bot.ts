//  Bot.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, random, randomRangeInt, _decorator } from "cc";
import { FieldAnalizer } from "../entities/field/FieldAnalizer";
import { ITileField } from "../entities/field/ITileField";
import { TileTypeToConnectedTiles } from "../entities/field/AnalizedData";

import { IBot } from "./IBot";
import { FieldController } from "../entities/field/FieldController";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
const { ccclass, property } = _decorator;

@ccclass("Bot")
export class Bot extends Component implements IBot {
  @property({ type: FieldController })
  field: ITileField;
  private _analizer: FieldAnalizer;

  start() {
    this._analizer = new FieldAnalizer(this.field);
  }

  public move(): void {
    const analized_data = this._analizer.analize();
    const attackingTiles = this._analizer.getAttackingTiles("end", "player");
    const largestGroup = this.getMaxConnected(analized_data.connectedTiles);
    const largestSpecGroup = this.getMaxConnectedSpecCol(
      analized_data.connectedTiles,
      attackingTiles
    );

    if (largestSpecGroup != null) {
      this.pressTile(largestSpecGroup.connectedTiles);
    } else {
      this.pressTile(largestGroup.connectedTiles);
    }
  }

  pressTile(tiles: Set<TileController>) {
    const tileId = randomRangeInt(0, tiles.size);
    const tileToPress = Array.from(tiles.values());
    tileToPress[tileId].clicked();
  }

  private getMaxConnected(
    connects: TileTypeToConnectedTiles[]
  ): TileTypeToConnectedTiles {
    return connects
      .filter((c) => c.tileModel.containsTag("player"))
      .reduce(
        (acc, connect) =>
          (acc =
            this.countShielded(acc.connectedTiles) >
            this.countShielded(connect.connectedTiles)
              ? acc
              : connect),
        connects[0]
      );
  }

  private countShielded(tiles: Set<TileController>): number {
    let result = 0;
    tiles.forEach((t) => {
      if (t instanceof StdTileController) {
        if (!t.shieldIsActivated) {
          result++;
        }
      }
    });

    return result;
  }

  private getMaxConnectedSpecCol(
    connects: TileTypeToConnectedTiles[],
    specTiles: TileController[]
  ): TileTypeToConnectedTiles | null {
    const connects2: TileTypeToConnectedTiles[] = [];
    specTiles.forEach((specTile) => {
      this.field.fieldMatrix.forEachCol(specTile.col, (tile) => {
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
            this.countShielded(acc.connectedTiles) >
            this.countShielded(connect.connectedTiles)
              ? acc
              : connect),
        connects2[0]
      );
  }

  private analize(): boolean {
    throw new Error();
    //field.logicField;
  }
}
