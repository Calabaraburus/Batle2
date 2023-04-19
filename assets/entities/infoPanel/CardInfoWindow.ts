import { Label } from "cc";
import { BonusModel } from "../../models/BonusModel";
import { PopupWindow } from "./PopupWindow";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CardInfoWindow")
export class CardInfoWindow extends PopupWindow {
  public setCard(cardModel: BonusModel) {
    const cardName = cardModel.name;

    const componentName = this.node.getChildByName("NameBonus");
    if (!componentName) return;
    const label = componentName?.getComponent(Label);
    if (!label) return;
    label.string = cardName;
  }
}
