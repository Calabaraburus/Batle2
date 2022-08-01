import { _decorator, Node, CCInteger } from 'cc';
import { TileController } from '../TileController';
const { ccclass, property } = _decorator;

@ccclass('BombTileController')
export class BombTileController extends TileController {
    @property(Node)
    bombSpriteNode: Node;

    @property(CCInteger)
    fireDistance: number = 2;

    destroyTile() {
        super.destroyTile();
        this.bombSpriteNode.active = false;
    }
}
