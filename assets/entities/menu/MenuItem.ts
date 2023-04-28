import {
  _decorator,
  CCString,
  Component,
  Enum,
  Node,
  RichText,
  Sprite,
  SpriteFrame,
} from "cc";
const { ccclass, property } = _decorator;

enum buttonBgTypes {
  default = 0,
  another = 1,
}

Enum(buttonBgTypes);

@ccclass("MenuItem")
export class MenuItem extends Component {
  @property({ type: buttonBgTypes }) menuItemType: buttonBgTypes = 0;
  @property(SpriteFrame) bgSprite: SpriteFrame;
  @property(Sprite) iconSprite: Sprite;
  @property(RichText) itemName: RichText;
  @property(CCString) titel = "item name";

  start() {
    this.init();
  }
  init() {
    this.initTitle();
  }

  initTitle() {
    this.itemName.string = this.titel.toUpperCase();
  }
}
