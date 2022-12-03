import { _decorator, debug, director, js } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { ObjectsCache } from "../../ObjectsCache/ObjectsCache";
import { helpers } from "../../scripts/helpers";
import { EnemyFieldController } from "../enemyField/EnemyFieldController";
import { FieldAnalizer } from "../field/FieldAnalizer";
import { FieldController } from "../field/FieldController";
import { GameManager } from "../game/GameManager";
import { LevelController } from "../level/LevelController";
import { PlayerFieldController } from "../playerField/PlayerFieldController";
import { DataService } from "../services/DataService";
import { BombTileController } from "../tiles/BombTile/BombTileController";
import { DebugView } from "../ui/debugger/DebugView";
import { Behaviour } from "./Behaviour";
const { ccclass } = _decorator;

@ccclass("GameBehaviour")
export class GameBehaviour extends Behaviour {
  private _dataService: DataService | null | undefined;
  private _objectsCache: ObjectsCache | null;
  public get dataService() {
    return this._dataService;
  }

  public get objectsCache() {
    return this._objectsCache;
  }

  public get gameManager() {
    return this._dataService?.gameManager;
  }

  public get levelController() {
    return this._dataService?.levelController;
  }

  public get fieldAnalizer() {
    return this._dataService?.fieldAnalizer;
  }

  public get botModel() {
    return this._dataService?.botModel;
  }

  public get playerModel() {
    return this._dataService?.playerModel;
  }

  public get playerFieldController() {
    return this._dataService?.playerFieldController;
  }

  public get enemyFieldController() {
    return this._dataService?.enemyFieldController;
  }

  get field() {
    return this._dataService?.field;
  }

  get debug() {
    return this._dataService?.debugView;
  }

  start() {
    this._dataService = this.getService(DataService);
    this._objectsCache = this.getService(ObjectsCache);

    this.debug?.log(`behave: '${this.serviceType}' started`);
  }

  run(): void {
    this.debug?.log(`behave: '${this.serviceType}' run`);

    try {
      this.singleRun();
    } catch (e: unknown) {
      if (typeof e === "string") {
        this.debug?.log(
          `behave: '${this.serviceType}' error: '${e.toString()}'`
        );
      } else if (e instanceof Error) {
        this.debug?.log(`behave: '${this.serviceType}' error: '${e.message}'`);
      } else {
        this.debug?.log(`behave: '${this.serviceType}' error: unknown`);
      }
    }

    this.stop();
  }

  singleRun() {
    throw Error("not implemented method");
  }

  protected updateTileField() {
    if (this.levelController == null) return;

    const analizedData = this.fieldAnalizer?.analize();
    const levelModel = this.levelController.model;

    if (analizedData != null) {
      this.field?.moveTilesLogicaly(!this.gameManager?.playerTurn);
      levelModel.pointsCount += analizedData.destroiedTilesCount;
      levelModel.turnsCount += 1;

      this.field?.fixTiles(analizedData);
      this.field?.updateBackground();
      this.field?.Flush();
      this.field?.moveTilesAnimate();
    }
  }
}
