//  gameManager.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  Component,
  debug,
  director,
  tween,
  _decorator,
  assert,
  AudioSource,
} from "cc";
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
import { TileCreator } from "../field/TileCreator";
import { MatchStatisticService } from "../services/MatchStatisticService";
import { AudioManager } from "../../soundsPlayer/AudioManager";
import { AudioManagerService } from "../../soundsPlayer/AudioManagerService";

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
  private _matchStatistic: MatchStatisticService | null;
  private _audioManager: AudioManagerService;

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
    .transitionTo("beforeEndTurn")
    .withCondition(() => this.canEndTurn())
    .transitionTo("playerTurn")

    .state("beforeEndTurn")
    .onEnter(() => this.beforeEndTurn())
    .on("endTurnServiceEvent")
    .transitionTo("endTurn")
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
    .transitionTo("beforeEndTurn")

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
    this._matchStatistic = this.getService(MatchStatisticService);
    this._audioManager = this.getServiceOrThrow(AudioManagerService);

    this._bot = this.getService(Bot);
    this._debug = this._dataService?.debugView;
    this.levelController.gameManager = this;
    this._field = this.levelController.fieldController;
    this._field.tileCreator = this.getService(TileCreator);
    this._field.setDataService(this._dataService);

    this._fieldAnalizer = new FieldAnalizer(this._field);
    this._stateMachine = this._stateMachineConfig.start();
    this._stateMachine.handle("gameStartEvent");
  }

  initGame(): void {
    director
      .getScene()
      ?.getChildByName("__audioMgr__")
      ?.getComponent(AudioSource)
      ?.stop();

    this._audioManager.playMusic("epic");

    this._field.tileClickedEvent.on("FieldController", this.tileClicked, this);
    this._field.generateTiles();

    this._field.analizeTiles();
    this._field.fixTiles();

    this._field.updateBackground();
    this.levelController.updateData();

    // start statistic counter
    this._matchStatistic?.startTileStatistic();
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
    this.notifyTilesAboutStartOfTurn();

    this._cardService?.resetBonusesForActivePlayer();

    this._cardService?.updateBonusesActiveState();

    this.levelController.updateData();
  }

  beforePlayerTurn() {
    // const playerModel = this.levelController.playerField.playerModel;
    // playerModel.manaCurrent += playerModel.manaIncreaseCoeficient;
    this.notifyTilesAboutStartOfTurn();

    this._cardService?.resetBonusesForActivePlayer();

    this._cardService?.updateBonusesActiveState();

    this._tileService?.prepareForNewTurn();

    this.levelController.updateData();
  }

  beforeEndTurn() {
    const schedule = tween(this);

    schedule
      .delay(0.4)
      .call(() => this.notifyTilesAboutEndOfTurn())
      .delay(0.8)
      .call(() => {
        this._stateMachine.handle("endTurnServiceEvent");
      });

    schedule.start();
  }

  endTurn() {
    const playerModel = this.levelController.playerField.playerModel;
    const enemyModel = this.levelController.enemyField.playerModel;

    this._field.analizeTiles();
    this._field.fixTiles();
    this._field.moveTilesAnimate();

    if (this._botTurn) {
      playerModel.life -= this.countAttackingTiles("start") * enemyModel.power;
    } else {
      enemyModel.life -= this.countAttackingTiles("end") * playerModel.power;
    }

    if (playerModel.life <= 0) {
      this._matchStatistic?.loadStatistic("lose");
      this.levelController.showLoseView(true);
    }

    if (enemyModel.life <= 0) {
      this._matchStatistic?.loadStatistic("win");
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
    const tiles = this._fieldAnalizer.getAttackingTiles(
      tileNameToAttack,
      this._cardService?.getCurrentPlayerModel(),
      ...tags
    );

    const res = tiles.reduce((sum, current) => sum + current.attackPower, 0);
    return res;
  }

  playerWin() {
    debug("");
  }

  playerLose() {
    debug("");
  }

  notifyTilesAboutEndOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnEnds());
  }

  notifyTilesAboutStartOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnBegins());
  }

  notifyTilesToAnimateEndOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnBeginsAnimation());
  }

  notifyTilesToAnimateStartOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnEndsAnimation());
  }

  forAllNotDestroiedTiles(action: (tile: TileController) => void) {
    this._field.fieldMatrix
      .filter(() => true)
      .forEach((t) => {
        if (!t.isDestroied) action(t);
      });
  }
}
