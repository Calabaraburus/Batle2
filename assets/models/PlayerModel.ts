import {
  _decorator,
  CCInteger,
  CCString,
  Component,
  CCFloat,
  SpriteFrame,
} from "cc";
import { BonusModel } from "./BonusModel";
const { ccclass, property } = _decorator;

/**
 * Represents player model
 */
@ccclass("PlayerModel")
export class PlayerModel extends Component {
  private _activeBonus: BonusModel | null;

  @property({ type: CCString })
  playerName = "player";

  @property({ type: CCInteger })
  life = 100;

  @property({ type: CCInteger })
  lifeMax = 100;

  @property({ type: CCInteger })
  manaMax = 50;

  @property({ type: CCInteger })
  manaCurrent = 0;

  @property({ type: CCFloat })
  manaIncreaseCoeficient = 1;

  @property({ type: CCFloat })
  power = 5;

  @property(SpriteFrame)
  heroSprite: SpriteFrame;

  @property({ type: BonusModel })
  bonuses: BonusModel[] = [];

  get activeBonus(): BonusModel | null {
    return this._activeBonus;
  }

  public unSetBonus(): void {
    if (this._activeBonus != null) this._activeBonus.selected = false;
    this._activeBonus = null;
  }

  public setBonus(bonus: BonusModel): void {
    this._activeBonus = bonus;
    this._activeBonus.selected = true;
  }

  public isBonusSet(): boolean {
    return this._activeBonus != null;
  }
}
