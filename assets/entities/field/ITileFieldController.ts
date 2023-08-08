import { FieldModel } from "../../models/FieldModel";
import { TileModel } from "../../models/TileModel";
import { TileController } from "../tiles/TileController";
import { ReadonlyMatrix2D } from "./ReadonlyMatrix2D";

export interface ITileFieldController {
  get fieldMatrix(): ReadonlyMatrix2D<TileController>;
  get fieldModel(): FieldModel;
  get tiles(): Array<TileController>;

  getStartTile(roteId: number): TileController | null;
  getEndTile(roteId: number): TileController | null;
  getTile(roteId: number, tileType: TileModel): TileController | null;
  moveTilesLogicaly(backwards: boolean): void;
  destroyTile(
    row: number,
    col: number,
    creteria: (tc: TileController) => boolean,
    destroyServiceTile?: boolean
  ): void;
  moveTilesAnimate(): void;

}
