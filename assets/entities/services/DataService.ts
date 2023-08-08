import { _decorator } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { EnemyFieldController } from "../enemyField/EnemyFieldController";
import { FieldAnalizer } from "../field/FieldAnalizer";
import { FieldController } from "../field/FieldController";
import { GameManager } from "../game/GameManager";
import { LevelController } from "../level/LevelController";
import { PlayerFieldController } from "../playerField/PlayerFieldController";
import { DebugView } from "../ui/debugger/DebugView";
const { ccclass } = _decorator;
import { Service } from "./Service";
import { LevelConfiguration } from "../configuration/LevelConfiguration";

@ccclass("DataService")
export class DataService extends Service {
  private _debug: DebugView | null | undefined;
  private _manager: GameManager | null | undefined;
  private _levelController: LevelController | null | undefined;
  private _analizer: FieldAnalizer;
  private _botModel: PlayerModel | null;
  private _playerModel: PlayerModel | null;
  private _field: FieldController | null | undefined;
  private _enemyFieldController: EnemyFieldController | null | undefined;
  private _playerFieldController: PlayerFieldController | null | undefined;
  private _levelConfig: LevelConfiguration | null;

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
    if (this._botModel == null) throw Error("Bot model is null");
    return this._botModel;
  }

  public get playerModel() {
    if (this._playerModel == null) throw Error("Player model is null");
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
    if (this._levelConfig == null) throw Error("LevelConfiguration is null");
    return this._levelConfig;
  }

  start() {
    this._debug = this.getService(DebugView);
    this._manager = this.getService(GameManager);
    this._field = this.getService(FieldController);
    this._levelConfig = this.getService(LevelConfiguration);

    if (this.field != undefined) {
      this._analizer = new FieldAnalizer(this.field);
    }

    this._levelController = this.getService(LevelController);
    this._botModel = this.levelConfiguration.botModel;
    this._playerModel = this.levelConfiguration.playerModel;

    this._playerFieldController = this.getService(PlayerFieldController);
    this._enemyFieldController = this.getService(EnemyFieldController);
  }
}
 