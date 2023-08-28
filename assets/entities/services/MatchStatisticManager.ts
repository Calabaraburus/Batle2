import { _decorator, Component, Node, sys } from "cc";
import { Service } from "./Service";
import { TileController } from "../tiles/TileController";
import { TileModel } from "../../models/TileModel";
import { GameState } from "../game/GameState";
import { MatchState } from "../game/MatchState";
const { ccclass, property } = _decorator;

@ccclass("MatchStatisticService")
export class MatchStatisticService extends Service {
  private _matchState: MatchState;

  tilesNumber: number;
  swordNumber: number;
  bowNumber: number;
  shieldNumber: number;

  tilesNumberEnemy: number;
  swordNumberEnemy: number;
  bowNumberEnemy: number;
  shieldNumberEnemy: number;

  // startTileStatistic() {
  //   this.tilesNumber = 0;
  //   this.swordNumber = 0;
  //   this.bowNumber = 0;
  //   this.shieldNumber = 0;

  //   this.tilesNumberEnemy = 0;
  //   this.swordNumberEnemy = 0;
  //   this.bowNumberEnemy = 0;
  //   this.shieldNumberEnemy = 0;
  // }

  updateTapTileStatistic(tilesNumber: number, typeTile: TileModel) {
    switch (typeTile.tileName) {
      case "b":
        this._matchState.tilesNumber += tilesNumber;
        this._matchState.swordNumber += tilesNumber;
        break;
      case "k":
        this._matchState.tilesNumber += tilesNumber;
        this._matchState.bowNumber += tilesNumber;
        break;
      case "g":
        this._matchState.tilesNumber += tilesNumber;
        this._matchState.shieldNumber += tilesNumber;
        break;
      case "r":
        this._matchState.tilesNumberEnemy += tilesNumber;
        this._matchState.swordNumberEnemy += tilesNumber;
        break;
      case "p":
        this._matchState.tilesNumberEnemy += tilesNumber;
        this._matchState.bowNumberEnemy += tilesNumber;
        break;
      case "y":
        this._matchState.tilesNumberEnemy += tilesNumber;
        this._matchState.shieldNumberEnemy += tilesNumber;
        break;
    }

    this.saveMatchState();
  }

  constructor() {
    super();
    this.loadMatchState();
  }

  public loadMatchState(): MatchState {
    const data = sys.localStorage.getItem("matchState");

    if (data == null) {
      this._matchState = new MatchState();
    } else {
      this._matchState = JSON.parse(data);
    }

    return this._matchState;
  }

  public saveMatchState() {
    sys.localStorage.setItem("matchState", JSON.stringify(this._matchState));
  }
}
