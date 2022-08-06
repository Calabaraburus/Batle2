import { TileModel } from "../../models/TileModel";
import { TileController } from "../tiles/TileController";

export class AnalizedData {
  destroiedTilesCount: number = 0;
  aliveTilesCount: number = 0;
  specialTiles: number = 0;
  justCreatedTiles: TileController[] = [];
  connectedTiles: TileTypeToConnectedTiles[] = [];
  individualTiles: TileController[] = [];
}

export class TileTypeToConnectedTiles {
  tileModel: TileModel;
  connectedTiles: Set<TileController>;
}
