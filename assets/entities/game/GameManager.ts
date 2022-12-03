//  gameManager.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { Component, debug, director, _decorator } from "cc";
import { Bot } from "../../bot/Bot";
import type { IBot } from "../../bot/IBot";
import { LevelController } from "../level/LevelController";
import { FieldController } from "../field/FieldController";
import { FieldAnalizer } from "../field/FieldAnalizer";
import Finity from "finity";
import { StateMachine } from "finity";
import { BehaviourSelector } from "../behaviours/BehaviourSelector";
import { TileController } from "../tiles/TileController";
import { DebugView } from "../ui/debugger/DebugView";
import { Service } from "../services/Service";
import { CardService } from "../services/CardService";
import { DataService } from "../services/DataService";
import { TileService } from "../services/TileService";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Service {
  private _debug: DebugView | null | undefined;
  private _botTurn: boolean;
  private _field: FieldController;
  private _fieldAnalizer: FieldAnalizer;
  private _cardService: CardService | null;
  private _dataService: DataService | null;
  private _tileService: TileService | null;
  private _bot: IBot | null;

  @property({ type: LevelController })
  levelController: LevelController;

  @property({ type: BehaviourSelector })
  behaviourSeletor: BehaviourSelector;

  private readonly _stateMachineConfig = Finity.configure()
    .initialState("initGame")
    .onEnter(() => this.initGame())

    .on("gameStartEvent")
    .transitionTo("playerTurn")

    .state("playerTurn")
    .onEnter(() => this.startPlayerTurn())

    .on("endTurnEvent")
    .transitionTo("endTurn")
    .withCondition(() => this.canEndTurn())
    .transitionTo("playerTurn")

    .state("endTurn")
    .onEnter(() => this.endTurn())

    //    .onTimeout(0)
    //    .transitionTo("moveTiles")

    //    .state("moveTiles")
    //    .onEnter(() => this.moveTiles())

    .onTimeout(1100)
    .transitionTo("botTurn")
    .withAction(() => this.beforeBotTurn())
    .withCondition(() => this._botTurn == false)
    .transitionTo("playerTurn")
    .withAction(() => this.beforePlayerTurn())
    .withCondition(() => this._botTurn == true)

    .state("botTurn")
    .onEnter(() => this.startBotTurn())

    .on("endTurnEvent")
    .transitionTo("endTurn")

    .global()
    .onStateEnter((state) => {
      //console.log(`Entering state '${state}'`);
      this._debug?.log(`Entering state '${state}'`);
    })
    .onStateExit((state) => {
      this._debug?.log(`Exit state '${state}'`);
    });

  private _stateMachine: StateMachine<string, string>;

  public get playerTurn(): boolean {
    return !this._botTurn;
  }

  start() {
    this._cardService = this.getService(CardService);
    this._dataService = this.getService(DataService);
    this._tileService = this.getService(TileService);
    this._bot = this.getService(Bot);
    this._debug = this._dataService?.debugView;
    this.levelController.gameManager = this;
    this._field = this.levelController.fieldController;
    this._fieldAnalizer = new FieldAnalizer(this._field);
    this._stateMachine = this._stateMachineConfig.start();
    this._stateMachine.handle("gameStartEvent");
  }

  initGame(): void {
    this._field.tileClickedEvent.on("FieldController", this.tileClicked, this);
    this._field.generateTiles();
    const analizedData = this._fieldAnalizer.analize();
    this._field.fixTiles(analizedData);

    this._field.updateBackground();
    this.levelController.updateData();
  }

  private tileClicked(sender: unknown, tile: TileController): void {
    console.log("onManagerClick___________________");
    this.behaviourSeletor.run(tile);

    // if (!this.behaviourSeletor.hasActiveBehaviours()) {
    //   this._stateMachine.handle("endTurnEvent");
    // }
  }

  public changeGameState(stateName: string) {
    this._stateMachine.handle(stateName);
  }

  public currentGameState() {
    return this._stateMachine.getCurrentState();
  }

  private _uiIsLocked: boolean;
  public get uiIsLocked() {
    return this._uiIsLocked;
  }

  public unlockUi(): void {
    this._uiIsLocked = true;
    this.levelController.lockTuch(false);
  }

  public lockUi(): void {
    this._uiIsLocked = false;
    this.levelController.lockTuch(true);
  }

  public get isBehavioursInProccess() {
    return this.behaviourSeletor.hasBehavioursInProccess();
  }

  startPlayerTurn(): void {
    this._botTurn = false;
    this.unlockUi();
  }

  canEndTurn(): boolean {
    //this._analizedData = this._fieldAnalizer.analize();
    return true; //this._analizedData.destroiedTilesCount != 0;
  }

  beforeBotTurn() {
    // const playerModel = this.levelController.enemyField.playerModel;
    // playerModel.manaCurrent += playerModel.manaIncreaseCoeficient;
    this._cardService?.resetBonusesForActivePlayer();
    this.levelController.updateData();
  }

  beforePlayerTurn() {
    // const playerModel = this.levelController.playerField.playerModel;
    // playerModel.manaCurrent += playerModel.manaIncreaseCoeficient;
    this._cardService?.resetBonusesForActivePlayer();

    this._tileService?.prepareForNewTurn();

    this.levelController.updateData();
  }

  endTurn() {
    const playerModel = this.levelController.playerField.playerModel;
    const enemyModel = this.levelController.enemyField.playerModel;

    if (this._botTurn) {
      playerModel.life -=
        this.countAttackingTiles("start", "enemy") * enemyModel.power;
    } else {
      enemyModel.life -=
        this.countAttackingTiles("end", "player") * playerModel.power;
    }

    if (playerModel.life <= 0) {
      this.levelController.showLoseView(true);
    }

    if (enemyModel.life <= 0) {
      this.levelController.showWinView(true);
    }

    this.levelController.updateData();

    // this._field.fixTiles(this._analizedData);
    // this._field.updateBackground();
    //s this._field.Flush();
  }

  moveTiles(): void {
    this._field.moveTilesAnimate();
  }

  updateEndTurnUI() {
    debug("");
  }

  startBotTurn() {
    this._botTurn = true;
    this._bot?.move();
  }

  countAttackingTiles(tileNameToAttack: string, ...tags: string[]): number {
    return this._fieldAnalizer.getAttackingTiles(tileNameToAttack, ...tags)
      .length;
  }

  playerWin() {
    debug("");
  }

  playerLose() {
    debug("");
  }
}
