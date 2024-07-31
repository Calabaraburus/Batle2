//  MineTileController.ts - ClbBlast
//
//  Calabaraburus (c) 2023
//

import {
  _decorator,
  Sprite,
  Vec3,
  instantiate,
  Prefab,
  UITransform,
  randomRangeInt,
  tween,
  Node,
  CCFloat,
  math,
  director,
  assert
} from "cc";
import { TileController } from "../TileController";
import { TileModel } from "../../../models/TileModel";
import { TileState } from "../TileState";
import { IAttackable, isIAttackable } from "../IAttackable";
import { GameManager } from "../../game/GameManager";
import { CardService } from "../../services/CardService";
import { PlayerModel } from "../../../models/PlayerModel";
import { FieldController } from "../../field/FieldController";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { EffectsService } from "../../services/EffectsService";
import { AudioManagerService } from "../../../soundsPlayer/AudioManagerService";
import { Service } from "../../services/Service";
import { DataService } from "../../services/DataService";
import { EffectsManager } from "../../game/EffectsManager";
import { LifeIndicator_v2 } from "../LifeIndicator_v2";
import { loseLifeLabel } from "../../playerField/loseLifeEffect/loseLifeLabel";
import { TaskInfo } from "../../ui/taskInfo/TaskInfo";
import { MonkSummonerTileController } from "../MonkSummonerTile/MonkSummonerTileController";
const { ccclass, property } = _decorator;

@ccclass("MonkTileController")
export class MonkTileController
  extends TileController
  implements IAttackable {
  private _cardService: CardService;
  private _state: TileState;
  private _gameManager: GameManager;

  private _dataService: DataService;
  private _fieldViewController: FieldController;
  private _effectsManager: EffectsManager;
  private _audio: AudioManagerService;
  private _curLife: number;

  @property(CCFloat)
  public Life: number = 6;
  private _lifeIndicator: LifeIndicator_v2 | null;
  private _created = true;
  private _lvlViewNode: Node;
  private _info: TaskInfo | null;

  private _summoner: MonkSummonerTileController;

  start() {
    super.start();
    this.isFixed = true;
    this._cardService = Service.getServiceOrThrow(CardService);
    this._dataService = Service.getServiceOrThrow(DataService);
    this._gameManager = Service.getServiceOrThrow(GameManager);
    this._fieldViewController = Service.getServiceOrThrow(FieldController);
    this._effectsManager = Service.getServiceOrThrow(EffectsManager);
    this._audio = Service.getServiceOrThrow(AudioManagerService);
    this._lifeIndicator = this.getComponentInChildren(LifeIndicator_v2);

    this.loadLvlViewNode();
    this.updateSprite();
    this.setLife();
    this._created = true;
  }

  setSummoner(summoner: MonkSummonerTileController) {
    this._summoner = summoner;
  }

  setLife() {
    this._curLife = this.Life;

    if (this._lifeIndicator) {
      this._lifeIndicator.activeLifes = this.Life;
      this._lifeIndicator.maxLifes = this.Life;
    }
  }

  turnBegins(): void {
    if (this._created) {
      this._created = false;
      return;
    }

    if (this._cardService?.getCurrentPlayerModel() != this.playerModel) {
      this.moveMonk();
    } else {
      this.tryToAttackMonk();
    }
  }

  tryToAttackMonk() {
    const prev = this.fieldController.fieldMatrix.get(this.row + 1, this.col);
    const nxt = this.fieldController.fieldMatrix.get(this.row + 1, this.col);

    if (prev.playerModel == nxt.playerModel && prev.playerModel != this.playerModel) {
      this.attack(1);
    }
  }

  moveMonk() {

    let vectorAttack = 1;

    if (this.playerModel == this._dataService.botModel) {
      vectorAttack = -1;
    }

    if ((this.row + vectorAttack) == this.fieldController.getEndTile(this.col)?.row) {
      this.destroyMonk();
      this.infoAboutSurvive();
    } else {
      const matrix = this.fieldController.fieldMatrix;

      const aimTile = matrix.get(this.row + vectorAttack, this.col);

      if (!aimTile) {
        return;
      }

      this.exchangeTile(aimTile);

      this.fieldController.moveTilesLogicaly(this._gameManager.playerTurn);
      this.fieldController.fixTiles();

      this._effectsManager.PlayEffectNow(() => this.playMoveEffect(), 0.6)
    }
  }

  destroyMonk() {
    this.fakeDestroy();

    this.fieldController.moveTilesLogicaly(this._gameManager.playerTurn);
    this.fieldController.fixTiles();
    this.playDestroyEffect();
  }

  exchangeTile(aimTile: TileController) {
    this.fieldController.exchangeTiles(aimTile, this);
  }

  public cacheCreate(): void {
    super.cacheCreate();

    this.setLife();

    this._created = true;
  }

  public setModel(tileModel: TileModel) {
    super.setModel(tileModel);

    this.setLife();

    this._created = true;
  }

  /** Attack this enemy with power.
   * @power Power.
   */
  public attack(power = 1) {
    this._curLife -= power;
    this._effectsManager.PlayEffectNow(() => this.playAttackEffect(), 0.6);

    if (this._curLife < 0) {
      this.destroyMonk();
      this.infoAboutDth();
    } else {
      if (this._lifeIndicator) {
        this._lifeIndicator.activeLifes = this._curLife;
      }
    }
  }

  playAttackEffect() {
    console.log("monk attack effect");

    const cache = ObjectsCache.instance;
    if (cache == null) return;

    const label = cache.getObjectByName<loseLifeLabel>("loseLifeLabel");
    if (label) {
      label.node.parent = null;
      label.node.parent = this._lvlViewNode;
    }
    const pos = this.node.worldPosition.clone();
    pos.x += math.randomRange(-50, 50);
    pos.y += math.randomRange(-50, 50);
    label?.play(-1, pos);
  }

  infoAboutDth() {
    this._summoner.informAboutMonkDeath();
  }

  infoAboutSurvive() {
    this._summoner.informAboutMonkSurvive();
  }

  playDestroyEffect() {
    this.node.active = false;
    this._fieldViewController.moveTilesAnimate();
  }

  playMoveEffect() {
    this._fieldViewController.moveTilesAnimate();
  }

  loadLvlViewNode() {
    const tlvlViewNode = director.getScene()?.getChildByName("LevelView");
    if (tlvlViewNode) {
      this._lvlViewNode = tlvlViewNode;
    }
  }
}
