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
const { ccclass, property } = _decorator;

@ccclass("Bot")
export class Bot extends Component implements IBot {
  private _field: ITileField;
  private _analizer: FieldAnalizer;

  public move(): void {
    const analized_data = this._analizer.analize();

    const largestGroup = this.getMaxConnected(analized_data.connectedTiles);
    const tileId = randomRangeInt(0, largestGroup.connectedTiles.size);

    const tileToPress = Array.from(largestGroup.connectedTiles.values());

    tileToPress[tileId].activate();
  }

  private getMaxConnected(
    connects: TileTypeToConnectedTiles[]
  ): TileTypeToConnectedTiles {
    return connects.reduce(
      (acc, connect) =>
        (acc =
          acc.connectedTiles.size > connect.connectedTiles.size
            ? acc
            : connect),
      connects[0]
    );
  }

  private analize(): boolean {
    throw new Error();
    //field.logicField;
  }
}
