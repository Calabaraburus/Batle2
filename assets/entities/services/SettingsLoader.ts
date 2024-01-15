import { _decorator, Component, game, Node, sys } from "cc";
import { GameParameters } from "../game/GameParameters";
import { GameState } from "../game/GameState";
import { Service } from "./Service";
import { GameConfigurationModel } from "../game/GameConfiguration";
const { ccclass, property } = _decorator;

@ccclass("SettingsLoader")
export class SettingsLoader extends Service {
  private _gameState: GameState;
  private _gameParameters: GameParameters;
  private _gameConfiguration: GameConfigurationModel;

  public get gameConfiguration(): GameConfigurationModel {
    return this._gameConfiguration;
  }

  public get gameParameters(): GameParameters {
    return this._gameParameters;
  }

  public get gameState(): GameState {
    return this._gameState;
  }

  constructor() {
    super();
    this.loadParameters();
    this.loadGameState();
    this.loadGameConfiguration();
  }

  public loadGameConfiguration() {
    const data = sys.localStorage.getItem("gameConfiguration");

    if (data == null) {
      this._gameConfiguration = GameConfigurationModel.getDefaultConfig();
    } else {
      this._gameConfiguration = JSON.parse(data);
    }

    return this._gameConfiguration;
  }

  public loadParameters(): GameParameters {
    const data = sys.localStorage.getItem("gameParameters");

    if (data == null) {
      this._gameParameters = new GameParameters();
    } else {
      this._gameParameters = JSON.parse(data);
    }

    return this._gameParameters;
  }

  public saveConfiguration() {
    sys.localStorage.setItem(
      "gameConfiguration",
      JSON.stringify(this._gameConfiguration)
    );
  }

  public removeConfiguration() {
    sys.localStorage.removeItem("gameConfiguration");
  }

  public saveParameters() {
    sys.localStorage.setItem(
      "gameParameters",
      JSON.stringify(this._gameParameters)
    );
  }

  public loadGameState(): GameState {
    const data = sys.localStorage.getItem("gameState");

    if (data == null) {
      this._gameState = new GameState();
    } else {
      this._gameState = JSON.parse(data);
    }

    return this._gameState;
  }

  public saveGameState() {
    sys.localStorage.setItem("gameState", JSON.stringify(this._gameState));
  }
}
