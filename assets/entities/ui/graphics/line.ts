import { _decorator, CCFloat, Color, color, Component, Graphics, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapLine')
export class MapLine extends Component {

    @property(Node)
    aPoint: Node;

    @property(Node)
    bPoint: Node;

    @property(Graphics)
    graphic: Graphics;

    @property(CCFloat)
    lineWidth: number = 40;

    @property(CCFloat)
    dashSize: number = 40;

    @property(CCFloat)
    dashDistance: number = 20;

    //    @property(Color)
    color: Color = new Color("7f1919ff");

    start() {
        this.drawDashedLine(this.aPoint.position, this.bPoint.position);
    }

    drawDashedLine(origin: Vec3, destination: Vec3) {
        const dir = new Vec3();
        Vec3.subtract(dir, destination, origin);
        dir.normalize();

        const dist = Vec3.distance(origin, destination);

        this.graphic.lineWidth = this.lineWidth;
        this.graphic.strokeColor = this.color;

        let delta1 = new Vec3();
        Vec3.multiplyScalar(delta1, dir, this.dashSize + this.dashDistance);

        let delta2 = new Vec3();
        Vec3.multiplyScalar(delta2, dir, this.dashSize);

        let p1 = origin.clone();
        let p2 = origin.clone();

        for (let i: number = 0; i <= dist / (this.dashSize + this.dashDistance); i++) {
            Vec3.add(p2, p1, delta2);

            this.graphic.moveTo(p1.x, p1.y);
            this.graphic.lineTo(p2.x, p2.y);

            p1.add(delta1);
        }

        this.graphic.stroke();
    }
}


