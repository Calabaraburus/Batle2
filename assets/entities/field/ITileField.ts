import { FieldModel } from "../../models/FieldModel";
import { TileModel } from "../../models/TileModel";
import { TileController } from "../tiles/TileController";
import { ReadonlyMatrix2D } from "./ReadonlyMatrix2D";

export interface ITileField {
  get fieldMatrix(): ReadonlyMatrix2D<TileController>;
  get fieldModel(): FieldModel;
  get tiles(): Array<TileController>;

  getStartTile(roteId: number): TileController | null;
  getEndTile(roteId: number): TileController | null;
  getTile(roteId: number, tileType: TileModel): TileController | null;
}
