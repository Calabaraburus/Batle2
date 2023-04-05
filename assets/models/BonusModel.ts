//  BonusModel.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  CCBoolean,
  CCInteger,
  CCString,
  Component,
  SpriteFrame,
  _decorator,
} from "cc";
const { ccclass, property } = _decorator;

/**
 * Represents bonus model
 */
@ccclass("BonusModel")
export class BonusModel extends Component {
  @property(CCString)
  mnemonic = "mnem";

  //** Amount of tiles that need to be destroied to activate bonus */
  @property({ type: CCInteger })
  public priceToActivate: number;

  @property({ type: SpriteFrame })
  public sprite: SpriteFrame;

  @property({ type: SpriteFrame })
  public unactiveSprite: SpriteFrame;

  @property({ type: CCBoolean })
  public active: boolean;

  //** Tiles of what type need to destroy to activate bonus */
  @property(CCString)
  public activateType = "-";

  //** Current amount that already destroied */
  private _currentAmmountToActivate = 0;

  get currentAmmountToActivate() {
    return this._currentAmmountToActivate;
  }

  set currentAmmountToActivate(value) {
    if (value < 0) value = 0;

    this._currentAmmountToActivate = value;
  }

  selected = false;

  alreadyUsedOnTurn = false;
}
