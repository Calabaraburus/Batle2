import { _decorator } from "cc";
import { FieldController } from "../../field/FieldController";
import { StarTileController } from "../StarTile/StarTileController";
import { TileController } from "../TileController";
import { TileInterBehaviour } from "../TileInterBehaviour";
import { TileState } from "../TileState";
import { StdTileController } from "../UsualTile/StdTileController";
const { ccclass } = _decorator;

/**
 * Implements behaviour for simple tiles
 */
@ccclass("StdTileInterBehaviour")
export class StdTileInterBehaviour extends TileInterBehaviour {
  private tileStateToLogic = new Map<TileState, string>();

  constructor() {
    super();
    this.tileStateToLogic[TileState.bomb] = "bomb";
    this.tileStateToLogic[TileState.empty] = "empty";
    this.tileStateToLogic[TileState.rocket] = "rocket";
    this.tileStateToLogic[TileState.star] = "star";
  }

  tileClicked(field: FieldController, tile: TileController) {
    if (field.bonus != null) {
      return;
    }

    if (!(tile instanceof StdTileController)) {
      return;
    }

    const connectedTiles = field.fieldAnalizer.getConnectedTiles(tile);
    const stdTile = tile as StdTileController;

    const modelName = this.tileStateToLogic[stdTile.state];
    const model = this.field.fieldModel.getTileModel(modelName);

    if (model != null && stdTile.state != TileState.empty) {
      const resTile = field.createTile({
        row: tile.row,
        col: tile.col,
        tileModel: model,
        putOnField: true,
      });

      if (resTile instanceof StarTileController) {
        const star = resTile as StarTileController;
        star.createdForm(tile.tileModel);
      }
    }

    connectedTiles.forEach((item) => item.destroyTile());
  }
}
