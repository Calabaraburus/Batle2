//  Bot.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { randomRangeInt, tween, _decorator } from "cc";
import { FieldAnalizer } from "../entities/field/FieldAnalizer";
import type { ITileFieldController } from "../entities/field/ITileFieldController";
import { TileTypeToConnectedTiles } from "../entities/field/AnalizedData";

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

const { ccclass, property } = _decorator;

interface TilesSelctorStrategyGroup {
  [key: string]: BotTileSelectionStrategy;
}

@ccclass("Bot")
export class Bot_v2 extends Service implements IBot {
  private _analizer: FieldAnalizer;
  private _botModel: PlayerModel | null | undefined;
  private _dataService: DataService | null;
  private _tileService: TileService | null;
  private _cardService: CardService | null;
  private _gameManager: GameManager | null;
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

  public get analizer() {
    return this._analizer;
  }

  start() {
    this._dataService = this.getService(DataService);
    this._tileService = this.getService(TileService);
    this._gameManager = this.getService(GameManager);
    this._cardService = this.getService(CardService);

    if (this._dataService?.field != null)
      this._analizer = new FieldAnalizer(this._dataService?.field);
    this._botModel = this._dataService?.botModel;
  }

  public move(): void {
    let analized_data = this._analizer.analize();

    const tilesMove = () => {
      console.log("[Bot] Search for cull strategy");

      for (const key in this.tileSelectorStrateges) {
        if (
          Object.prototype.hasOwnProperty.call(this.tileSelectorStrateges, key)
        ) {
          const element = this.tileSelectorStrateges[
            key
          ] as BotTileSelectionStrategy;
          if (element != null) {
            //element.analize(analized_data);
          }
        }
      }

      return true;
    };

    const twobj = { time: 0 };

    const analizersQueue: BotAnalizator[] = [];

    const baseTween = tween(twobj);

    console.log("[Bot] analize cards");

    const childTween = tween(twobj)
      .call(() => {
        if (!this._gameManager?.isBehavioursInProccess) {
          console.log("[Bot] All behaviours stop to prossed");
          console.log("[Bot] Reanalize data");

          analized_data = this._analizer.analize();

          if (analizersQueue.length == 0) {
            tilesMove();

            console.log("[Bot] stop analizers tween");

            baseTween.stop();
            return;
          }

          console.log("[Bot] pick up next analizer");
          const analizer = analizersQueue.pop();

          if (analizer == null) return;

          if (analizer.analize(analized_data) >= 1) {
            console.log("[Bot] deside too activate card");
            analizer.decide();
          }
        }
      })
      .delay(0.1);

    baseTween.repeatForever(childTween).start();
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
