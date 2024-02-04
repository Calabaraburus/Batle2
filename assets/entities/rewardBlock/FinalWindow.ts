import {
  _decorator,
  assert,
  Color,
  Label,
  Material,
  math,
  Node,
  Quat,
  Sprite,
  Tween
} from "cc";
import { BonusModel } from "../../models/BonusModel";
import { Service } from "../services/Service";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { EndLevelLifeBonusModel } from "../configuration/EndLevelLifeBonusModel";
import { EndLevelCardUpdateBonusModel } from "../configuration/EndLevelCardUpdateBonusModel";
import { EndLevelCardSelectorBonusModel } from "../configuration/EndLevelCardSelectorBonusModel";
import { SettingsLoader } from "../services/SettingsLoader";
import { PlayerCurrentGameState } from "../services/PlayerCurrentGameState";
import { OverlayWindow } from "../menu/OverlayWindow";
import { Window } from "../ui/window/Window";
import { EndLevelBonusModel } from "../configuration/EndLevelBonusModel";
import { SceneLoaderService } from "../services/SceneLoaderService";
import { config } from "chai";

const { ccclass, property } = _decorator;

@ccclass("FinalWindow")
export class FinalWindow extends Service {
  @property(Node)
  backCard: Node;

  @property(Node)
  cardUp: Node;

  @property(Node)
  cardChoice: Node;

  @property(Node)
  life: Node;

  @property(Node)
  rewardGroup: Node;

  @property(Material)
  materialForDisables: Material = new Material();

  @property(Material)
  defaultMaterial = new Material();

  //@property(Color)
  colorForDisables: math.Color = Color.GRAY;

  //@property(Color)
  colorForEnables: math.Color = Color.WHITE;


  private _config: LevelConfiguration;
  private _bonusOperations = new Map<{ new(): EndLevelBonusModel },
    {
      init: (bonus: EndLevelBonusModel) => void,
      open: (bonus: EndLevelBonusModel) => void,
      close: (bonus: EndLevelBonusModel) => void
    }>;

  bonusLife: string;

  private _cardImageOne: Sprite | null | undefined;
  private _cardImageTwo: Sprite | null | undefined;
  private _cardFlagSelector: string;

  private _settingsLoader: SettingsLoader;
  private _state: PlayerCurrentGameState;

  timeTurn = 0.6;

  private _selectedBonus: { name: string, price: string } = { name: "", price: "" };

  private _overlayWnd: OverlayWindow | null;
  private _wnd: Window | null;
  private _sceneLoader: SceneLoaderService;

  start() {
    this._config = this.getServiceOrThrow(LevelConfiguration);
    this._overlayWnd = this.getComponent(OverlayWindow);
    this._wnd = this.getComponent(Window);
    this._sceneLoader = this.getServiceOrThrow(SceneLoaderService);

    this._cardFlagSelector = "empty";

    const tService = this.getService(SettingsLoader);

    assert(tService != null, "SettingsLoader can't be found");

    this._settingsLoader = tService;

    this._state = this._settingsLoader.playerCurrentGameState;

    this._bonusOperations.set(EndLevelLifeBonusModel, {
      init: (bonus) => {
        if (bonus instanceof EndLevelLifeBonusModel) {
          this.bonusLife = bonus.life;

          this.initLife();
        }
      },
      open: () => {

      }, close: () => {
        this.addLifeToCurrentState();
      }
    });
    this._bonusOperations.set(EndLevelCardUpdateBonusModel, {
      init: (bonus) => {
        if (bonus instanceof EndLevelCardUpdateBonusModel) {
          this.initCardUp(bonus);
        }
      },
      open: () => {

      }, close: (bonus) => {
        if (bonus instanceof EndLevelCardUpdateBonusModel) {
          this.addBonusToCurrentState(bonus.cardMnemonic, bonus.cardPrice.toString());
        }
      }
    });
    this._bonusOperations.set(EndLevelCardSelectorBonusModel, {
      init: (bonus) => {
        if (bonus instanceof EndLevelCardSelectorBonusModel) {
          this.initCardSelector(bonus);
        }
      },
      open: () => {

      },
      close: () => {
        const sBonus = this._config?.getBonus(this._selectedBonus.name);
        if (sBonus) {

          let bonusIsUpdated = false;
          // try to update bonus
          bonusIsUpdated = this.tryToUpdateBonus(sBonus);

          if (!bonusIsUpdated) {
            this.addBonusToCurrentState(this._selectedBonus.name, this._selectedBonus.price);
          }
        }
      }
    });

    this.initBonuses();
  }

  canUpdateCurStateData() {
    return !this._state.levelExists(this._config.levelName);
  }

