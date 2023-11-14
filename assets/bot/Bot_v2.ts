// Project: Batle2
//
// Author: Natalchishin Taras
//
// Calabaraburus (c) 2023

import { randomRangeInt, tween, _decorator, assert } from "cc";
import { FieldAnalyzer as FieldAnalyzer } from "../entities/field/FieldAnalizer";
import type { ITileFieldController } from "../entities/field/ITileFieldController";
import "../entities/field/FieldExtensions";
import {
  AnalizedData,
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
import { CardAnalizator } from "./CardAnalizator";
import { FirewallCardBotAnalizator } from "./FirewallCardBotAnalizator";
import { BonusModel } from "../models/BonusModel";
import { FirewallLowCardBotAnalizator } from "./FirewallLowCardBotAnalizator";
import { CardsBehaviour } from "../entities/tiles/Behaviours/CardsBehaviour";

const { ccclass, property } = _decorator;

interface TilesSelctorStrategyGroup {
  [key: string]: BotTileSelectionStrategy;
}

interface CardSelctorStrategyGroup {
  [key: string]: CardAnalizator;
}

@ccclass("Bot_v2")
export class Bot_v2 extends Service implements IBot {
  private _botModel: PlayerModel;
  private _playerModel: PlayerModel;
  private _dataService: DataService;
  private _tileService: TileService;
  private _cardService: CardService;

  private _tileSelectorStrateges: TilesSelctorStrategyGroup = {
    stdTilesSelector: new StdSelectorBotStrategy(this),
  };

  private _cardStrategiesActivators = new Map<string, (bonus: BonusModel) => CardAnalizator>();
  private _cardAnalizators = new Map<string, CardAnalizator>();

  private _behaviourSelector: BehaviourSelector;
  private _internalDataService: DataServiceForBot;
  private _levelModel: LevelModel;
  private _internalCardService: CardServiceForBot;
  private _gameState: GameStateWritable;
  private _cardsBehaviour: CardsBehaviour;

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

    const cb = this._behaviourSelector.getBehaviour(CardsBehaviour);

    if (cb != null) {
      this._cardsBehaviour = cb;
      this._cardsBehaviour.applyCardsLogicOnly = true;
    }

    this.initCardActivators();
    this.initCardAnalizators();
  }

  private initCardActivators() {
    var field = this._dataService.field;
    this._cardStrategiesActivators.set("firewall", cm => new FirewallCardBotAnalizator(cm, this, field, this._playerModel));
    this._cardStrategiesActivators.set("firewallLow", cm => new FirewallLowCardBotAnalizator(cm, this, field, this._playerModel));
    this._cardStrategiesActivators.set("firewallMiddle", cm => new FirewallMiddleCardBotAnalizator(cm, this, field, this._playerModel));
  }

  private initCardAnalizators() {
    this._botModel.bonuses.forEach(b => {
      if (!this._cardAnalizators.has(b.mnemonic)) {
        const activator = this._cardStrategiesActivators.get(b.mnemonic);
        assert(activator, "can't find " + b.mnemonic + "activator");
        this._cardAnalizators.set(b.mnemonic, activator(b));
      }
    });
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
    this._cardsBehaviour
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

    //   const tilesForTouch = this.getTilesForTouch(analyzer.analyze());

    const results: RatingResult[] = [];

    const fieldExt = new FieldControllerExtensions(clonedField);

    const finishTiles = fieldExt.findTilesByModelName("start");
    const endTiles = fieldExt.findTilesByModelName("end");

    const aData = analyzer.analyze();

    const cardsTop: RatingResult[] = [];

    this._cardAnalizators.forEach(ca => {
      if (!ca.canActivateCard()) return;

      ca.field = clonedField;

      const cardRating: RatingResult[] = [];

      if (!ca.isStochastic) {

        const tiles = ca.getAvailableTilesForAction(aData);
        tiles.forEach(t => {
          this.getComplexRating(clonedField, [new CardToTile(ca.cardModel, t)], finishTiles, endTiles, cardRating);
        });

        cardRating.sort((r1, r2) => r1.rating - r2.rating);
        cardsTop.push(cardRating[0]);
      }
    });

    if (cardsTop.length == 0) {
      this.getTilesRating(clonedField, finishTiles, endTiles, [], results);
      results.sort((r1, r2) => r1.rating - r2.rating);
      this.pressTile(this._dataService.field.fieldMatrix.get(results[0].tile.row, results[0].tile.col));
    } else {


    }

    if (results[0].tile != null) {

    }
  }

  private getComplexRating(
    field: ITileFieldController,
    cards: CardToTile[],
    startTiles: TileController[],
    endTiles: TileController[],
    results: RatingResult[]
  ) {
    if (isICloneable(field)) {
      const clonedFieldForCard = field.clone() as ITileFieldController;

      cards.forEach(c => {
        this._botModel.setBonus(c.cardModel);
        this._behaviourSelector.run(clonedFieldForCard.fieldMatrix.get(c.tile.row, c.tile.col));
        clonedFieldForCard.moveTilesLogicaly(false);
      });

      this.getTilesRating(clonedFieldForCard, startTiles, endTiles, cards, results);

      clonedFieldForCard.reset();
    }
  }

  private getTilesRating(
    field: ITileFieldController,
    startTiles: TileController[],
    endTiles: TileController[],
    cards: CardToTile[],
    results: RatingResult[]) {

    const analizer = new FieldAnalyzer(field);
    const tiles = this.getTilesForTouch(analizer.analyze());
    const fieldExt = new FieldControllerExtensions(field);

    tiles.forEach(t => {
      if (isICloneable(field)) {
        const clonedFieldForTiles = field.clone() as ITileFieldController;
        fieldExt.setField(clonedFieldForTiles);

        const result = new RatingResult();

        result.rating = this.getTileRating(fieldExt, t, startTiles, endTiles);
        result.cards = cards;
        result.tile = t;

        results.push(result);

        clonedFieldForTiles.reset();
      }
    });
  }

  private getTileRating(
    fieldExt: FieldControllerExtensions,
    tile: TileController | null,
    startTiles: TileController[],
    endTiles: TileController[]): number {

    this._internalDataService.field = fieldExt.field;
    this._internalDataService.fieldAnalizer = new FieldAnalyzer(fieldExt.field);


    if (tile != null) {
      this._behaviourSelector.run(fieldExt.field.fieldMatrix.get(tile.row, tile.col));
      fieldExt.field.moveTilesLogicaly(false);
    }

    const playerTiles = fieldExt.getPlayerTiles(this._playerModel);
    const botTiles = fieldExt.getPlayerTiles(this._botModel);

    return fieldExt.getRating(playerTiles, botTiles, startTiles, endTiles);

  }


  private getTilesForTouch(analysedData: AnalyzedData) {
    const result: TileController[] = [];

    for (const key in this._tileSelectorStrateges) {
      if (
        Object.prototype.hasOwnProperty.call(this._tileSelectorStrateges, key)
      ) {
        const element = this._tileSelectorStrateges[
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

class CardToTile {
  public cardModel: BonusModel;
  public tile: TileController;

  public constructor(card: BonusModel, tile: TileController) {
    this.cardModel = card;
    this.tile = tile;
  }
}

class RatingResult {
  public rating: number;
  public cards: CardToTile[];
  public tile: TileController;
}