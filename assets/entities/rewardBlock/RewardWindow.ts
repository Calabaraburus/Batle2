import {
  _decorator,
  assert,
  Button,
  Color,
  Component,
  director,
  Label,
  Node,
  Quat,
  Sprite,
  SpriteFrame,
  Tween,
  tween,
  UI,
  UIOpacity,
  Vec3,
} from "cc";
import { BonusModel } from "../../models/BonusModel";
import { WindowManager } from "../infoPanel/WindowManager";
import { Service } from "../services/Service";
import { MenuSelectorController } from "../menu/MenuSelectorController";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { EndLevelLifeBonusModel } from "../configuration/EndLevelLifeBonusModel";
import { EndLevelCardUpdateBonusModel } from "../configuration/EndLevelCardUpdateBonusModel";
import { EndLevelCardSelectorBonusModel } from "../configuration/EndLevelCardSelectorBonusModel";
import { SettingsLoader } from "../services/SettingsLoader";
import { GameState } from "../game/GameState";
const { ccclass, property } = _decorator;

@ccclass("RewardWindow")
export class RewardWindow extends Service {
  @property(Node)
  backCard: Node;

  @property(Node)
  cardUp: Node;

  @property(Node)
  cardChoice: Node;

  @property(Node)
  life: Node;

  private _wManager: WindowManager | null;
  private _config: LevelConfiguration | null;

  quat: Quat = new Quat();
  quatEnd: Quat = new Quat();
  repeat: Tween<Node>;
  quatCardOne: Quat = new Quat();
  quatCardTwo: Quat = new Quat();

  bonusLife: string;
  bonusModelUp: BonusModel | undefined;
  bonusModelSelectorOne: BonusModel | undefined;
  bonusModelSelectorTwo: BonusModel | undefined;

  cardImageOne: Sprite | null | undefined;
  cardImageTwo: Sprite | null | undefined;
  infoButton: Node | null;
  infoButtonTwo: Node | null;
  closeButton: Node | null;
  bGround: Node | null;
  cardFlagSelector: string;

  settingsLoader: SettingsLoader;
  state: GameState;

  timeTurn = 0.6;

  private _lifeBonusActive = false;
  private _cardUpBonusActive = false;
  private _cardSelectorBonusActive = false;

  start() {
    this._wManager = this.getService(WindowManager);
    this._config = this.getService(LevelConfiguration);
    this.cardFlagSelector = "empty";

    const tService = this.getService(SettingsLoader);

    assert(tService != null, "SettingsLoader can't be found");

    this.settingsLoader = tService;

    this.state = this.settingsLoader.gameState;

    this._config?.endLevelBonuses.forEach((bonus) => {
      if (bonus instanceof EndLevelLifeBonusModel) {
        this._lifeBonusActive = true;
        this.bonusLife = bonus.life;
        this.initLife();
      } else if (bonus instanceof EndLevelCardUpdateBonusModel) {
        this.bonusModelUp = this._config?.getBonus(bonus.cardUp);
        this._cardUpBonusActive = true;
        this.initCardUp();
      } else if (bonus instanceof EndLevelCardSelectorBonusModel) {
        this.bonusModelSelectorOne = this._config?.getBonus(bonus.cardOne);
        this.bonusModelSelectorTwo = this._config?.getBonus(bonus.cardTwo);
        this._cardSelectorBonusActive = true;
        this.initCardSelector();
      }
    });

    this.bGround = this.node.getChildByName("Bkground");

    // this.closeButton = this.node.getChildByName("Close");
    // assert(this.closeButton != null, "Do not found Close node");

    this.startAnimateBackCard();

    this.backCard.on(Node.EventType.TOUCH_START, this.openBonus, this);


    // this.closeButton.on(Node.EventType.TOUCH_START, this.closeBonusWindow, this);

    this.infoButton!.on(
      Node.EventType.TOUCH_START,
      this.openInfoOneWindow,
      this
    );

    this.infoButtonTwo!.on(
      Node.EventType.TOUCH_START,
      this.openInfoTwoWindow,
      this
    );

    const cardSelectOne = this.cardChoice.getChildByName("CardOne");
    if (!cardSelectOne) return;
    cardSelectOne.on(Node.EventType.MOUSE_DOWN, this.selectCardOne, this);

    const cardSelectTwo = this.cardChoice.getChildByName("CardTwo");
    if (!cardSelectTwo) return;
    cardSelectTwo.on(Node.EventType.MOUSE_DOWN, this.selectCardTwo, this);

    // this.closeButton.on(Node.EventType.MOUSE_DOWN, this.openStatistic, this);
  }

  initLife() {
    const lifeNum = this.life.getChildByName("Number")?.getComponent(Label);
    if (!lifeNum) return;
    lifeNum.string = "+" + this.bonusLife;
  }

