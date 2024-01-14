import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { Service } from '../../services/Service';
const { ccclass, property } = _decorator;

@ccclass('Window')
export class Window extends Service {

    private _origPos: Vec3;
    private _groups: Node[] = [];

    private set origPos(value: Vec3) {
        this._origPos = value;
    }

    private get origPos() {
        return this._origPos;
    }

    start() {
        this.origPos = this.node.position.clone();
        this.fillGroupArr();
        this.showContentGroup("default");
    }

    private fillGroupArr() {
        const content = this.node.children.find(n => n.name == "content");

        if (content) {
            content.children.forEach(n => {
                if (n.name.toLowerCase().endsWith('group')) {
                    this._groups.push(n);
                }
            });
        }
    }

    public showWindow() {
        this.node.active = true;

        tween(this.node)
            .to(0.4, { position: new Vec3(0, 0, 0) }, { easing: "backInOut" })
            .start();
    }

    public hideWindow() {

        tween(this.node)
            .to(0.4, { position: this.origPos }, { easing: "backOut" })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }

    public showContentGroup(groupName: string) {

        this._groups.forEach(g => {
            g.active = g.name.toLowerCase() == groupName + "group" ? true : false;
        });

    }
}


