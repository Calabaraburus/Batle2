import { Node, _decorator, assert, find, pseudoRandom } from "cc";
import { Service } from "../services/Service";
import { AttackSignalComponent } from "./AttackSignalComponent";
import { FieldController } from "../field/FieldController";
import { StdTileController } from "../tiles/UsualTile/StdTileController";
import { PlayerModel } from "../../models/PlayerModel";
import { CardService } from "../services/CardService";
import { TileController } from "../tiles/TileController";
import { DataService } from "../services/DataService";
const { ccclass, property } = _decorator;
@ccclass("AttackSignalController")
export class AttackSignalController extends Service {
  dataService: DataService;
  fieldModel: FieldController;
  playerSide: AttackSignalComponent[];
  enemySide: AttackSignalComponent[];
  sides: Node[];

  start() {
    const f = this.getService(FieldController);
    assert(f, "FieldController not found");
    this.fieldModel = f;

    const s = this.node.children;
    assert(s, "Nodes not found");
    this.sides = s;

    const t = this.getService(DataService);
    assert(t, "DataService not found");
    this.dataService = t;

    for (let i = 0; i < this.fieldModel.fieldMatrix.cols; i++) {
      const pSignal = this.getSideComponent(i, this.sides[0]);
      if (!pSignal) return;
      this.playerSide.push(pSignal);

      const eSignal = this.getSideComponent(i, this.sides[1]);
      if (!eSignal) return;
      this.playerSide.push(eSignal);
    }
  }

  public updateData() {
    for (let colNum = 0; colNum < this.fieldModel.fieldMatrix.cols; colNum++) {
      const startTile = this.fieldModel.getStartTile(colNum);
      const endTile = this.fieldModel.getEndTile(colNum);
      if (startTile?.playerModel == this.dataService.botModel) {
        if (this.playerSide[colNum].active == false) {
          this.playerSide[colNum].showWindow();
          this.playerSide[colNum].active = true;
        }
      } else if (this.playerSide[colNum].active == true) {
        this.playerSide[colNum].hideWindow();
        this.playerSide[colNum].active = false;
      }

      if (endTile?.playerModel == this.dataService.botModel) {
        if (this.enemySide[colNum].active == false) {
          this.enemySide[colNum].showWindow();
          this.enemySide[colNum].active = true;
        }
      } else if (this.enemySide[colNum].active == true) {
        this.enemySide[colNum].hideWindow();
        this.enemySide[colNum].active = false;
      }
    }
  }

  getSideComponent(colNum: number, side: Node) {
    const aSignalComponent = side
      .getChildByName(colNum.toString())
      ?.getComponent(AttackSignalComponent);
    if (!aSignalComponent) return;

    return aSignalComponent;
  }
}
