import { _decorator } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { EnemyFieldController } from "../enemyField/EnemyFieldController";
import { FieldAnalyzer } from "../field/FieldAnalizer";
import { FieldController } from "../field/FieldController";
import { GameManager } from "../game/GameManager";
import { LevelController } from "../level/LevelController";
import { PlayerFieldController } from "../playerField/PlayerFieldController";
import { DebugView } from "../ui/debugger/DebugView";
const { ccclass } = _decorator;
import { Service } from "./Service";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { IDataService } from "./IDataService";

@ccclass("DataService")
export class DataService extends Service implements IDataService {
  private _debug: DebugView;
  private _manager: GameManager;
  private _levelController: LevelController;
  private _analizer: FieldAnalyzer;
  private _botModel: PlayerModel;
  private _playerModel: PlayerModel;
  private _field: FieldController;
  private _enemyFieldController: EnemyFieldController;
  private _playerFieldController: PlayerFieldController;
  private _levelConfig: LevelConfiguration;

  public get debugView() {
    return this._debug;
  }

  public get gameManager() {
    return this._manager;
  }

  public get levelController() {
    return this._levelController;
  }

  public get fieldAnalizer() {
    return this._analizer;
  }

  public get botModel() {
    return this._botModel;
  }

  public get playerModel() {
    return this._playerModel;
  }

  public get playerFieldController() {
    return this._playerFieldController;
  }

  public get enemyFieldController() {
    return this._enemyFieldController;
  }

  get field() {
    return this._field;
  }

  public get levelConfiguration() {
    return this._levelConfig;
  }

  start() {
    this._debug = this.getServiceOrThrow(DebugView);
    this._manager = this.getServiceOrThrow(GameManager);
    this._field = this.getServiceOrThrow(FieldController);
    this._levelConfig = this.getServiceOrThrow(LevelConfiguration);

    this._analizer = new FieldAnalyzer(this.field.logicField);

    this._levelController = this.getServiceOrThrow(LevelController);
    this._botModel = this.levelConfiguration.botModel;
    this._playerModel = this.levelConfiguration.playerModel;

    this._playerFieldController = this.getServiceOrThrow(PlayerFieldController);
    this._enemyFieldController = this.getServiceOrThrow(EnemyFieldController);
  }
}
