import { _decorator, Component, Node, sys } from "cc";
import { Service } from "./Service";
import { TileController } from "../tiles/TileController";
import { TileModel } from "../../models/TileModel";
import { WinGameMenu } from "../menu/WinGameMenu";
import { LoseGameMenu } from "../menu/LoseGameMenu";
import { MatchState } from "../game/MatchState";
const { ccclass, property } = _decorator;

@ccclass("MatchStatisticService")
export class MatchStatisticService extends Service {
  private _matchState: MatchState;

  // startTileStatistic() {
  //   this.playerStat = {
  //     tilesNumber: 0,
  //     swordNumber: 0,
  //     bowNumber: 0,
  //     shieldNumber: 0,
  //   };
  //   this.enemyStat = {
  //     tilesNumber: 0,
  //     swordNumber: 0,
  //     bowNumber: 0,
  //     shieldNumber: 0,
  //   };
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

  // loadStatistic(state: string) {
  //   if (state == "lose") {
  //     this.getService(LoseGameMenu)?.updateStatistic(this._matchState);
  //   } else {
  //     this.getService(WinGameMenu)?.updateStatistic(this._matchState);
  //   }
  // }

  resetMatchStatistic() {
    this._matchState.tilesNumber = 0;
    this._matchState.swordNumber = 0;
    this._matchState.bowNumber = 0;
    this._matchState.shieldNumber = 0;

    this._matchState.tilesNumberEnemy = 0;
    this._matchState.swordNumberEnemy = 0;
    this._matchState.bowNumberEnemy = 0;
    this._matchState.shieldNumberEnemy = 0;

    this.saveMatchState();
  }
}