  initCardUp() {
    const cardImage = this.cardUp
      .getChildByName("CardPlace")
      ?.getComponent(Sprite);

    if (!cardImage) return;
    if (!this.bonusModelUp) return;

    cardImage.spriteFrame = this.bonusModelUp.sprite;

    this.infoButton = this.node.getChildByName("InfoUp");
    assert(this.infoButton != null, "Do not found Info node");
  }

  initCardSelector() {
    this.cardImageOne = this.cardChoice
      .getChildByName("CardOne")
      ?.getComponent(Sprite);

    this.cardImageTwo = this.cardChoice
      .getChildByName("CardTwo")
      ?.getComponent(Sprite);

    if (!this.cardImageOne || !this.cardImageTwo) return;
    if (!this.bonusModelSelectorOne || !this.bonusModelSelectorTwo) return;

    this.cardImageOne.spriteFrame = this.bonusModelSelectorOne.unactiveSprite;
    this.cardImageTwo.spriteFrame = this.bonusModelSelectorTwo.unactiveSprite;

    this.infoButton = this.node.getChildByName("InfoSelectOne");
    assert(this.infoButton != null, "Do not found InfoOne node");
    this.infoButtonTwo = this.node.getChildByName("InfoSelectTwo");
    assert(this.infoButtonTwo != null, "Do not found InfoTwo node");
  }

  selectCardOne() {
    tween(this.infoButton?.getComponent(UIOpacity))
      .to(0.2, {
        opacity: 255,
      })
      .start();

    tween(this.infoButtonTwo?.getComponent(UIOpacity))
      .to(0.2, {
        opacity: 150,
      })
      .start();

    Quat.fromEuler(this.quatCardOne, 0, 0, 0);
    tween(this.cardChoice.getChildByName("CardOne"))
      .call(() => {
        this.cardFlagSelector = "One";
        if (!this.cardImageOne || !this.bonusModelSelectorOne) return;
        this.cardImageOne.spriteFrame = this.bonusModelSelectorOne.sprite;
      })
      .to(
        0.6,
        {
          rotation: this.quatCardOne,
          scale: new Vec3(0.9, 0.9, 0.9),
        },
        { easing: "quadIn" }
      )
      .start();

    tween(this.cardChoice.getChildByName("CardTwo"))
      .call(() => {
        if (!this.cardImageTwo || !this.bonusModelSelectorTwo) return;
        this.cardImageTwo.spriteFrame =
          this.bonusModelSelectorTwo.unactiveSprite;
      })
      .to(
        0.6,
        {
          rotation: Quat.IDENTITY,
          scale: new Vec3(0.7, 0.7, 0.7),
        },
        { easing: "quadOut" }
      )
      .start();
  }

  selectCardTwo() {
    tween(this.infoButtonTwo?.getComponent(UIOpacity))
      .to(0.6, {
        opacity: 255,
      })
      .start();

    tween(this.infoButton?.getComponent(UIOpacity))
      .to(0.6, {
        opacity: 150,
      })
      .start();

    Quat.fromEuler(this.quatCardOne, 0, 0, 0);
    tween(this.cardChoice.getChildByName("CardTwo"))
      .call(() => {
        this.cardFlagSelector = "Two";

        if (!this.cardImageTwo || !this.bonusModelSelectorTwo) return;
        this.cardImageTwo.spriteFrame = this.bonusModelSelectorTwo.sprite;
      })
      .to(
        0.6,
        {
          rotation: this.quatCardOne,
          scale: new Vec3(0.9, 0.9, 0.9),
        },
        { easing: "quadIn" }
      )
      .start();

    tween(this.cardChoice.getChildByName("CardOne"))
      .call(() => {
        if (!this.cardImageOne || !this.bonusModelSelectorOne) return;
        this.cardImageOne.spriteFrame =
          this.bonusModelSelectorOne.unactiveSprite;
      })
      .to(
        0.6,
        {
          rotation: Quat.IDENTITY,
          scale: new Vec3(0.7, 0.7, 0.7),
        },
        { easing: "quadOut" }
      )
      .start();
  }

  startAnimateBackCard() {
    const startPos = tween(this.backCard)
      .delay(2)
      .to(0.4, { position: new Vec3(0, 0, 0) }, { easing: "linear" });

    const startScale = tween(this.backCard)
      .delay(2)
      .to(0.5, { scale: new Vec3(1.2, 1.2, 1.2) });

    const start = tween(this.backCard).parallel(startPos, startScale);

    const embedTween = tween(this.backCard).to(
      1,
      { scale: new Vec3(1.2, 1.2, 1.2) },
      { easing: "quadOut" }
    );

    this.repeat = tween(this.backCard)
      .to(1, { scale: new Vec3(1, 1, 1) }, { easing: "quadIn" })
      //   .to(1, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: "quadOut" })
      .repeat(100, embedTween);

    tween(this.bGround?.getComponent(UIOpacity))
      .to(
        2,
        {
          opacity: 65,
        },
        { easing: "linear" }
      )
      .start();

    tween(this.backCard).sequence(start, this.repeat).start();
  }

