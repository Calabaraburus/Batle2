//  TileModel.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { _decorator, Component, SpriteFrame, CCInteger, Color } from "cc";
import { AdittionalSprite as AdditionalSprite } from "./AdittionalSprite";
const { ccclass, property } = _decorator;

/**
 * Represents tile model
 */
@ccclass("TileModel")
export class TileModel extends Component {
  @property({ type: CCInteger, visible: true })
  tileId = 0;

  @property({ visible: true })
  tileName = "";

  @property({ type: SpriteFrame, visible: true })
  sprite: SpriteFrame = null;

  @property({ visible: true })
  starColor: Color = new Color();

  @property({ visible: true })
  specialTile = false;

  @property({ type: AdditionalSprite, visible: true })
  additionalSprites: AdditionalSprite[] = [];

  public findAdditionalSprite(name: string): SpriteFrame {
    const res = this.additionalSprites.filter((item) => item.name == name);

    if (res.length != 0) {
      return res[0].sprite;
    } else {
      return null;
    }
  }
}
