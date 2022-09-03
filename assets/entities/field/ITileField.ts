import { FieldModel } from "../../models/FieldModel";
import { TileController } from "../tiles/TileController";
import { ReadonlyMatrix2D } from "./ReadonlyMatrix2D";

export interface ITileField {
  get fieldMatrix(): ReadonlyMatrix2D<TileController>;
  get fieldModel(): FieldModel;
}
