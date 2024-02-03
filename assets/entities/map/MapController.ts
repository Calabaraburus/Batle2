import { _decorator, assert, Component, gfx, Node } from 'cc';
import { LevelMapObjectsController } from './LevelMapObjectsController';
import { MapGraphics } from './MapGraphics';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MapController')
export class MapController extends Component {
    @property(Node)
    marker: Node;

    @property(Node)
    content: Node;

    private _levelObjects = new Map<string, LevelMapObjectsController>();
    private _graphics: MapGraphics | null | undefined;

    start(): void {
        this.fillLvlObjects(this.content);
        this._graphics = this.content.getChildByName('graphics')?.getComponent(MapGraphics);
    }

    setCurrent(lvlObj: LevelMapObjectsController) {
        this.marker.position = lvlObj.levelButtonNode.position.clone();
    }

    getLvlObject(key: string) {
        return this._levelObjects.get(key);
    }

    activateLvlObjects(key: string[], activate = true) {
        key.forEach(k => { this.activateLvlObjectByKey(k, activate) });
    }

    activateLvlObjectByKey(key: string, activate = true) {
        const lvl = this._levelObjects.get(key);
        if (lvl) {
            this.activateLvlObject(lvl, activate);
        }
    }

    activateLvlObject(lvlObj: LevelMapObjectsController, activate = true) {
        lvlObj.levelButtonNode.active = activate;
        lvlObj.editionalObjects.forEach(o => o.active = activate);
        this._graphics?.Refresh();
    }

    activateAll(activate = true) {
        this._levelObjects.forEach(lo => { this.activateLvlObject(lo, activate) });
    }

    fillLvlObjects(root: Node) {
        root.children.forEach(c => {
            if (c.name.toLowerCase().startsWith("lvl")) {
                this.addLvlObject(c);
            } else {
                this.fillLvlObjects(c);
            }
        });
    }

    addLvlObject(objNode: Node) {
        const nameParts = objNode.name.toLowerCase().split("_");
        let lvlMapObj: LevelMapObjectsController | undefined;
        const lvlName = nameParts[0];

        if (this._levelObjects.has(lvlName)) {
            lvlMapObj = this._levelObjects.get(lvlName);
        } else {
            lvlMapObj = new LevelMapObjectsController();
        }

        assert(lvlMapObj != null);

        lvlMapObj.levelName = lvlName;

        if (nameParts[1] == 'btn') {
            lvlMapObj.levelButtonNode = objNode;
        } else {
            lvlMapObj.editionalObjects.push(objNode);
        }

        this._levelObjects.set(lvlName, lvlMapObj);

    }
}
