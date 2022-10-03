import { _decorator, Component, Sprite, Label, Button, tween, Vec3 } from "cc";
import { BonusModel } from "../../../models/BonusModel";
import { CardFieldController } from "./CardFieldController";
const { ccclass, property } = _decorator;

@ccclass("CardController")
export class CardController extends Component {
  private _model: BonusModel;
  private _cardField: CardFieldController | null | undefined;
  private _button: Button | null;
  private _fromPos: Vec3;
  private _toPos: Vec3;
  private _fromScale: Vec3;
  private _toScale: Vec3;
  private _animMultiplier = 1.2;
  private _animSift = 15;
  private _selected: boolean;
  @property(Sprite)
  sprite: Sprite;

  @property(Label)
  lblPrice: Label;

  get model(): BonusModel {
    return this._model;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    if (this._selected != value) {
      if (this._model.selected != value) {
        this._model.selected = value;
      }
      this._selected = value;
      this.animateSelect();
    }
  }

  setModel(model: BonusModel) {
    this._model = model;
    this.updateData();
  }

  start() {
    this._fromScale = this.node.scale.clone();
    this._toScale = new Vec3(
      this._fromScale.x * this._animMultiplier,
      this._fromScale.y * this._animMultiplier,
      this._fromScale.z
    );

    this._fromPos = this.node.position.clone();

    this._toPos = new Vec3(
      this._fromPos.x,
      this._fromPos.y + this._animSift,
      this._fromPos.z
    );
  }

  updateData() {
    if (this._button == null) {
      this._button = this.getComponent(Button);
    } else {
      this._button.interactable =
        this._model.active && !this.model.alreadyUsedOnTurn;
    }

    this.sprite.spriteFrame = this._model.sprite;
    this.lblPrice.string = this._model.price.toString();

    this.selected = this.model.selected;
  }

  cardClick() {
    this.selected = !this.selected;

    this.node.emit("cardClicked", this, this.selected);
  }

  animateSelect() {
    tween(this.node)
      .to(
        0.1,
        {
          position: this.selected ? this._toPos : this._fromPos,
          scale: this.selected ? this._toScale : this._fromScale,
        },
        { easing: "sineIn" }
      )
      .start();
  }
}
