//  gameManager.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, debug, _decorator } from "cc";
// import { Bot } from "../../bot/Bot";
// import { IBot } from "../../bot/IBot";
import { LevelController } from "../level/LevelController";
import { FieldController } from "../field/FieldController";
import { FieldAnalizer } from "../field/FieldAnalizer";
import Finity from "finity";
import { StateMachine } from "finity";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: LevelController })
  levelController: LevelController;

  // @property({ type: Bot })
  // bot: IBot;

  private _field: FieldController;
  private _fieldAnalizer: FieldAnalizer;

  private readonly _stateMachineConfig = Finity.configure()
    .initialState("initGame")
    .onEnter(() => this.initGame())
    .on("gameStartEvent")
    .transitionTo("playerTurn")
    .state("playerTurn")
    .onEnter(() => this.startPlayerTurn())
    .global()
    .onStateEnter((state) => console.log(`Entering state '${state}'`));

  private _stateMachine: StateMachine<string, string>;

  start() {
    this._field = this.levelController.fieldController;
    this._fieldAnalizer = new FieldAnalizer(this._field);
    this._stateMachine = this._stateMachineConfig.start();
    this._stateMachine.handle("gameStartEvent");
  }

  initGame() {
    this._field.tileClickedEvent.on("FieldController", this.tileClicked, this);
    this._field.generateTiles();
    const analizedData = this._fieldAnalizer.analize();
    this._field.setTilesSpeciality(analizedData);
    this._field.fixTiles(analizedData);
  }

  startPlayerTurn(): void {
    debug("");
  }

  private tileClicked(): void {
    debug("");
  }

  endTurn() {
    debug("");
  }

  startBotTurn() {
    debug("");
  }

  playerWin() {
    debug("");
  }

  playerLose() {
    debug("");
  }
}
