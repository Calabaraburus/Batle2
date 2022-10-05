import { _decorator } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { TileController } from "../tiles/TileController";
import { StdTileController } from "../tiles/UsualTile/StdTileController";
import { DataService } from "./DataService";
import { Service } from "./Service";
const { ccclass } = _decorator;

@ccclass("TileService")
export class TileService extends Service {
  _dataService: DataService | null;

  start() {
    this._dataService = this.getService(DataService);
  }

  public prepareForNewTurn() {
    this._dataService?.field?.fieldMatrix.forEach((t) =>
      this.prepareTileForNewTurn(t)
    );
  }

  private prepareTileForNewTurn(tile: TileController) {
    if (tile instanceof StdTileController) {
      tile.activateShield(false);
    }
  }

  public getTilesByTagInColumn(colId: number, tag: string) {
    const tiles: TileController[] = [];
    this._dataService?.field?.fieldMatrix.forEachCol(colId, (t) => {
      if (t.tileModel.containsTag(tag)) {
        tiles.push(t);
      }
    });

    return tiles;
  }
}
