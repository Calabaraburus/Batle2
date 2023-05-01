import { BonusModel } from "../../models/BonusModel";
import { PlayerModel } from "../../models/PlayerModel";
import { PopupWindow } from "./PopupWindow";
import { Label, Sprite, SpriteFrame, _decorator, find } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerInfoWindow")
export class PlayerInfoWindow extends PopupWindow {
  public setPlayer(playerModel: PlayerModel) {
    const playerName = playerModel.playerName;
    const heroImage = playerModel.heroImage;
    const bonuses = playerModel.bonuses;

    const componentName = this.node
      .getChildByName("NamePlayer")
      ?.getComponent(Label);
    if (!componentName) return;
    componentName.string = playerName;

    const componentHeroImage = this.node
      .getChildByPath("GraphicsHeroImage/HeroImage")
      ?.getComponent(Sprite);
    if (!componentHeroImage) return;
    componentHeroImage.spriteFrame = heroImage;

    //bonuses
    const componentBonuseList = [
      this.node
        .getChildByPath("Cards/GraphicsCardOne/BonusCard")
        ?.getComponent(Sprite),
      this.node
        .getChildByPath("Cards/GraphicsCardTwo/BonusCard")
        ?.getComponent(Sprite),
      this.node
        .getChildByPath("Cards/GraphicsCardThree/BonusCard")
        ?.getComponent(Sprite),
    ];

    for (let i = 0; i < componentBonuseList.length; i++) {
      if (
        componentBonuseList[i] != null ||
        componentBonuseList[i] != undefined
      ) {
        componentBonuseList[i]!.spriteFrame = bonuses[i].cardImage;
      }
    }
  }
}
