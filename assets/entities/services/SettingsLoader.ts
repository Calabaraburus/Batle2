import { _decorator, Component, game, Node, sys } from "cc";
import { GameParameters } from "../game/GameParameters";
import { GameState } from "../game/GameState";
import { Service } from "./Service";
const { ccclass, property } = _decorator;

@ccclass("SettingsLoader")
export class SettingsLoader extends Service {
  private _gameState: GameState;
  private _gameParameters: GameParameters;

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
