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
  log,
} from "cc";
import type { IBot } from "../../bot/IBot";
import { LevelController } from "../level/LevelController";
import { FieldController } from "../field/FieldController";
import { FieldAnalyzer } from "../field/FieldAnalizer";
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
import { MenuSelectorController } from "../menu/MenuSelectorController";
import { Bot_v2 } from "../../bot/Bot_v2";
import { ObjectsCache } from "../../ObjectsCache/ObjectsCache";
import { LevelModel } from "../../models/LevelModel";
import { GameState } from "./GameState";
import { GameStateWritable } from "./GameStateWritable";
import { EffectsService } from "../services/EffectsService";
import { EffectsManager } from "./EffectsManager";
import { EOTInvoker } from "./EOTInvoker";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Service {
  private _debug: DebugView | null | undefined;
  //private _botTurn: boolean;
  private _field: FieldController;
  private _fieldAnalizer: FieldAnalyzer;
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
    .onEnter(() => this.endTurnStateMachine())

    //    .onTimeout(0)
    //    .transitionTo("moveTiles")

    //    .state("moveTiles")
    //    .onEnter(() => this.moveTiles())

    .onTimeout(1100)
    .transitionTo("botTurn")
    .withAction(() => this.beforeBotTurn())
    .withCondition(() => this._gameState.isPlayerTurn == true)
    .transitionTo("playerTurn")
    .withAction(() => this.beforePlayerTurn())
    .withCondition(() => this._gameState.isPlayerTurn == false)

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
  private _menuSelector: MenuSelectorController | null;
  private _gameState: GameStateWritable;
  private _effectsManager: EffectsManager //
    ;
  private _eotInvoker: EOTInvoker;

  public get playerTurn(): boolean {
    return this._gameState.isPlayerTurn;
  }

  start() {
    this._cardService = this.getServiceOrThrow(CardService);
    this._dataService = this.getServiceOrThrow(DataService);
    this._tileService = this.getServiceOrThrow(TileService);
    this._matchStatistic = this.getServiceOrThrow(MatchStatisticService);
    this._audioManager = this.getServiceOrThrow(AudioManagerService);
    this._menuSelector = this.getServiceOrThrow(MenuSelectorController);
    this._gameState = this.getServiceOrThrow(GameStateWritable);
    this._gameState.isPlayerTurn = true;

    this._bot = this.getServiceOrThrow(Bot_v2);
    this._debug = this._dataService?.debugView;
    this.levelController.gameManager = this;
    this._field = this.levelController.fieldController;
    this._field.tileCreator = this.getService(TileCreator);
    this._fieldAnalizer = new FieldAnalyzer(this._field.logicField);

    this._effectsManager = this.getServiceOrThrow(EffectsManager);

    this._eotInvoker = new EOTInvoker(this, this._effectsManager);

    this.behaviourSeletor.Setup(this.getServiceOrThrow(ObjectsCache),
      this._cardService,
      this._dataService,
      this.getServiceOrThrow(LevelModel),
      this._gameState,
      this.getServiceOrThrow(EffectsService),
      this._effectsManager,
      this.getServiceOrThrow(AudioManagerService),
      this._eotInvoker);

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
    this._field.moveTiles();
    this._field.analizeTiles();
    this._field.fixTiles();

    // this._field.updateBackground();
    this.levelController.updateData();

    // start statistic counter
    this._matchStatistic?.startTileStatistic();
  }

  private tileClicked(sender: unknown, tile: TileController): void {
    this.lockUi();

    console.log("[GameManager] Tile clicked");
    this.behaviourSeletor.run(tile);


    this.waitAnimations(() => {
      if (this._stateMachine.getCurrentState() == "playerTurn") {
        this.unlockUi();
      }
      //   this.moveTiles();
    });
  }

  private moveTiles() {
    this._field.moveTilesLogicaly(!this._gameState.isPlayerTurn);
    this._field.fixTiles();
    this._field.Flush();
    this._field.moveTilesAnimate();

  }

  private waitAnimations(action: () => void) {
    const waiter = tween(this);

    waiter.repeatForever(tween(this).call(() => {
      if (!this._effectsManager.effectIsRunning) {
        action();
        waiter.stop();
      }
    }).delay(0.2));

    waiter.start();
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
    this._gameState.isPlayerTurn = true;
    this._debug?.log('Cache size:' + ObjectsCache.instance?.size);
    this.unlockUi();
  }

  canEndTurn(): boolean {
    return true;
  }

  private beforeBotTurn() {
    this.notifyTilesAboutStartOfTurn();

    this._cardService?.resetBonusesForActivePlayer();

    this._cardService?.updateBonusesActiveState();

    this.levelController.updateData();
  }

  private beforePlayerTurn() {

    this.notifyTilesAboutStartOfTurn();

    this._cardService?.resetBonusesForActivePlayer();

    this._cardService?.updateBonusesActiveState();

    this._tileService?.prepareForNewTurn();

    this.levelController.updateData();
  }

  private beforeEndTurn() {
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

  private endTurnStateMachine() {
    const playerModel = this.levelController.playerField.playerModel;
    const enemyModel = this.levelController.enemyField.playerModel;

    this._field.analizeTiles();
    this._field.fixTiles();
    this._field.moveTilesAnimate();

    if (this._gameState.isPlayerTurn) {
      enemyModel.life -= this.countAttackingTiles("end") * playerModel.power;
    } else {
      playerModel.life -= this.countAttackingTiles("start") * enemyModel.power;
    }

    if (playerModel.life <= 0) {
      this._matchStatistic?.loadStatistic("lose");
      this.levelController.showLoseView(true);
    }

    if (enemyModel.life <= 0) {
      this._menuSelector?.openSectionMenu(this, "RewardBlock");
    }

    this.levelController.updateData();
  }

  private startBotTurn() {
    this._gameState.isPlayerTurn = false;
    this._bot?.move();
  }

  private countAttackingTiles(tileNameToAttack: string, ...tags: string[]): number {
    const tiles = this._fieldAnalizer.getAttackingTiles(
      tileNameToAttack,
      this._cardService?.getCurrentPlayerModel(),
      ...tags
    );

    const res = tiles.reduce((sum, current) => sum + current.attackPower, 0);
    return res;
  }

  private notifyTilesAboutEndOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnEnds());
  }

  private notifyTilesAboutStartOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnBegins());
  }

  private notifyTilesToAnimateEndOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnBeginsAnimation());
  }

  private notifyTilesToAnimateStartOfTurn() {
    this.forAllNotDestroiedTiles((t) => t.turnEndsAnimation());
  }

  private forAllNotDestroiedTiles(action: (tile: TileController) => void) {
    this._field.fieldMatrix
      .filter(() => true)
      .forEach((t) => {
        if (!t.isDestroied) action(t);
      });
  }

  public endTurn() {
    this._eotInvoker.endTurn();
  }

  protected update(dt: number): void {
    this._eotInvoker.update();
  }
}