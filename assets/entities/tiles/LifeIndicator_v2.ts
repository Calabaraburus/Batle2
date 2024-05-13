import {
    _decorator,
    __private,
    Component,
    CCInteger,
    SpriteFrame,
    Node,
    Sprite,
    UITransform,
    Size,
    Label
} from "cc";

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("LifeIndicator_v2")
@executeInEditMode(true)
export class LifeIndicator_v2 extends Component {
    private _activeLifes: number;

    @property(Label)
    label: Label;

    @property(CCInteger)
    get activeLifes() {
        return this._activeLifes;
    }

    set activeLifes(value: number) {
        this._activeLifes = value;
        this.label.string = value.toString();
    }

    start(): void {
        this.label.string = this._activeLifes.toString()
    }
}
