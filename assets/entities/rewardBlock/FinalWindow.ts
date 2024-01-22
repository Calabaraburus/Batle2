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

  cardImageOne: Sprite | null | undefined;
  cardImageTwo: Sprite | null | undefined;
  cardFlagSelector: string;

  settingsLoader: SettingsLoader;
  state: PlayerCurrentGameState;

  timeTurn = 0.6;

  private _selectedBonus: string;

  private _overlayWnd: OverlayWindow | null;
  private _wnd: Window | null;
  private _sceneLoader: SceneLoaderService;

  start() {
    this._config = this.getServiceOrThrow(LevelConfiguration);
    this._overlayWnd = this.getComponent(OverlayWindow);
    this._wnd = this.getComponent(Window);
    this._sceneLoader = this.getServiceOrThrow(SceneLoaderService);

    this.cardFlagSelector = "empty";

    const tService = this.getService(SettingsLoader);

    assert(tService != null, "SettingsLoader can't be found");

    this.settingsLoader = tService;

    this.state = this.settingsLoader.playerCurrentGameState;

    this._bonusOperations.set(EndLevelLifeBonusModel, {
      init: (bonus) => {
        if (bonus instanceof EndLevelLifeBonusModel) {
          this.bonusLife = bonus.life;

          this.initLife();
        }
      },
      open: () => {

      }, close: () => {
        this.state.life += parseFloat(this.bonusLife);
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
          this.state.cards.push({ mnemonic: bonus.cardMnemonic, price: '' });
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
        const sBonus = this._config?.getBonus(this._selectedBonus);
        if (sBonus) {

          let bonusIsUpdated = false;
          // try to update bonus
          this.state.cards.forEach(c => {
            const b = this._config?.getBonus(c.mnemonic);
            if (b != null && b.baseCardMnemonic == sBonus.baseCardMnemonic) {
              c.mnemonic = sBonus.mnemonic;
              bonusIsUpdated = true;
            }
          });

          if (!bonusIsUpdated) {
            this.state.cards.push({ mnemonic: this._selectedBonus, price: '' });
          }
        }
      }
    });

    this.initBonuses();
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

    this.cardImageOne = this.cardChoice
      .getChildByName("CardOne")
      ?.getComponent(Sprite);

    this.cardImageTwo = this.cardChoice
      .getChildByName("CardTwo")
      ?.getComponent(Sprite);

    assert(this.cardImageOne != null);
    assert(this.cardImageTwo != null);

    if (!bonusModelSelectorOne || !bonusModelSelectorTwo) return;

    this.cardChoice.active = true;
    this.cardImageOne.spriteFrame = bonusModelSelectorOne.sprite;
    this.cardImageTwo.spriteFrame = bonusModelSelectorTwo.sprite;

    const c1Node = this.cardImageOne.node;
    const c2Node = this.cardImageTwo.node;

    let enableCard = (s: Sprite | null | undefined, enable = true) => {
      if (s != null) {
        s.material = enable ? this.defaultMaterial : this.materialForDisables;
        s.color = enable ? this.colorForEnables : this.colorForDisables;
      }

    };

    enableCard = enableCard.bind(this);

    enableCard(this.cardImageOne, false);
    enableCard(this.cardImageTwo, false);

    const selectCard = (s: Sprite | null | undefined) => {
      const otherS = s == this.cardImageOne ? this.cardImageTwo : this.cardImageOne;

      this._selectedBonus = s == this.cardImageOne ? bonus.cardOne : bonus.cardTwo;

      enableCard(s);
      enableCard(otherS, false);
    };

    c1Node.on(Node.EventType.TOUCH_START, () => selectCard(this.cardImageOne), this)
    c2Node.on(Node.EventType.TOUCH_START, () => selectCard(this.cardImageTwo), this)
  }

  closeFinalWindow() {
    this.closeBonusEvents();

    this.settingsLoader.playerCurrentGameState.addLevel(this._config.levelName);

    this.settingsLoader.saveGameState();
    this._sceneLoader.loadLevel("LvlScene");
  }
}
