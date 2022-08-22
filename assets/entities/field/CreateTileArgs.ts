import { Vec3 } from "cc";
import { TileModel } from "../../models/TileModel";

export interface CreateTileArgs {
  /** row position on logic field */
  row: number;

  /** col position on logic field */
  col: number;

  /** tile model */
  tileModel: TileModel;

  /** real position on scene  */
  position?: Vec3 | null;

  /** determines the need of putting tile on logic field
   * (game puts tile only to the scene)
   */
  putOnField?: boolean;
}