  private tryToUpdateBonus(sBonus: BonusModel) {
    if (this.canUpdateCurStateData()) {
      return false;
    }

    let bonusIsUpdated: boolean = false;

    this._state.cards.forEach(c => {
      const b = this._config?.getBonus(c.mnemonic);
      if (b != null && b.baseCardMnemonic == sBonus.baseCardMnemonic) {
        c.mnemonic = sBonus.mnemonic;
        bonusIsUpdated = true;
      }
    });
    return bonusIsUpdated;
  }

  private addLifeToCurrentState() {
    if (this.canUpdateCurStateData()) {
      return false;
    }

    this._state.life += parseFloat(this.bonusLife);
  }

  private addBonusToCurrentState(mnemonic: string, price: string) {
    if (this.canUpdateCurStateData()) {
      return false;
    }

    this._state.cards.push({ mnemonic: mnemonic, price: price });
  }

  initBonuses() {
    this._config?.endLevelBonuses.forEach(b => {
      const operations = this._bonusOperations.get(b.constructor);
      operations?.init(b);
    });
  }

  closeBonusEvents() {
    this._config?.endLevelBonuses.forEach(b => {
      const operations = this._bonusOperations.get(b.constructor);
      operations?.close(b);
    });
  }

  showWindowTst() {
    this.showWindow();
  }

  rewardNextPress() {
    this._wnd?.showContentGroup('win');
  }

  showWindow(win: boolean = true) {
    this._overlayWnd?.showWindow();

    if (win) {
      if (this._config!.endLevelBonuses.length > 0) {
        this._wnd?.showContentGroup('reward');
      } else {
        this._wnd?.showContentGroup('win');
      }
    } else {
      this._wnd?.showContentGroup('lose');
    }
  }

  hideWindow() {
    this._overlayWnd?.hideWindow();
  }

  initLife() {
    const lifeNum = this.life.getChildByName("Number")?.getComponent(Label);
    if (!lifeNum) return;
    lifeNum.string = "+" + this.bonusLife;
    this.life.active = true;
  }

  initCardUp(bonus: EndLevelCardUpdateBonusModel) {
    const cardImage = this.cardUp
      .getChildByName("CardPlace")
      ?.getComponent(Sprite);

    const bonusModelUp = this._config?.getBonus(bonus.cardMnemonic);

    if (!cardImage) return;
    if (!bonusModelUp) return;
    this.cardUp.active = true;
    cardImage.spriteFrame = bonusModelUp.sprite;

  }

  initCardSelector(bonus: EndLevelCardSelectorBonusModel) {

    const bonusModelSelectorOne = this._config?.getBonus(bonus.cardOne);
    const bonusModelSelectorTwo = this._config?.getBonus(bonus.cardTwo);

    this._cardImageOne = this.cardChoice
      .getChildByName("CardOne")
      ?.getComponent(Sprite);

    this._cardImageTwo = this.cardChoice
      .getChildByName("CardTwo")
      ?.getComponent(Sprite);

    assert(this._cardImageOne != null);
    assert(this._cardImageTwo != null);

    if (!bonusModelSelectorOne || !bonusModelSelectorTwo) return;

    this.cardChoice.active = true;
    this._cardImageOne.spriteFrame = bonusModelSelectorOne.sprite;
    this._cardImageTwo.spriteFrame = bonusModelSelectorTwo.sprite;

    const c1Node = this._cardImageOne.node;
    const c2Node = this._cardImageTwo.node;

    let enableCard = (s: Sprite | null | undefined, enable = true) => {
      if (s != null) {
        s.material = enable ? this.defaultMaterial : this.materialForDisables;
        s.color = enable ? this.colorForEnables : this.colorForDisables;
      }

    };

    enableCard = enableCard.bind(this);

    enableCard(this._cardImageOne, false);
    enableCard(this._cardImageTwo, false);

    const selectCard = (s: Sprite | null | undefined) => {
      const otherS = s == this._cardImageOne ? this._cardImageTwo : this._cardImageOne;

      this._selectedBonus.name = s == this._cardImageOne ? bonus.cardOne : bonus.cardTwo;
      this._selectedBonus.price = s == this._cardImageOne ?
        bonus.cardOnePrice.toString() :
        bonus.cardTwoPrice.toString();

      enableCard(s);
      enableCard(otherS, false);
    };

    c1Node.on(Node.EventType.TOUCH_START, () => selectCard(this._cardImageOne), this)
    c2Node.on(Node.EventType.TOUCH_START, () => selectCard(this._cardImageTwo), this)
  }

  closeFinalWindow() {
    this.closeBonusEvents();

    this._state.addLevel(this._config.levelName);

    this._settingsLoader.saveGameState();
    this._sceneLoader.loadLevel("LvlScene");
  }
}
