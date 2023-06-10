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
import { AudioManager } from "../../soundsPlayer/AudioManager";
const { ccclass, property } = _decorator;

enum buttonBgTypes {
  default = 0,
  another = 1,
}

Enum(buttonBgTypes);

@ccclass("MenuOptionsItem")
export class MenuOptionsItem extends Component {
  @property({ type: buttonBgTypes }) menuItemType: buttonBgTypes = 0;
  @property(SpriteFrame) bgSprite: SpriteFrame;
  @property(Sprite) iconSprite: Sprite;

  private _flag: boolean;

  start(): void {
    this._flag = false;
    this.node.on(Node.EventType.MOUSE_DOWN, this.changeVolumeFlag, this);

    if (this._flag == false) {
      this.getCurrentVolumeFlag();
    }
    this._flag = false;
  }

  getCurrentVolumeFlag() {
    let currentVolume;
    const parentCurrentNode = this.node.parent;
    if (!parentCurrentNode) return;
    if (parentCurrentNode.name == "Music") {
      currentVolume = AudioManager.instance._volumeMusic;
    } else if (parentCurrentNode.name == "Sound") {
      currentVolume = AudioManager.instance._volumeSound;
    }

    if (this.node.name == "Off" && currentVolume == 0) {
      this.searchVolumeFlag();
    } else if (this.node.name == "Low" && currentVolume == 0.2) {
      this.searchVolumeFlag();
    } else if (this.node.name == "Middle" && currentVolume == 0.4) {
      this.searchVolumeFlag();
    } else if (this.node.name == "Hight" && currentVolume == 1) {
      this.searchVolumeFlag();
    }
  }

  searchVolumeFlag() {
    const elem = this.node.getChildByPath("buttonPriceZone/volumeActive");

    this.resetActiveNodes();

    if (!elem) return;
    elem.active = true;
  }

  changeVolumeFlag() {
    const elem = this.node.getChildByPath("buttonPriceZone/volumeActive");

    this.resetActiveNodes();

    if (!elem) return;
    elem.active = true;

    this._flag = true;
  }

  resetActiveNodes() {
    const elemList = [
      this.node.parent?.getChildByPath("Off/buttonPriceZone/volumeActive"),
      this.node.parent?.getChildByPath("Low/buttonPriceZone/volumeActive"),
      this.node.parent?.getChildByPath("Middle/buttonPriceZone/volumeActive"),
      this.node.parent?.getChildByPath("Hight/buttonPriceZone/volumeActive"),
    ];

    elemList.forEach((elem) => {
      if (!elem) return;
      elem.active = false;
    });
  }
}
