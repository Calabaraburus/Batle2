import { _decorator, Component, EditBox, instantiate, Layout, Node, Prefab, UITransform, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {

    @property(Number)
    rows: number = 2;

    @property(Prefab)
    rowPrefab: Prefab;

    public cells: EditBox[][] = []

    start() {


        //const rowTemplate = this.node.getChildByName("GridRowTemplate");
        const rowsNode = this.node.getChildByName("rows");

        for (let ri = 0; ri < this.rows; ri++) {

            const row = instantiate(this.rowPrefab);
            /*const rtfm = row.addComponent(UITransform);
            rtfm.height = 50;
            //  rtfm.anchorX = 0;

            const widget = row.addComponent(Widget);
            const ly = row.addComponent(Layout);
            ly.type = 1;
            widget.isAlignRight = true;
            widget.isAlignLeft = true;
            widget.left = 0;
            widget.right = 0;
*/


            rowsNode?.addChild(row);

        }
    }
}


