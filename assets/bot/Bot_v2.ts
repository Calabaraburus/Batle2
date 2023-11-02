// Project: Batle2
//
// Author: Natalchishin Taras
//
// Calabaraburus (c) 2023

import { randomRangeInt, tween, _decorator } from "cc";
import { FieldAnalyzer as FieldAnalyzer } from "../entities/field/FieldAnalizer";
import type { ITileFieldController } from "../entities/field/ITileFieldController";
import "../entities/field/FieldExtensions";
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
import { FirewallMiddleCardBotAnalizator } from "./FirewallMiddleCardBotAnalizator";
import { FieldControllerExtensions } from "../entities/field/FieldExtensions";
import { BehaviourSelector } from "../entities/behaviours/BehaviourSelector";
import { ObjectsCache } from "../ObjectsCache/ObjectsCache";
import { DataServiceForBot } from "./DataServiceForBot";
import { LevelModel } from "../models/LevelModel";
import { CardServiceForBot } from "./CardServiceForBot";
import { GameState } from "../entities/game/GameState";
import { GameStateWritable } from "../entities/game/GameStateWritable";

const { ccclass, property } = _decorator;

interface TilesSelctorStrategyGroup {
  [key: string]: BotTileSelectionStrategy;
}

@ccclass("Bot_v2")
export class Bot_v2 extends Service implements IBot {
  private _botModel: PlayerModel;
  private _playerModel: PlayerModel;
  private _dataService: DataService;
  private _tileService: TileService;
  private _cardService: CardService;

  private tileSelectorStrateges: TilesSelctorStrategyGroup = {
    stdTilesSelector: new StdSelectorBotStrategy(this),
  };

  private _behaviourSelector: BehaviourSelector;
  private _internalDataService: DataServiceForBot;
  private _levelModel: LevelModel;
  private _internalCardService: CardServiceForBot;
  private _gameState: GameStateWritable;

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
    this._cardService = this.getServiceOrThrow(CardService);
    this._gameState = new GameStateWritable();

    this._gameState.isPlayerTurn = false;

    this._levelModel = this.getServiceOrThrow(LevelModel);

    this._behaviourSelector = this.getServiceOrThrow(BehaviourSelector);

    // Create cloned behaviours for internal bot actions
    this._behaviourSelector = this._behaviourSelector.clone();

    this._botModel = this._dataService.botModel;
    this._playerModel = this._dataService.playerModel;

    this._internalDataService = this.getBotDataService();
    this._internalCardService = this.getBotCardService();

    this._behaviourSelector.Setup(this.getServiceOrThrow(ObjectsCache),
      this._internalCardService,
      this._internalDataService,
      this._levelModel,
      this._gameState);
  }

  private getBotDataService(): DataServiceForBot {

    const result = new DataServiceForBot();
    result.debugView = this._dataService.debugView;
    result.botModel = this._botModel;
    result.playerModel = this._playerModel;
    result.enemyFieldController = this._dataService.enemyFieldController;
    result.playerFieldController = this._dataService.playerFieldController;
    return result;
  }

  private getBotCardService(): CardServiceForBot {

    const result = new CardServiceForBot();

    result.dataService = this._internalDataService;
    result.levelModel = this._levelModel;

    return result;
  }


  public move(): void {
    let clonedField: ITileFieldController;

    if (isICloneable(this._dataService.field)) {
      clonedField =
        this._dataService.field.clone() as ITileFieldController;
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
            let tls = element.getAvailableTilesForAction(analysedData);
            tls = tls.filter(t => t.playerModel == this._playerModel);
            result.push(...tls);
          }
        }
      }

      return result;
    };

    const tilesForTouch = getTilesForTouch(analyzer.analyze());

    const results: [number, TileController][] = [];

    const fieldExt = new FieldControllerExtensions(clonedField);

    const finishTiles = fieldExt.findTilesByModelName("start");

    tilesForTouch.forEach((tile) => {
      if (isICloneable(clonedField)) {
        const tmpField = clonedField.clone() as ITileFieldController;

        // var cTile = tmpField.destroyTile(tile.row, tile.col, (t) => true);

        this._internalDataService.field = tmpField;
        this._internalDataService.fieldAnalizer = new FieldAnalyzer(tmpField)

        this._behaviourSelector.run(tmpField.fieldMatrix.get(tile.row, tile.col));

        tmpField.moveTilesLogicaly(false);

        fieldExt.setField(tmpField);

        const tiles = fieldExt.getPlayerTiles(this._playerModel);
        results.push([fieldExt.getRating(tiles, finishTiles), tile]);

        tmpField.reset();
      }
    });

    results.sort((r1, r2) => r1[0] - r2[0]);

    this.pressTile(this._dataService.field.fieldMatrix.get(results[0][1].row, results[0][1].col));
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

  pressTileSelectedByIndexes(field: ITileFieldController, row: number, col: number) {
    const tile = field.fieldMatrix.get(row, col);
    tile?.clicked();
  }

  private analize(): boolean {
    throw new Error();
    //field.logicField;
  }
}

