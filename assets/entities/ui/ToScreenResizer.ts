import { _decorator, Camera, Component, director, UITransform, Vec3, view } from 'cc';
import { shell } from 'electron';
const { ccclass, property } = _decorator;

@ccclass('ToScreenResizer')
export class ToScreenResizer extends Component {
    start(): void {
        const a = view.getVisibleSize();
        const uiTrfrm = this.getComponent(UITransform);

        if (uiTrfrm == null) return;

        if (uiTrfrm.anchorY == 1) {
            const dp = this.node.worldPosition.y - uiTrfrm.contentSize.height;
            if (dp < 0) {
                const scale = (uiTrfrm.contentSize.height + dp) / uiTrfrm.contentSize.height;
                this.node.scale = new Vec3(scale, scale, 1);
            }
        } else if (uiTrfrm.anchorY == 0) {
            const dp = this.node.worldPosition.y + uiTrfrm.contentSize.height;
            const sHeight = view.getVisibleSize().height;
            if (dp > sHeight) {
                const scale = (uiTrfrm.contentSize.height - (dp - sHeight)) / uiTrfrm.contentSize.height;
                this.node.scale = new Vec3(scale, scale, 1);
            }
        }
    }
}
