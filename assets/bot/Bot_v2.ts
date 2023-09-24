// Project: Batle2
//
// Author: Natalchishin Taras
//
// Calabaraburus (c) 2023

import { randomRangeInt, tween, _decorator } from "cc";
import { FieldAnalyzer as FieldAnalyzer } from "../entities/field/FieldAnalizer";
import type { ITileFieldController } from "../entities/field/ITileFieldController";
import {
  AnalizedData as AnalyzedData,
  TileTypeToConnectedTiles,
} from "../entities/field/AnalizedData";

import { IBot } from "./IBot";
import { FieldController } from "../entities/field/FieldController";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { Service } from "../entities/services/Service";
import { TileService } from "../entities/services/TileService";
import { PlayerModel } from "../models/PlayerModel";
import { DataService } from "../entities/services/DataService";
import { GameManager } from "../entities/game/GameManager";
import { BotAnalizator } from "./BotAnalizator";
import { CardService } from "../entities/services/CardService";
import { BotTileSelectionStrategy } from "./BotTileSelectionStrategy";
import { StdSelectorBotStrategy } from "./StdSelectorBotStrategy";
import { ICloneable, isICloneable } from "../scripts/ICloneable";
import { isIVirtualisable } from "../scripts/IVirtualisable";
import { a } from "../entities/game/GameManager copy";

const { ccclass, property } = _decorator;

interface TilesSelctorStrategyGroup {
  [key: string]: BotTileSelectionStrategy;
}

@ccclass("Bot_v2")
export class Bot_v2 extends Service implements IBot {
  private _botModel: PlayerModel | null | undefined;
  private _dataService: DataService;
  private _tileService: TileService;
  private _cardService: CardService;
  private _gameManager: GameManager;
  private _fieldCloned: ITileFieldController;

  private tileSelectorStrateges: TilesSelctorStrategyGroup = {
    stdTilesSelector: new StdSelectorBotStrategy(this),
  };

  public get dataService() {
    return this._dataService;
  }

  public get cardService() {
    return this._cardService;
  }

  public get tileService() {
    return this._tileService;
  }

  public get botModel() {
    return this._botModel;
  }

  start() {
    this._dataService = this.getServiceOrThrow(DataService);
    this._tileService = this.getServiceOrThrow(TileService);
    this._gameManager = this.getServiceOrThrow(GameManager);
    this._cardService = this.getServiceOrThrow(CardService);
    this._botModel = this._dataService?.botModel;
  }

  public move(): void {
    let clonedField: ITileFieldController;

    if (isICloneable(this._dataService.field.logicField)) {
      clonedField =
        this._dataService.field.logicField.clone() as ITileFieldController;
    } else {
      throw Error("logicField must be clonable.");
    }

    if (isIVirtualisable(clonedField)) {
      clonedField.virtualize();
    } else {
      throw Error("Field isn't virtualizable.");
    }

    const analyzer = new FieldAnalyzer(clonedField);

    const getTilesForTouch = (analysedData: AnalyzedData) => {
      const result: TileController[] = [];

      for (const key in this.tileSelectorStrateges) {
        if (
          Object.prototype.hasOwnProperty.call(this.tileSelectorStrateges, key)
        ) {
          const element = this.tileSelectorStrateges[
            key
          ] as BotTileSelectionStrategy;
          if (element != null) {
            const tls = element.getAvailableTilesForAction(analysedData);

            result.push(...tls);
          }
        }
      }

      return result;
    };

    const tilesForTouch = getTilesForTouch(analyzer.analyze());

    const results: number[] = [];

    tilesForTouch.forEach((tile) => {
      if (isICloneable(clonedField)) {
        const tmpField = clonedField.clone() as ITileFieldController;
      }
    });
  }

  pressTileSet(tiles: Set<TileController>) {
    this.pressTileArray(new Array(...tiles.values()));
  }

  pressTileArray(tiles: TileController[]) {
    const tileId = randomRangeInt(0, tiles.length);
    const tileToPress = Array.from(tiles.values());
    this.pressTile(tileToPress[tileId]);
  }

  pressTile(tile: TileController | null) {
    tile?.clicked();
    console.log(`[Bot] Clicked tile r:${tile?.row} c:${tile?.col}`);
  }

  private analize(): boolean {
    throw new Error();
    //field.logicField;
  }
}