  openBonus() {
    this.repeat.stop();
    this.turnAnimateBackCard();

    switch (true) {
      case this._lifeBonusActive:
        this.animateLife();
        break;
      case this._cardUpBonusActive:
        this.animateCardUp();
        break;
      case this._cardSelectorBonusActive:
        this.animateCardSelector();
        break;
    }
  }

  turnAnimateBackCard() {
    Quat.fromEuler(this.quat, 0, 90, 0);

    tween(this.backCard)
      .to(
        this.timeTurn,
        {
          rotation: this.quat,
        },
        { easing: "quadIn" }
      )
      .call(() => {
        this.backCard.active = false;
      })
      .start();
  }

  animateCardUp() {
    Quat.fromEuler(this.quatEnd, 0, 0, 0);

    tween(this.cardUp)
      .delay(this.timeTurn)
      .call(() => {
        this.cardUp.active = true;
      })
      .to(0.6, { rotation: this.quatEnd }, { easing: "quadOut" })
      .delay(0.6)
      .call(() => {
        this.infoButton!.active = true;
        this.closeButton!.active = true;
      })
      .start();
  }

  animateCardSelector() {
    Quat.fromEuler(this.quatEnd, 0, 0, 0);

    tween(this.cardChoice)
      .delay(this.timeTurn)
      .call(() => {
        this.cardChoice.active = true;
      })
      .to(0.6, { rotation: this.quatEnd }, { easing: "quadOut" })
      .delay(0.6)
      .call(() => {
        this.infoButton!.active = true;
        this.infoButtonTwo!.active = true;
        this.closeButton!.active = true;
      })
      .start();

    Quat.fromEuler(this.quatCardOne, 0, 0, 4);
    tween(this.cardChoice.getChildByName("CardOne"))
      .delay(this.timeTurn)
      .to(
        0.6,
        {
          position: new Vec3(-250, 0, 0),
          rotation: this.quatCardOne,
          scale: new Vec3(0.7, 0.7, 0.7),
        },
        { easing: "quadIn" }
      )
      // .to(0.6, { rotation: this.quatCardOne }, { easing: "quadIn" })
      // .to(0.6, { scale: new Vec3(0.7, 0.7, 0.7) })
      .start();

    Quat.fromEuler(this.quatCardTwo, 0, 0, -2);

    tween(this.cardChoice.getChildByName("CardTwo"))
      .delay(this.timeTurn)
      .to(
        0.6,
        {
          position: new Vec3(250, 0, 0),
          rotation: this.quatCardTwo,
          scale: new Vec3(0.7, 0.7, 0.7),
        },
        { easing: "quadIn" }
      )
      // .to(0.6, { rotation: this.quatCardTwo }, { easing: "quadIn" })
      // .to(0.6, { scale: new Vec3(0.7, 0.7, 0.7) })
      .start();
  }

  animateLife() {
    Quat.fromEuler(this.quatEnd, 0, 0, 4);

    tween(this.life)
      .delay(this.timeTurn)
      .call(() => {
        this.life.active = true;
      })
      .to(0.6, { rotation: this.quatEnd }, { easing: "quadOut" })
      .delay(1)
      .call(() => {
        this.closeButton!.active = true;
      })
      .start();
  }

  openInfoOneWindow() {
    switch (true) {
      case this._cardUpBonusActive:
        this._wManager?.showCardWindow(this.bonusModelUp);
        break;
      case this._cardSelectorBonusActive:
        if (this.cardFlagSelector == "One") {
          this._wManager?.showCardWindow(this.bonusModelSelectorOne);
        }
        break;
    }
  }

  openInfoTwoWindow() {
    if (this.cardFlagSelector == "Two") {
      this._wManager?.showCardWindow(this.bonusModelSelectorTwo);
    }
  }

  closeBonusWindow() {
    const menuSelector = this.getService(MenuSelectorController);
    if (!menuSelector) return;

    switch (true) {
      case this._lifeBonusActive:
        this.state.lifeHero += parseFloat(this.bonusLife);
        menuSelector.openSectionMenu(this, "WinBlock");
        break;
      case this._cardUpBonusActive:
        this.state.cards.push(this.bonusModelSelectorOne!.mnemonic);
        break;
      case this._cardSelectorBonusActive:
        if (this.cardFlagSelector == "One") {
          this.state.cards.push(this.bonusModelSelectorOne!.mnemonic);
          menuSelector.openSectionMenu(this, "WinBlock");
        } else if (this.cardFlagSelector == "Two") {
          this.state.cards.push(this.bonusModelSelectorTwo!.mnemonic);
          menuSelector.openSectionMenu(this, "WinBlock");
        }
        break;
    }

    this.settingsLoader.saveGameState();
  }
}
