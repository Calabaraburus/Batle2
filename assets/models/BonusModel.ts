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

  @property({ type: CCInteger })
  public price: number;

  @property({ type: SpriteFrame })
  public sprite: SpriteFrame;

  @property({ type: CCBoolean })
  public active: boolean;

  /** Turns amount bonus active for*/
  @property({ type: CCInteger })
  public life = 0;

  currentLife = 0;

  selected = false;

  alreadyUsedOnTurn = false;
}
